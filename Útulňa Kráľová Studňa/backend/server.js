const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy (needed when behind nginx)
app.set('trust proxy', 1);

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db',
  database: process.env.DB_NAME || 'utulna',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Initialize database tables
async function initDatabase() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255),
        name VARCHAR(255),
        picture TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create visits table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date_from DATE NOT NULL,
        date_to DATE,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create forum_posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title TEXT,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create forum_replies table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES forum_posts(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
console.log('FRONTEND_URL configured as:', frontendUrl);

app.use(cors({
  origin: frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
  resave: false,
  saveUninitialized: true, // Allow saving uninitialized sessions (needed for OAuth)
  name: 'utulna.sid',
  cookie: {
    secure: false, // Set to false for HTTP in development
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax', // Use 'lax' for development, 'none' for production HTTPS
    path: '/'
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Debug middleware - log all requests
app.use((req, res, next) => {
  if (req.path.startsWith('/auth') || req.path.startsWith('/api')) {
    console.log(`[${req.method}] ${req.path}`);
    console.log('Cookies:', req.cookies);
    console.log('Session ID from cookie:', req.cookies?.['utulna.sid']);
    console.log('Session ID from req:', req.sessionID);
    console.log('Session exists:', !!req.session);
    if (req.session) {
      console.log('Session passport:', req.session.passport);
    }
    console.log('Is authenticated:', req.isAuthenticated());
  }
  next();
});

// Passport Google OAuth Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Only initialize Google OAuth if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    const userResult = await pool.query(
      'SELECT * FROM users WHERE google_id = $1',
      [profile.id]
    );

    let user;
    if (userResult.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (google_id, email, name, picture) VALUES ($1, $2, $3, $4) RETURNING *',
        [
          profile.id,
          profile.emails[0].value,
          profile.displayName,
          profile.photos[0]?.value
        ]
      );
      user = insertResult.rows[0];
    } else {
      // Update existing user
      const updateResult = await pool.query(
        'UPDATE users SET email = $1, name = $2, picture = $3 WHERE google_id = $4 RETURNING *',
        [
          profile.emails[0].value,
          profile.displayName,
          profile.photos[0]?.value,
          profile.id
        ]
      );
      user = updateResult.rows[0];
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
  }));
} else {
  console.warn('⚠️  Google OAuth credentials not provided. OAuth authentication will not work.');
  console.warn('   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables to enable OAuth.');
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Auth routes
app.get('/auth/google',
  (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return res.status(503).json({ 
        error: 'OAuth not configured', 
        message: 'Google OAuth credentials are not set. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.' 
      });
    }
    console.log('OAuth start - Session ID:', req.sessionID);
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('=== OAuth Callback ===');
    console.log('User authenticated:', req.isAuthenticated());
    console.log('User:', req.user);
    console.log('Session ID:', req.sessionID);
    console.log('Session passport:', req.session?.passport);
    console.log('Cookies before save:', req.cookies);
    console.log('======================');
    
    // Save session before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Error saving session:', err);
      } else {
        console.log('Session saved successfully');
        console.log('Session after save:', req.session);
      }
      
      // Set cookie manually if needed
      res.cookie('utulna.sid', req.sessionID, {
        httpOnly: true,
        secure: false, // Set to false for HTTP in development
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
      });
      
      res.redirect(process.env.FRONTEND_URL || 'http://localhost:8080');
    });
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:8080');
  });
});

app.get('/auth/user', (req, res) => {
  console.log('=== Auth Check ===');
  console.log('Session ID:', req.sessionID);
  console.log('Cookies:', req.cookies);
  console.log('Is authenticated:', req.isAuthenticated());
  console.log('User:', req.user);
  console.log('Session passport:', req.session?.passport);
  console.log('Full session:', JSON.stringify(req.session, null, 2));
  console.log('==================');
  
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        picture: req.user.picture
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

// Visits routes
app.get('/api/visits', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await pool.query(`
      SELECT 
        v.id,
        v.date_from,
        v.date_to,
        v.note,
        v.created_at,
        u.id as user_id,
        u.name,
        u.email,
        u.picture
      FROM visits v
      JOIN users u ON v.user_id = u.id
      WHERE v.date_from >= $1
      ORDER BY v.date_from ASC
    `, [today]);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching visits:', error);
    res.status(500).json({ error: 'Failed to fetch visits' });
  }
});

app.post('/api/visits', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { dateFrom, dateTo, note } = req.body;

    if (!dateFrom) {
      return res.status(400).json({ error: 'dateFrom is required' });
    }

    // Validate date range
    const fromDate = new Date(dateFrom);
    const toDate = dateTo ? new Date(dateTo) : fromDate;

    if (toDate < fromDate) {
      return res.status(400).json({ error: 'dateTo cannot be before dateFrom' });
    }

    // Check for overlapping visits by the same user
    const overlapCheck = await pool.query(`
      SELECT id FROM visits
      WHERE user_id = $1
      AND (
        (date_from <= $2 AND (date_to >= $3 OR date_to IS NULL))
        OR (date_from <= $3 AND (date_to >= $2 OR date_to IS NULL))
      )
    `, [req.user.id, dateTo || dateFrom, dateFrom]);

    if (overlapCheck.rows.length > 0) {
      // Delete overlapping visits
      await pool.query(
        'DELETE FROM visits WHERE id = ANY($1)',
        [overlapCheck.rows.map(r => r.id)]
      );
    }

    // Insert new visit
    const result = await pool.query(`
      INSERT INTO visits (user_id, date_from, date_to, note)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [
      req.user.id,
      dateFrom,
      dateTo && dateTo !== dateFrom ? dateTo : null,
      note || null
    ]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating visit:', error);
    res.status(500).json({ error: 'Failed to create visit' });
  }
});

app.delete('/api/visits/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const visitId = parseInt(req.params.id);

    // Check if visit belongs to user
    const checkResult = await pool.query(
      'SELECT user_id FROM visits WHERE id = $1',
      [visitId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    if (checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.query('DELETE FROM visits WHERE id = $1', [visitId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting visit:', error);
    res.status(500).json({ error: 'Failed to delete visit' });
  }
});

// Forum routes
app.get('/api/forum/posts', async (req, res) => {
  try {
    const postsResult = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.name,
        u.email,
        u.picture
      FROM forum_posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT 50
    `);

    // Get replies for each post
    const posts = postsResult.rows;
    for (let post of posts) {
      const repliesResult = await pool.query(`
        SELECT 
          r.id,
          r.content,
          r.created_at,
          r.updated_at,
          u.id as user_id,
          u.name,
          u.email,
          u.picture
        FROM forum_replies r
        JOIN users u ON r.user_id = u.id
        WHERE r.post_id = $1
        ORDER BY r.created_at ASC
      `, [post.id]);
      
      post.replies = repliesResult.rows;
    }

    res.json(posts);
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({ error: 'Failed to fetch forum posts' });
  }
});

app.post('/api/forum/posts', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { title, content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const result = await pool.query(`
      INSERT INTO forum_posts (user_id, title, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [
      req.user.id,
      title && title.trim() ? title.trim() : null,
      content.trim()
    ]);

    // Fetch the post with user info
    const postResult = await pool.query(`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.created_at,
        p.updated_at,
        u.id as user_id,
        u.name,
        u.email,
        u.picture
      FROM forum_posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(postResult.rows[0]);
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({ error: 'Failed to create forum post' });
  }
});

app.delete('/api/forum/posts/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const postId = parseInt(req.params.id);

    // Check if post belongs to user
    const checkResult = await pool.query(
      'SELECT user_id FROM forum_posts WHERE id = $1',
      [postId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.query('DELETE FROM forum_posts WHERE id = $1', [postId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting forum post:', error);
    res.status(500).json({ error: 'Failed to delete forum post' });
  }
});

// Forum replies routes
app.post('/api/forum/posts/:postId/replies', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const postId = parseInt(req.params.postId);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Check if post exists
    const postCheck = await pool.query(
      'SELECT id FROM forum_posts WHERE id = $1',
      [postId]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const result = await pool.query(`
      INSERT INTO forum_replies (post_id, user_id, content)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [postId, req.user.id, content.trim()]);

    // Fetch the reply with user info
    const replyResult = await pool.query(`
      SELECT 
        r.id,
        r.content,
        r.created_at,
        r.updated_at,
        u.id as user_id,
        u.name,
        u.email,
        u.picture
      FROM forum_replies r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [result.rows[0].id]);

    res.status(201).json(replyResult.rows[0]);
  } catch (error) {
    console.error('Error creating forum reply:', error);
    res.status(500).json({ error: 'Failed to create forum reply' });
  }
});

app.delete('/api/forum/replies/:id', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const replyId = parseInt(req.params.id);

    // Check if reply belongs to user
    const checkResult = await pool.query(
      'SELECT user_id FROM forum_replies WHERE id = $1',
      [replyId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Reply not found' });
    }

    if (checkResult.rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    await pool.query('DELETE FROM forum_replies WHERE id = $1', [replyId]);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting forum reply:', error);
    res.status(500).json({ error: 'Failed to delete forum reply' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Initialize database and start server
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

