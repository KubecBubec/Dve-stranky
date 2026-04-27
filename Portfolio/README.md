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

### EmailJS Konfigurácia (Kontaktný formulár)

Pre funkčný kontaktný formulár je potrebné nastaviť EmailJS:

1. **Vytvor účet na [EmailJS](https://www.emailjs.com/)** (bezplatný tier je dostatočný)

2. **Vytvor Email Service:**
   - Choď do "Email Services"
   - Pridaj nový service (napr. Gmail, Outlook)
   - Postupuj podľa inštrukcií pre pripojenie tvojho emailu

3. **Vytvor Email Template:**
   - Choď do "Email Templates"
   - Vytvor nový template
   - **Pozri `EMAILJS_TEMPLATE.md`** pre detailný návod a príklad template HTML
   - V template použij tieto premenné:
     - `{{from_name}}` - meno odosielateľa
     - `{{from_email}}` - email odosielateľa
     - `{{message}}` - správa
     - `{{to_email}}` - tvoj email (pre informáciu)
   - **Dôležité**: Nastav "Reply To" na `{{from_email}}` aby si mohol odpovedať priamo

4. **Získaj credentials:**
   - **Public Key**: Account → General → Public Key
   - **Service ID**: Email Services → tvoj service → Service ID
   - **Template ID**: Email Templates → tvoj template → Template ID

5. **Nastav environment variables:**
   - Vytvor `.env` súbor v root adresári projektu
   - Pridaj:
     ```
     VITE_EMAILJS_PUBLIC_KEY=tvoj_public_key
     VITE_EMAILJS_SERVICE_ID=tvoj_service_id
     VITE_EMAILJS_TEMPLATE_ID=tvoj_template_id
     ```

**Poznámka:** Ak EmailJS nie je nakonfigurovaný, formulár zobrazí chybovú správu pri pokuse o odoslanie.

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


