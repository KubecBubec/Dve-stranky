# Dve stranky

Monorepo pre dve samostatné webové stránky hostované na jednom Linux serveri cez Docker Compose a Caddy.

## Projekty

- `Portfolio` - osobné portfólio postavené na React, TypeScript, Vite a Tailwind CSS.
- `Útulňa Kráľová Studňa` - webová aplikácia pre turistickú útulňu s Node.js backendom, PostgreSQL databázou a vanilla frontend.

## Produkčné domény

- Portfolio: `https://kubojancik.site`
- Útulňa Kráľová Studňa: `https://utulna-kralova-studna.online`

Caddy konfigurácia je pripravená aj pre `www` varianty:

- `https://www.kubojancik.site`
- `https://www.utulna-kralova-studna.online`

DNS záznamy pre `www` musia smerovať na rovnaký server ako hlavné domény.

## Lokálna konfigurácia

Reálne hodnoty patria do lokálneho `.env` súboru, ktorý sa necommitujeme. Ako šablónu použi:

```bash
cp .env.example .env
```

Potrebné skupiny premenných:

- EmailJS premenné pre kontaktný formulár v portfóliu.
- Google OAuth premenné pre Útulňu.
- Session secret a databázové premenné pre backend.

## Spustenie cez Docker

```bash
docker-compose up -d --build
```

Kontajnery:

- `caddy-router` - verejný reverse proxy a TLS terminácia.
- `portfolio-app` - buildnuté portfólio v nginx image.
- `utulna-frontend` - buildnutý statický frontend Útulne v nginx image.
- `utulna-backend` - Node.js API pre Útulňu.
- `utulna-db` - PostgreSQL databáza s perzistentným volume.

## Deploy

Deploy beží cez GitHub Actions v jednom workflowe:

1. Build portfólia.
2. Syntax check backendu Útulne.
3. Kontrola frontend dependencies Útulne.
4. SSH deploy na server.

Serverový deploy script:

```bash
scripts/deploy.sh
```

Script na serveri stiahne najnovší `main` z GitHubu a spustí:

```bash
docker-compose up -d --build --remove-orphans
```

Databázové dáta ostávajú v Docker volume `postgres_data`.

## Verejný repozitár

Repo je pripravené na verejné použitie. Citlivé súbory sú ignorované:

- `.env`
- `.env.*`
- SSH kľúče
- `node_modules`
- build výstupy
- lokálne archívy
