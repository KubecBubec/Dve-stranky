# Portfolio Website

Moderné osobné portfólio vytvorené pomocou React, TypeScript, Tailwind CSS a Framer Motion.

## 🚀 Funkcie

- ✅ Moderný, responzívny dizajn
- ✅ Dark/Light mode
- ✅ Smooth animácie (Framer Motion)
- ✅ Sekcie: Hero, O mne, Zručnosti, Projekty, Kontakt
- ✅ Optimizované pre produkciu
- ✅ Docker + Caddy deployment s automatickým SSL

## 🛠️ Technológie

- **React 18** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animácie
- **React Icons** - Ikony
- **Docker** + **Caddy** - Deployment

## 📦 Inštalácia

```bash
# Inštalácia závislostí
npm install

# Spustenie dev servera
npm run dev

# Build pre produkciu
npm run build

# Preview produkčnej verzie
npm run preview
```

## 📝 Konfigurácia

### Personalizácia obsahu

Uprav súbory v `src/data/`:

- `personalInfo.ts` - Osobné informácie, kontakt
- `skills.ts` - Zručnosti a programovacie jazyky
- `projects.ts` - Projekty a portfolio

### Kontaktný formulár (Resend)

Formulár posiela správy cez serverless funkciu `api/contact.js`, ktorá beží na Verceli a odosiela e-maily cez [Resend](https://resend.com).

1. Vytvor si účet na Resend (bezplatný plán stačí) a vygeneruj API kľúč.
2. Vo Vercel projekte nastav premenné prostredia:
   - `RESEND_API_KEY` - API kľúč z Resend
   - `CONTACT_TO_EMAIL` - adresa, kam majú správy chodiť
   - `CONTACT_FROM_EMAIL` - voliteľné; bez overenej domény sa použije `onboarding@resend.dev`, ktorý vie posielať len na e-mail tvojho Resend účtu
3. Na odpoveď stačí v e-mailovom klientovi kliknúť na „Odpovedať“ (Reply-To je adresa návštevníka).

Lokálne funkcia beží len cez `vercel dev`; obyčajný `npm run dev` endpoint `/api/contact` nemá.

Email adresa pre zobrazenie je nastavená v `src/data/personalInfo.ts`.

## 🐳 Deployment s Docker

Projekt je pripravený na deployment pomocou Docker a Caddy (s automatickým SSL).

### Pred deploymentom

1. Aktualizuj `Caddyfile`:
   - Zmeň `tvojadomena.com` na svoju doménu
   - Zmeň `tvoj@email.com` na svoj email (pre Let's Encrypt notifikácie)

2. Aktualizuj obsah v `src/data/` súboroch

### Lokálne testovanie

```bash
# Build a spustenie kontajnerov
docker-compose up -d --build

# Zobrazenie logov
docker-compose logs -f

# Zastavenie
docker-compose down
```

### Deployment na server

Pozri `deployment/DEPLOYMENT.md` pre podrobné inštrukcie.

## 📁 Štruktúra projektu

```
portfolio/
├── src/
│   ├── components/      # React komponenty
│   ├── data/            # Dátové súbory (obsah)
│   ├── types/           # TypeScript typy
│   ├── App.tsx          # Hlavná aplikácia
│   └── main.tsx         # Entry point
├── public/              # Statické súbory
├── Dockerfile           # Docker build konfigurácia
├── docker-compose.yml   # Docker Compose konfigurácia
├── Caddyfile            # Caddy web server konfigurácia
└── nginx.conf           # Nginx konfigurácia pre SPA
```

## 🎨 Dizajn

- Moderný minimalistický dizajn
- Gradient akcenty
- Smooth transitions a animácie
- Fully responsive (mobile, tablet, desktop)

## 📄 Licencia

MIT


