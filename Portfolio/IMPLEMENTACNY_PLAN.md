# Implementačný plán - Osobné portfólio

## 1. Prehľad projektu

Osobné portfólio webová stránka prezentujúca profesionálne schopnosti, projekty a kontaktné informácie.

## 2. Technologický stack

### Frontend
- **React** - Moderný framework pre UI
- **TypeScript** - Typová bezpečnosť
- **Tailwind CSS** - Utility-first CSS framework pre moderný dizajn
- **Framer Motion** - Animácie a prechody
- **React Router** - Navigácia (ak bude potrebná)

### Vývojové nástroje
- **Vite** - Rýchly build tool
- **ESLint** - Linting
- **Prettier** - Formátovanie kódu

### Deployment
- **Docker** - Kontajnerizácia aplikácie
- **Caddy** - Web server s automatickým SSL (Let's Encrypt)
- **Docker Compose** - Orchestrácia kontajnerov

## 3. Štruktúra projektu

```
portfolio/
├── public/
│   ├── images/
│   │   ├── projects/
│   │   └── profile/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── Hero/
│   │   ├── About/
│   │   ├── Skills/
│   │   ├── Projects/
│   │   ├── Contact/
│   │   └── Footer/
│   ├── assets/
│   ├── styles/
│   ├── types/
│   ├── data/
│   │   ├── projects.ts
│   │   ├── skills.ts
│   │   └── personalInfo.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── docker/
│   └── Dockerfile
├── Caddyfile
├── docker-compose.yml
├── .dockerignore
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 4. Dizajn a UI/UX

### Dizajn princípy
- **Moderný minimalistický dizajn** - Čistý a profesionálny vzhľad
- **Dark/Light mode** - Prepínanie medzi tmavým a svetlým motívom
- **Responsive design** - Funkčnosť na všetkých zariadeniach
- **Smooth animácie** - Plynulé prechody a hover efekty
- **Gradient akcenty** - Moderné farbové kombinácie

### Farebná schéma
- **Primárna farba**: Modrá/Modrofialová (trust, profesionalita)
- **Sekundárna farba**: Akcentová (napr. cyan, purple)
- **Pozadie**: Dark mode (#0a0a0a) / Light mode (#ffffff)
- **Text**: Vysoký kontrast pre čitateľnosť

### Typografia
- **Nadpisy**: Moderný sans-serif (Inter, Poppins)
- **Text**: Čitateľný sans-serif s dobrým line-height

## 5. Sekcie stránky

### 5.1 Header / Navigácia
- **Obsah**:
  - Logo/Meno
  - Navigačné menu (O mne, Zručnosti, Projekty, Kontakt)
  - Dark/Light mode toggle
  - Hamburger menu pre mobile
- **Funkcie**:
  - Sticky header pri scrollovaní
  - Smooth scroll k sekciám
  - Aktívna sekcia highlight

### 5.2 Hero sekcia
- **Obsah**:
  - Úvodný text: "Ahoj, som [Tvoje meno]"
  - Krátky tagline o tom, čo robíš (napr. "Full-stack developer", "Web developer")
  - Call-to-action tlačidlá (Pozri moje projekty, Kontaktuj ma)
  - Možno: Animovaný background alebo ikona
- **Dizajn**:
  - Centrálne umiestnený obsah
  - Veľký, odvážny text
  - Gradient efekty

### 5.3 O mne (About)
- **Obsah**:
  - Krátky osobný úvod
  - Profesionálny popis činnosti
  - Čo ťa motivuje, čo ťa baví
  - Profesionálne ciele
- **Dizajn**:
  - Text v dvoch stĺpcoch (desktop)
  - Možno: Profilová fotka
  - Icons pre highlight kľúčových bodov

### 5.4 Zručnosti / Programovacie jazyky (Skills)
- **Obsah**:
  - Zoznam programovacích jazykov
  - Frameworks a knižnice
  - Nástroje a technológie
  - Úroveň zručností (advanced, intermediate, beginner)
- **Dizajn**:
  - Ikony pre každý jazyk/nástroj
  - Progress bary alebo kategórie
  - Grid layout
  - Hover efekty s popisom

**Príklad kategórií**:
- Programovacie jazyky: JavaScript, TypeScript, Python, Java, C++, atď.
- Frontend: React, Vue, HTML, CSS, Tailwind CSS
- Backend: Node.js, Express, REST APIs
- Databázy: PostgreSQL, MongoDB
- Nástroje: Git, Docker, VS Code

### 5.5 Projekty (Projects)
- **Obsah pre každý projekt**:
  - Názov projektu
  - Popis projektu
  - Použité technológie
  - Screenshot/obrázok projektu
  - Link na live demo (ak je dostupné)
  - Link na GitHub repozitár
- **Dizajn**:
  - Card layout
  - Grid zobrazenie (2-3 stĺpce na desktop)
  - Filter/podľa kategórií (voliteľné)
  - Modal alebo detail stránka pre viac informácií
  - Hover efekty

**Príklad štruktúry projektu**:
```typescript
{
  id: number,
  title: string,
  description: string,
  longDescription?: string,
  image: string,
  technologies: string[],
  githubUrl?: string,
  liveUrl?: string,
  category: 'web' | 'mobile' | 'fullstack' | 'other'
}
```

### 5.6 Kontakt (Contact)
- **Obsah**:
  - Kontaktný formulár
  - Email adresa
  - Social media linky (LinkedIn, GitHub, Twitter/X)
  - Možno: Google Maps alebo lokácia
- **Dizajn**:
  - Kontaktný formulár s validáciou
  - Social media ikony
  - Možno: Animovaný background
  - Success/Error messages

**Kontaktné informácie**:
- Email
- LinkedIn
- GitHub
- Portfólio web
- Voliteľne: Twitter/X, Instagram, Facebook

### 5.7 Footer
- **Obsah**:
  - Copyright informácie
  - Social media linky
  - Možno: Quick links
  - "Vytvorené s ❤️" alebo podobné

## 6. Funkcionality

### Základné funkcie
- ✅ Responsive dizajn
- ✅ Dark/Light mode
- ✅ Smooth scrolling
- ✅ Animácie pri scrollovaní (scroll reveal)
- ✅ Formulár validácia
- ✅ SEO optimalizácia
- ✅ Rýchle načítanie (lazy loading obrázkov)

### Pokročilé funkcie (voliteľné)
- 📧 Email služba (napr. EmailJS pre kontaktný formulár)
- 🌍 i18n (viacjazyčná podpora)
- 📊 Analytics (Google Analytics)
- 🔍 Search funkcionalita pre projekty
- 🎨 Téma farieb (customizácia)

## 7. Implementačné kroky

### Fáza 1: Setup projektu
1. ✅ Vytvorenie React + TypeScript projektu s Vite
2. ✅ Inštalácia závislostí (Tailwind CSS, React Router, Framer Motion)
3. ✅ Konfigurácia Tailwind CSS
4. ✅ Základná štruktúra priečinkov
5. ✅ Setup ESLint a Prettier

### Fáza 2: Dizajn a layout
1. ✅ Vytvorenie základného layoutu
2. ✅ Implementácia Header komponenty
3. ✅ Implementácia Footer komponenty
4. ✅ Dark/Light mode funkcionalita
5. ✅ Global styles a theme setup

### Fáza 3: Sekcie
1. ✅ Hero sekcia
2. ✅ About sekcia s obsahom
3. ✅ Skills sekcia s ikonami a progress bar
4. ✅ Projects sekcia s card layout
5. ✅ Contact sekcia s formulárom

### Fáza 4: Dáta a obsah
1. ✅ Vytvorenie dátových súborov (projects.ts, skills.ts, personalInfo.ts)
2. ✅ Vyplnenie osobných informácií
3. ✅ Pridanie zručností a programovacích jazykov
4. ✅ Pridanie projektov s popisom a linkmi
5. ✅ Pridanie kontaktných informácií

### Fáza 5: Animácie a interakcie
1. ✅ Scroll animácie (Framer Motion)
2. ✅ Hover efekty
3. ✅ Smooth transitions
4. ✅ Loading states

### Fáza 6: Optimalizácia
1. ✅ Performance optimalizácia
2. ✅ SEO meta tagy
3. ✅ Image optimization
4. ✅ Code splitting
5. ✅ Testing na rôznych zariadeniach

### Fáza 7: Deployment
1. ✅ Build produkčnej verzie
2. ✅ Vytvorenie Dockerfile pre statickú aplikáciu
3. ✅ Konfigurácia Caddyfile pre SSL a reverse proxy
4. ✅ Docker Compose setup
5. ✅ Deployment na server s Docker
6. ✅ SSL certificate automaticky cez Caddy (Let's Encrypt)
7. ✅ Custom domain setup

## 8. Obsah a texty (template)

### Hero sekcia
```
Ahoj, som [Tvoje meno]
[Tagline - napr. "Full-stack Developer", "Web Developer & Designer"]
[Krátky popis - napr. "Tvorím moderné webové aplikácie s dôrazom na UX"]
```

### O mne
```
[Paragraf 1: O tebe]
Som [pozícia/profesia] so záujmom o [oblasti záujmu]. 
[Popis tvojho profesionálneho pozadia a cesty]

[Paragraf 2: Čo robíš]
Špecializujem sa na [oblasti špecializácie]. 
[Konkrétne činnosti a projekty, na ktorých pracuješ]

[Paragraf 3: Čo ťa motivuje]
[Čo ťa baví, čo ťa motivuje, tvoje profesionálne ciele]
```

### Skills
```
[Programovacie jazyky]
- JavaScript (Advanced)
- TypeScript (Advanced)
- Python (Intermediate)
- Java (Intermediate)
- C++ (Beginner)

[Frameworks & Knižnice]
- React (Advanced)
- Node.js (Intermediate)
- Express (Intermediate)
- Vue.js (Beginner)

[Nástroje & Technológie]
- Git (Advanced)
- Docker (Intermediate)
- PostgreSQL (Intermediate)
- MongoDB (Beginner)
```

### Projekty
```
Projekt 1:
- Názov: [Názov projektu]
- Popis: [Krátky popis čo projekt robí]
- Technológie: [React, Node.js, MongoDB]
- GitHub: [link]
- Live: [link]

[Opakovať pre ďalšie projekty]
```

### Kontakt
```
[Kontaktný formulár]
- Meno
- Email
- Správa

[Kontaktné informácie]
- Email: [tvoj@email.com]
- LinkedIn: [link]
- GitHub: [link]
```

## 9. Odporúčania

### Pre obsah
- Buď autentický a osobný
- Použi konkrétne príklady a výsledky
- Pravidelne aktualizuj projekty
- Pridaj screenshots projektov

### Pre dizajn
- Zachovaj konzistentnosť
- Použi whitespace efektívne
- Zameraj sa na čitateľnosť
- Testuj na rôznych zariadeniach

### Pre SEO
- Pridaj meta tagy
- Použi semantic HTML
- Optimalizuj obrázky
- Pridaj structured data

## 10. Následné kroky po implementácii

1. **Aktualizácia obsahu**
   - Pravidelne pridávaj nové projekty
   - Aktualizuj zručnosti
   - Pridávaj blog posts (voliteľné)

2. **Rozšírenia**
   - Blog sekcia
   - Testimonials
   - Certifikáty a vzdelanie
   - Timeline kariéry

3. **Analytika**
   - Sledovanie návštevnosti
   - A/B testing
   - User feedback

## 11. Deployment s Docker a Caddy

### Prehľad
Pre deployment na vlastný server použijeme **Docker** s **Caddy** web serverom. Caddy automaticky zabezpečí SSL certifikáty cez Let's Encrypt.

### Výhody tohto riešenia
- ✅ **Automatické SSL** - Caddy automaticky získava a obnovuje Let's Encrypt certifikáty
- ✅ **Jednoduchá konfigurácia** - Minimálna konfigurácia potrebná
- ✅ **Kontajnerizácia** - Izolované prostredie, ľahké nasadenie
- ✅ **Produkcia ready** - Optimalizované pre produkčné prostredie
- ✅ **Automatické obnovovanie** - SSL certifikáty sa automaticky obnovujú

### Štruktúra deployment súborov

#### Dockerfile
Multi-stage build pre optimalizáciu:
1. Build stage - kompilácia React aplikácie
2. Production stage - nginx alebo jednoduchý web server pre statické súbory

#### Caddyfile
Konfigurácia Caddy servera:
- Reverse proxy alebo file_server
- Automatické SSL pre doménu
- Security headers
- Compression

#### docker-compose.yml
Orchestrácia:
- Caddy kontajner
- Build a spustenie aplikácie

### Deployment kroky

1. **Príprava servera**
   ```bash
   # Inštalácia Docker a Docker Compose na serveri
   sudo apt update
   sudo apt install docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   ```

2. **DNS konfigurácia**
   - Nastav A record pre doménu na IP adresu servera
   - Počkaj na propagáciu DNS (môže trvať pár hodín)

3. **Upload projektu na server**
   ```bash
   # Použitie git alebo scp/rsync
   git clone <repo-url>
   # alebo
   scp -r . user@server:/path/to/portfolio
   ```

4. **Upravenie Caddyfile**
   - Zmeň doménu v Caddyfile na tvoju doménu
   - Uprav email pre Let's Encrypt notifikácie

5. **Build a spustenie**
   ```bash
   docker-compose up -d --build
   ```

6. **Kontrola**
   - Over, že kontajnery bežia: `docker-compose ps`
   - Skontroluj logy: `docker-compose logs`
   - Navštív doménu v prehliadači

### Konfiguračné súbory

Všetky konfiguračné súbory nájdeš v projektu:
- `Dockerfile` - Build konfigurácia
- `Caddyfile` - Caddy web server konfigurácia
- `docker-compose.yml` - Orchestrácia kontajnerov
- `.dockerignore` - Ignorované súbory pri build

### Údržba

- **Aktualizácia aplikácie**: `docker-compose up -d --build`
- **Kontrola logov**: `docker-compose logs -f`
- **Reštart služieb**: `docker-compose restart`
- **Zastavenie**: `docker-compose down`

### Poznámky k SSL

- Caddy automaticky získava SSL certifikáty z Let's Encrypt
- Prvý request môže trvať dlhšie (certifikát sa získava)
- Certifikáty sa automaticky obnovujú pred expiráciou
- Pre staging/testing môžeš použiť `--staging` flag

## 12. Odkazy a zdroje

### Design inšpirácia
- Dribbble
- Behance
- Awwwards
- CSS Design Awards

### Ikony
- React Icons
- Heroicons
- Font Awesome

### Obrázky
- Unsplash (free stock photos)
- Pexels
- Vlastné screenshots projektov

### Deployment a DevOps
- Caddy dokumentácia: https://caddyserver.com/docs/
- Docker dokumentácia: https://docs.docker.com/
- Let's Encrypt: https://letsencrypt.org/

---

**Status**: 📋 Plán pripravený
**Dátum**: [Aktuálny dátum]
**Verzia**: 1.1 (Aktualizované s Docker a Caddy)

