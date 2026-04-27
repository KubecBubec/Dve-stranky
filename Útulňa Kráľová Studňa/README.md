# Útulňa Kráľová Studňa

Webová aplikácia pre správu plánovaných návštev turistickej útulne Kráľová Studňa.

## Funkcie

- Informačná stránka o útulni
- Kalendár plánovaných návštev
- Google OAuth prihlásenie
- Pridávanie návštev vo formáte od-do
- Zobrazenie všetkých plánovaných návštev
- Docker kontajnerizácia

## Technológie

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Node.js, Express
- **Databáza**: PostgreSQL
- **Autentifikácia**: Passport.js s Google OAuth 2.0
- **Kontajnerizácia**: Docker, Docker Compose

## Požiadavky

- Docker a Docker Compose
- Google OAuth 2.0 credentials (Client ID a Client Secret)

## Inštalácia a spustenie

### 1. Získanie Google OAuth credentials

1. Prejdite na [Google Cloud Console](https://console.cloud.google.com/)
2. Vytvorte nový projekt alebo vyberte existujúci
3. Povoľte Google+ API
4. Prejdite na **APIs & Services > Credentials**
5. Kliknite na **Create Credentials > OAuth client ID**
6. Vyberte **Web application**
7. Pridajte **Authorized redirect URIs**:
   - Pre lokálne testovanie: `http://localhost:3000/auth/google/callback`
   - Pre produkciu: `https://yourdomain.com/auth/google/callback`
8. Skopírujte **Client ID** a **Client Secret**

### 2. Konfigurácia

Vytvorte súbor `.env` v koreňovom priečinku projektu:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth Callback URL
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

# Frontend URL
FRONTEND_URL=http://localhost:8080

# Session Secret (vygenerujte náhodný reťazec)
SESSION_SECRET=your-random-secret-key-here

# Database (obvykle netreba meniť)
DB_HOST=db
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=utulna
DB_PORT=5432
```

### 3. Spustenie aplikácie

```bash
# Spustenie všetkých služieb
docker-compose up -d

# Zobrazenie logov
docker-compose logs -f

# Zastavenie služieb
docker-compose down
```

Aplikácia bude dostupná na:
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000
- **Database**: localhost:5432

### 4. Prvý štart

Pri prvom spustení sa automaticky vytvoria potrebné databázové tabuľky.

## Štruktúra projektu

```
.
├── backend/
│   ├── server.js          # Express server
│   ├── package.json       # Node.js dependencies
│   └── Dockerfile         # Backend Docker image
├── frontend/
│   ├── index.html         # Hlavná HTML stránka
│   ├── style.css          # Štýly
│   └── script.js          # Frontend JavaScript
├── docker-compose.yml     # Docker Compose konfigurácia
├── .env.example           # Príklad konfiguračného súboru
└── README.md             # Tento súbor
```

## API Endpoints

### Autentifikácia

- `GET /auth/google` - Spustenie Google OAuth prihlásenia
- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/logout` - Odhlásenie
- `GET /auth/user` - Informácie o aktuálnom používateľovi

### Návštevy

- `GET /api/visits` - Získanie všetkých budúcich návštev
- `POST /api/visits` - Vytvorenie novej návštevy (vyžaduje prihlásenie)
  - Body: `{ dateFrom: "YYYY-MM-DD", dateTo: "YYYY-MM-DD" (voliteľné), note: "string" (voliteľné) }`
- `DELETE /api/visits/:id` - Odstránenie návštevy (vyžaduje prihlásenie)

## Vývoj

### Lokálny vývoj bez Dockeru

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend - otvorte index.html v prehliadači alebo použite jednoduchý HTTP server
# Napríklad: python -m http.server 8080
```

**Poznámka**: Pri lokálnom vývoji nezabudnite nastaviť správne URL v `frontend/script.js` (API_BASE_URL).

## Produkčné nasadenie

1. Aktualizujte `.env` súbor s produkčnými hodnotami
2. Zmeňte `GOOGLE_CALLBACK_URL` na produkčnú URL
3. Zmeňte `FRONTEND_URL` na produkčnú URL
4. Použite silný `SESSION_SECRET`
5. Zvážte použitie reverse proxy (napr. Nginx) pre HTTPS
6. Nastavte správne CORS nastavenia v `backend/server.js`

## Bezpečnostné poznámky

- V produkcii vždy používajte HTTPS
- Použite silný `SESSION_SECRET`
- Pravidelne aktualizujte závislosti
- Nastavte správne CORS politiky
- Zvážte rate limiting pre API endpoints

## Licencia

Tento projekt je vytvorený pre informačné účely.

