// API Configuration - use relative paths (nginx will proxy to backend)
const API_BASE_URL = '';

// Global state
let currentUser = null;
let allVisits = [];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Month names in Slovak
const monthNames = [
    'Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún',
    'Júl', 'August', 'September', 'Október', 'November', 'December'
];

const dayNames = ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'];

// Check authentication status
async function checkAuth() {
    try {
        console.log('Checking auth status...');
        console.log('Cookies in document:', document.cookie);
        
        const response = await fetch(`${API_BASE_URL}/auth/user`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('Auth response status:', response.status);
        console.log('Auth response headers:', Object.fromEntries(response.headers.entries()));
        
        // Check Set-Cookie header
        const setCookieHeader = response.headers.get('Set-Cookie');
        if (setCookieHeader) {
            console.log('Set-Cookie header:', setCookieHeader);
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Auth response data:', data);
        
        if (data.authenticated && data.user) {
            currentUser = data.user;
            updateAuthUI(true);
            console.log('User authenticated:', currentUser.name || currentUser.email);
        } else {
            currentUser = null;
            updateAuthUI(false);
            console.log('User not authenticated');
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        currentUser = null;
        updateAuthUI(false);
    }
}

// Update authentication UI
function updateAuthUI(isAuthenticated) {
    const userInfo = document.getElementById('user-info');
    const loginBtn = document.getElementById('login-btn');
    const visitForm = document.getElementById('visit-form');
    const loginPrompt = document.getElementById('login-prompt');

    if (isAuthenticated && currentUser) {
        // Show user info, hide login button
        if (userInfo) {
            userInfo.style.display = 'flex';
        }
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
        if (visitForm) {
            visitForm.style.display = 'block';
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'none';
        }
        
        // Update user info
        const userNameEl = document.getElementById('user-name');
        const userPictureEl = document.getElementById('user-picture');
        if (userNameEl) {
            userNameEl.textContent = currentUser.name || currentUser.email || 'Používateľ';
        }
        if (userPictureEl) {
            if (currentUser.picture) {
                userPictureEl.src = currentUser.picture;
                userPictureEl.alt = currentUser.name || 'User';
            } else {
                // Fallback if no picture
                userPictureEl.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"%3E%3Ccircle cx="12" cy="12" r="10"%3E%3C/circle%3E%3Cpath d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"%3E%3C/path%3E%3Cpath d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6"%3E%3C/path%3E%3C/svg%3E';
                userPictureEl.alt = currentUser.name || 'User';
            }
        }
        
        // Update forum UI
        updateForumUI();
    } else {
        // Hide user info, show login button
        if (userInfo) {
            userInfo.style.display = 'none';
        }
        if (loginBtn) {
            loginBtn.style.display = 'inline-block';
        }
        if (visitForm) {
            visitForm.style.display = 'none';
        }
        if (loginPrompt) {
            loginPrompt.style.display = 'block';
        }
        
        // Update forum UI
        updateForumUI();
    }
}

// Load visits from API
async function loadVisits() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/visits`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load visits');
        }
        
        allVisits = await response.json();
        updateCalendar();
        displayPlannedVisits();
    } catch (error) {
        console.error('Error loading visits:', error);
        allVisits = [];
        updateCalendar();
        displayPlannedVisits();
    }
}

// Get all visits for a specific date
function getVisitsForDate(dateStr) {
    const visitsForDate = [];
    const checkDate = new Date(dateStr);
    
    for (const visit of allVisits) {
        const fromDate = new Date(visit.date_from);
        const toDate = visit.date_to ? new Date(visit.date_to) : fromDate;
        
        if (checkDate >= fromDate && checkDate <= toDate) {
            visitsForDate.push(visit);
        }
    }
    
    return visitsForDate;
}

// Update calendar display
function updateCalendar() {
    const calendar = document.getElementById('calendar');
    const monthYear = document.getElementById('current-month-year');
    
    monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    calendar.innerHTML = '';
    
    // Add day headers
    dayNames.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendar.appendChild(header);
    });
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day other-month';
        calendar.appendChild(emptyDay);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        const dateStr = formatDate(currentYear, currentMonth, day);
        const dayDate = new Date(currentYear, currentMonth, day);
        
        dayElement.className = 'calendar-day';
        
        // Check if today
        if (dayDate.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }
        
        // Check if has visits
        const visitsForDate = getVisitsForDate(dateStr);
        if (visitsForDate.length > 0) {
            const hasUserVisit = currentUser && visitsForDate.some(v => v.user_id === currentUser.id);
            
            if (hasUserVisit) {
                dayElement.classList.add('your-visit');
            } else {
                dayElement.classList.add('has-visits');
            }
            
            const count = visitsForDate.length;
            
            // Get unique users for this date
            const uniqueUsers = [];
            const userIds = new Set();
            visitsForDate.forEach(visit => {
                if (!userIds.has(visit.user_id)) {
                    userIds.add(visit.user_id);
                    uniqueUsers.push({
                        id: visit.user_id,
                        picture: visit.picture,
                        name: visit.name
                    });
                }
            });
            
            // Limit to max 3-4 avatars for display (depending on screen size)
            const maxAvatars = 3;
            const displayUsers = uniqueUsers.slice(0, maxAvatars);
            const remainingCount = uniqueUsers.length - maxAvatars;
            
            let avatarsHtml = '';
            if (displayUsers.length > 0) {
                avatarsHtml = '<div class="visit-avatars">';
                displayUsers.forEach(user => {
                    if (user.picture) {
                        avatarsHtml += `<img src="${escapeHtml(user.picture)}" alt="${escapeHtml(user.name)}" class="visit-avatar" title="${escapeHtml(user.name)}">`;
                    } else {
                        // Fallback avatar if no picture
                        const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
                        avatarsHtml += `<div class="visit-avatar visit-avatar-fallback" title="${escapeHtml(user.name)}">${initials}</div>`;
                    }
                });
                if (remainingCount > 0) {
                    avatarsHtml += `<span class="avatar-more">+${remainingCount}</span>`;
                }
                avatarsHtml += '</div>';
            }
            
            dayElement.innerHTML = `
                <span class="day-number">${day}</span>
                ${avatarsHtml}
                <span class="visit-count">${count} ${count === 1 ? 'návšteva' : 'návštevy'}</span>
            `;
        } else {
            dayElement.innerHTML = `<span class="day-number">${day}</span>`;
        }
        
        dayElement.addEventListener('click', () => {
            if (!dayElement.classList.contains('other-month')) {
                selectDate(dateStr);
            }
        });
        
        calendar.appendChild(dayElement);
    }
}

// Format date as YYYY-MM-DD
function formatDate(year, month, day) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    return `${year}-${monthStr}-${dayStr}`;
}

// Select date in form
function selectDate(dateStr) {
    if (!currentUser) {
        alert('Pre pridanie návštevy sa musíte prihlásiť.');
        return;
    }
    
    document.getElementById('visit-date-from').value = dateStr;
    document.getElementById('visit-date-to').value = '';
    document.getElementById('visit-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('prev-month').addEventListener('click', () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    });
    
    document.getElementById('next-month').addEventListener('click', () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    });
    
    document.getElementById('visit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        await addVisit();
    });
}

// Add visit
async function addVisit() {
    if (!currentUser) {
        alert('Pre pridanie návštevy sa musíte prihlásiť.');
        return;
    }

    const dateFromInput = document.getElementById('visit-date-from');
    const dateToInput = document.getElementById('visit-date-to');
    const noteInput = document.getElementById('visit-note');
    
    const dateFrom = dateFromInput.value;
    const dateTo = dateToInput.value || null;
    const note = noteInput.value.trim() || null;
    
    if (!dateFrom) {
        alert('Prosím, vyberte dátum od.');
        return;
    }
    
    // Validate date range
    if (dateTo && dateTo < dateFrom) {
        alert('Dátum "do" nemôže byť skôr ako dátum "od".');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/visits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                dateFrom,
                dateTo,
                note
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create visit');
        }
        
        const visit = await response.json();
        
        // Clear form
        dateFromInput.value = '';
        dateToInput.value = '';
        noteInput.value = '';
        
        // Reload visits
        await loadVisits();
        
        // Show success message
        const fromDate = new Date(dateFrom);
        const toDate = dateTo ? new Date(dateTo) : fromDate;
        const dateFromStr = fromDate.toLocaleDateString('sk-SK');
        const dateToStr = toDate.toLocaleDateString('sk-SK');
        const dateRangeStr = dateTo ? `${dateFromStr} - ${dateToStr}` : dateFromStr;
        alert(`Návšteva na obdobie ${dateRangeStr} bola úspešne pridaná!`);
    } catch (error) {
        console.error('Error adding visit:', error);
        alert('Chyba pri pridávaní návštevy: ' + error.message);
    }
}

// Display planned visits
function displayPlannedVisits() {
    const container = document.getElementById('visits-container');
    
    // Filter future visits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const futureVisits = allVisits.filter(visit => {
        const visitFrom = new Date(visit.date_from);
        return visitFrom >= today;
    });
    
    // Sort by dateFrom
    futureVisits.sort((a, b) => {
        const dateA = new Date(a.date_from);
        const dateB = new Date(b.date_from);
        return dateA - dateB;
    });
    
    if (futureVisits.length === 0) {
        container.innerHTML = '<div class="empty-state">Zatiaľ nie sú žiadne plánované návštevy.</div>';
        return;
    }
    
    container.innerHTML = '';
    
    futureVisits.forEach(visit => {
        const visitItem = document.createElement('div');
        visitItem.className = 'visit-item';
        
        if (currentUser && visit.user_id === currentUser.id) {
            visitItem.classList.add('your-visit');
        }
        
        const fromDate = new Date(visit.date_from);
        const toDate = visit.date_to ? new Date(visit.date_to) : fromDate;
        
        const fromDateStr = fromDate.toLocaleDateString('sk-SK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        let dateRangeStr;
        if (visit.date_to && visit.date_to !== visit.date_from) {
            const toDateStr = toDate.toLocaleDateString('sk-SK', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            dateRangeStr = `${fromDateStr} - ${toDateStr}`;
        } else {
            dateRangeStr = fromDateStr;
        }
        
        let userAvatar = '';
        if (visit.picture) {
            userAvatar = `<img src="${escapeHtml(visit.picture)}" alt="${escapeHtml(visit.name)}" class="visit-list-avatar" title="${escapeHtml(visit.name)}">`;
        } else {
            // Fallback avatar with initials
            const initials = visit.name ? visit.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
            userAvatar = `<div class="visit-list-avatar visit-list-avatar-fallback" title="${escapeHtml(visit.name)}">${initials}</div>`;
        }
        
        visitItem.innerHTML = `
            <div class="visit-info">
                <div class="visit-header">
                    ${userAvatar}
                    <div class="visit-details">
                        <div class="visit-date">${dateRangeStr}</div>
                        <div class="visit-name">${escapeHtml(visit.name)}</div>
                        ${visit.email ? `<div class="visit-email">${escapeHtml(visit.email)}</div>` : ''}
                    </div>
                </div>
                ${visit.note ? `<div class="visit-note">${escapeHtml(visit.note)}</div>` : ''}
            </div>
            ${currentUser && visit.user_id === currentUser.id ? `<button class="btn-remove" onclick="removeVisitById(${visit.id})">Odstrániť</button>` : ''}
        `;
        
        container.appendChild(visitItem);
    });
}

// Remove visit by ID
async function removeVisitById(visitId) {
    if (!currentUser) {
        alert('Môžete odstrániť len svoje vlastné návštevy.');
        return;
    }
    
    if (!confirm('Naozaj chcete odstrániť túto návštevu?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/visits/${visitId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete visit');
        }
        
        // Reload visits
        await loadVisits();
    } catch (error) {
        console.error('Error deleting visit:', error);
        alert('Chyba pri odstraňovaní návštevy: ' + error.message);
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize application
async function init() {
    // Set minimum date to today
    const dateFromInput = document.getElementById('visit-date-from');
    const dateToInput = document.getElementById('visit-date-to');
    const today = new Date().toISOString().split('T')[0];
    
    dateFromInput.setAttribute('min', today);
    dateToInput.setAttribute('min', today);
    
    // Update dateTo min when dateFrom changes
    dateFromInput.addEventListener('change', () => {
        if (dateFromInput.value) {
            dateToInput.setAttribute('min', dateFromInput.value);
            if (dateToInput.value && dateToInput.value < dateFromInput.value) {
                dateToInput.value = dateFromInput.value;
            }
        }
    });
    
    // Check authentication first (important for OAuth redirect)
    await checkAuth();
    
    // Load visits
    await loadVisits();
    
    // Load forum posts
    await loadForumPosts();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup forum form listener
    const forumForm = document.getElementById('forum-form');
    if (forumForm) {
        forumForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await addForumPost();
        });
    }
    
    // Update calendar
    updateCalendar();
    
    // Check auth again after a short delay (in case of redirect from OAuth)
    // This handles the case when user is redirected back from Google OAuth
    setTimeout(async () => {
        await checkAuth();
        await loadVisits();
        updateCalendar();
    }, 1000);
    
    // Refresh auth when page becomes visible (user returns to tab)
    // This ensures auth state is up-to-date when user switches tabs
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
            await checkAuth();
            await loadVisits();
            updateCalendar();
        }
    });
    
    // Also check auth on focus (when user clicks back to window)
    // This ensures auth state is refreshed when user returns to the window
    window.addEventListener('focus', async () => {
        await checkAuth();
        await loadVisits();
        updateCalendar();
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Image Lightbox functionality
let currentLightboxIndex = 0;
let lightboxImages = [];

// Initialize lightbox - collect all gallery images
function initLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    lightboxImages = Array.from(galleryItems).map(img => ({
        src: img.src,
        alt: img.alt || ''
    }));
    
    // Add click handlers to gallery images
    galleryItems.forEach((img, index) => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openLightbox(index));
    });
}

// Open lightbox with specific image
function openLightbox(index) {
    if (lightboxImages.length === 0) return;
    
    currentLightboxIndex = index;
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxCaption.textContent = lightboxImages[currentLightboxIndex].alt;
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
    
    // Focus on close button for accessibility
    setTimeout(() => {
        document.querySelector('.lightbox-close').focus();
    }, 100);
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    lightbox.style.display = 'none';
    document.body.style.overflow = ''; // Restore scrolling
}

// Change image in lightbox
function changeLightboxImage(direction) {
    if (lightboxImages.length === 0) return;
    
    currentLightboxIndex += direction;
    
    // Wrap around
    if (currentLightboxIndex < 0) {
        currentLightboxIndex = lightboxImages.length - 1;
    } else if (currentLightboxIndex >= lightboxImages.length) {
        currentLightboxIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    lightboxImg.src = lightboxImages[currentLightboxIndex].src;
    lightboxCaption.textContent = lightboxImages[currentLightboxIndex].alt;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox.style.display === 'none' || lightbox.style.display === '') {
        return;
    }
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        changeLightboxImage(-1);
    } else if (e.key === 'ArrowRight') {
        changeLightboxImage(1);
    }
});

// Forum state
let forumPosts = [];

// Load forum posts
async function loadForumPosts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Failed to load forum posts');
        }
        
        forumPosts = await response.json();
        displayForumPosts();
    } catch (error) {
        console.error('Error loading forum posts:', error);
        forumPosts = [];
        displayForumPosts();
    }
}

// Display forum posts
function displayForumPosts() {
    const container = document.getElementById('forum-posts');
    
    if (forumPosts.length === 0) {
        container.innerHTML = '<div class="empty-state">Zatiaľ nie sú žiadne príspevky. Buďte prvý, kto napíše správu!</div>';
        return;
    }
    
    container.innerHTML = '';
    
    forumPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'forum-post';
        
        let userAvatar = '';
        if (post.picture) {
            userAvatar = `<img src="${escapeHtml(post.picture)}" alt="${escapeHtml(post.name)}" class="forum-post-avatar" title="${escapeHtml(post.name)}">`;
        } else {
            const initials = post.name ? post.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
            userAvatar = `<div class="forum-post-avatar forum-post-avatar-fallback" title="${escapeHtml(post.name)}">${initials}</div>`;
        }
        
        const postDate = new Date(post.created_at);
        const dateStr = postDate.toLocaleDateString('sk-SK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        postElement.innerHTML = `
            <div class="forum-post-header">
                ${userAvatar}
                <div class="forum-post-author">
                    <div class="forum-post-author-name">${escapeHtml(post.name)}</div>
                    ${post.email ? `<div class="forum-post-author-email">${escapeHtml(post.email)}</div>` : ''}
                </div>
                <div class="forum-post-date">${dateStr}</div>
            </div>
            ${post.title ? `<div class="forum-post-title">${escapeHtml(post.title)}</div>` : ''}
            <div class="forum-post-content">${escapeHtml(post.content)}</div>
            ${currentUser && post.user_id === currentUser.id ? `<button class="btn-remove" onclick="removeForumPostById(${post.id})" style="margin-top: 1rem;">Odstrániť príspevok</button>` : ''}
            <div class="forum-replies" id="replies-${post.id}"></div>
            <div class="forum-reply-form-container" id="reply-form-${post.id}"></div>
        `;
        
        container.appendChild(postElement);
        
        // Display replies
        displayReplies(post.id, post.replies || []);
        
        // Display reply form
        displayReplyForm(post.id);
    });
}

// Display replies for a post
function displayReplies(postId, replies) {
    const container = document.getElementById(`replies-${postId}`);
    if (!container) return;
    
    if (replies.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<div class="forum-replies-header">Odpovede:</div>';
    
    replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.className = 'forum-reply';
        
        let replyAvatar = '';
        if (reply.picture) {
            replyAvatar = `<img src="${escapeHtml(reply.picture)}" alt="${escapeHtml(reply.name)}" class="forum-reply-avatar" title="${escapeHtml(reply.name)}">`;
        } else {
            const initials = reply.name ? reply.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?';
            replyAvatar = `<div class="forum-reply-avatar forum-reply-avatar-fallback" title="${escapeHtml(reply.name)}">${initials}</div>`;
        }
        
        const replyDate = new Date(reply.created_at);
        const replyDateStr = replyDate.toLocaleDateString('sk-SK', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        replyElement.innerHTML = `
            <div class="forum-reply-header">
                ${replyAvatar}
                <div class="forum-reply-author">
                    <div class="forum-reply-author-name">${escapeHtml(reply.name)}</div>
                    ${reply.email ? `<div class="forum-reply-author-email">${escapeHtml(reply.email)}</div>` : ''}
                </div>
                <div class="forum-reply-date">${replyDateStr}</div>
            </div>
            <div class="forum-reply-content">${escapeHtml(reply.content)}</div>
            ${currentUser && reply.user_id === currentUser.id ? `<button class="btn-remove btn-remove-small" onclick="removeForumReplyById(${reply.id}, ${postId})">Odstrániť</button>` : ''}
        `;
        
        container.appendChild(replyElement);
    });
}

// Display reply form for a post
function displayReplyForm(postId) {
    const container = document.getElementById(`reply-form-${postId}`);
    if (!container) return;
    
    if (!currentUser) {
        container.innerHTML = `
            <div class="forum-reply-login-prompt">
                <p>Pre odpoveď sa musíte <a href="/auth/google">prihlásiť</a>.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <form class="forum-reply-form" onsubmit="event.preventDefault(); addForumReply(${postId});">
            <div class="form-group">
                <textarea class="forum-reply-input" id="reply-content-${postId}" rows="2" placeholder="Napíšte svoju odpoveď..." required></textarea>
            </div>
            <button type="submit" class="btn-primary btn-small">Odoslať odpoveď</button>
        </form>
    `;
}

// Add forum reply
async function addForumReply(postId) {
    if (!currentUser) {
        alert('Pre pridanie odpovede sa musíte prihlásiť.');
        return;
    }

    const contentInput = document.getElementById(`reply-content-${postId}`);
    const content = contentInput.value.trim();
    
    if (!content) {
        alert('Prosím, vyplňte obsah odpovede.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/posts/${postId}/replies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                content
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create reply');
        }
        
        const newReply = await response.json();
        
        // Clear form
        contentInput.value = '';
        
        // Reload posts to get updated replies
        await loadForumPosts();
    } catch (error) {
        console.error('Error adding forum reply:', error);
        alert('Chyba pri pridávaní odpovede: ' + error.message);
    }
}

// Remove forum reply by ID
async function removeForumReplyById(replyId, postId) {
    if (!currentUser) {
        alert('Môžete odstrániť len svoje vlastné odpovede.');
        return;
    }
    
    if (!confirm('Naozaj chcete odstrániť túto odpoveď?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/replies/${replyId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete reply');
        }
        
        // Reload posts to get updated replies
        await loadForumPosts();
    } catch (error) {
        console.error('Error deleting forum reply:', error);
        alert('Chyba pri odstraňovaní odpovede: ' + error.message);
    }
}

// Remove forum post by ID
async function removeForumPostById(postId) {
    if (!currentUser) {
        alert('Môžete odstrániť len svoje vlastné príspevky.');
        return;
    }
    
    if (!confirm('Naozaj chcete odstrániť tento príspevok?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/posts/${postId}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete post');
        }
        
        // Reload posts
        await loadForumPosts();
    } catch (error) {
        console.error('Error deleting forum post:', error);
        alert('Chyba pri odstraňovaní príspevku: ' + error.message);
    }
}

// Add forum post
async function addForumPost() {
    if (!currentUser) {
        alert('Pre pridanie príspevku sa musíte prihlásiť.');
        return;
    }

    const titleInput = document.getElementById('forum-title');
    const contentInput = document.getElementById('forum-content');
    
    const title = titleInput.value.trim() || null;
    const content = contentInput.value.trim();
    
    if (!content) {
        alert('Prosím, vyplňte obsah príspevku.');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                title,
                content
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to create post');
        }
        
        // Clear form
        titleInput.value = '';
        contentInput.value = '';
        
        // Reload posts
        await loadForumPosts();
        
        // Show success message
        alert('Príspevok bol úspešne pridaný!');
    } catch (error) {
        console.error('Error adding forum post:', error);
        alert('Chyba pri pridávaní príspevku: ' + error.message);
    }
}

// Update forum UI based on auth
function updateForumUI() {
    const forumForm = document.getElementById('forum-form');
    const forumLoginPrompt = document.getElementById('forum-login-prompt');
    
    if (currentUser) {
        if (forumForm) {
            forumForm.style.display = 'block';
        }
        if (forumLoginPrompt) {
            forumLoginPrompt.style.display = 'none';
        }
    } else {
        if (forumForm) {
            forumForm.style.display = 'none';
        }
        if (forumLoginPrompt) {
            forumLoginPrompt.style.display = 'block';
        }
    }
}

// Show cookie settings info modal
function showCookieSettingsInfo() {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';
    
    const content = document.createElement('div');
    content.style.cssText = 'background:white;padding:2rem;border-radius:8px;max-width:500px;margin:1rem;';
    
    content.innerHTML = `
        <h2 style="margin-top:0;color:var(--primary-color);font-family:var(--font-heading);">Nastavenia cookies</h2>
        <p style="line-height:1.8;color:var(--text-color);">Pre zmenu nastavení cookies použite tlačidlo v cookie bannere alebo vymažte cookies v nastaveniach prehliadača.</p>
        <button id="cookie-info-close" style="padding:0.75rem 1.5rem;background:var(--primary-color);color:white;border:none;border-radius:6px;cursor:pointer;margin-top:1rem;font-weight:500;">Zavrieť</button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close handlers
    const closeModal = () => {
        document.body.removeChild(modal);
    };
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    document.getElementById('cookie-info-close').addEventListener('click', closeModal);
    
    // Close on Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    init();
    initLightbox();
    
    // Add event listener for cookie settings link
    const cookieSettingsLink = document.getElementById('cookie-settings-link');
    if (cookieSettingsLink) {
        cookieSettingsLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.CookieConsent && window.CookieConsent.hasConsent) {
                // If cookie consent is initialized, show settings modal
                const showSettings = window.CookieConsent.showSettings || (() => {
                    // Fallback: show info modal
                    showCookieSettingsInfo();
                });
                showSettings();
            } else {
                // Show info modal if cookie consent not initialized
                showCookieSettingsInfo();
            }
        });
    }
});

