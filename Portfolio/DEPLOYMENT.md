# Deployment Guide - Docker + Caddy

Tento dokument popisuje, ako nasadiť portfólio aplikáciu na server pomocou Docker a Caddy.

## Požiadavky

- Server s Linux OS (Ubuntu/Debian odporúčané)
- Docker a Docker Compose nainštalované
- Doména nastavená a smerujúca na IP servera
- Porty 80 a 443 otvorené vo firewalle

## Krok 1: Príprava servera

### Inštalácia Docker

```bash
# Aktualizácia systému
sudo apt update
sudo apt upgrade -y

# Inštalácia Docker
sudo apt install -y docker.io docker-compose

# Spustenie Docker služby
sudo systemctl start docker
sudo systemctl enable docker

# Overenie inštalácie
docker --version
docker-compose --version

# Voliteľne: Pridanie užívateľa do docker skupiny (aby nemusel používať sudo)
sudo usermod -aG docker $USER
# Odhlás sa a prihlás sa znova, aby sa zmeny prejavili
```

### Firewall konfigurácia

```bash
# Povolenie HTTP a HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp  # Pre HTTP/3 (QUIC)

# Overenie firewall pravidiel
sudo ufw status
```

## Krok 2: DNS konfigurácia

1. Choď do svojho DNS poskytovateľa (registrátor domény)
2. Vytvor A record:
   - **Name**: `@` alebo tvoja subdoména (napr. `portfolio`)
   - **Type**: `A`
   - **Value**: IP adresa tvojho servera
   - **TTL**: 3600 (alebo predvolené)
3. Počkaj na propagáciu DNS (môže trvať pár minút až hodín)
4. Over DNS propagáciu:
   ```bash
   dig tvojadomena.com
   # alebo
   nslookup tvojadomena.com
   ```

## Krok 3: SSH Pripojenie na server

### Konfigurácia SSH kľúča

Pre pripojenie na server **158.101.194.142** použij projektový SSH kľúč z priečinka `ssh_keys/`.

**Dôležité**: Pozri si `ssh_keys/README.md` pre podrobné inštrukcie o nastavení SSH kľúča.

#### Rýchle pripojenie

```bash
# Použitie projektového SSH kľúča
ssh -i ssh_keys/id_ed25519_old ubuntu@158.101.194.142
```

Alebo s SSH config súborom:
```bash
ssh -F ssh_keys/config portfolio-server
```

## Krok 4: Upload projektu na server

### Metóda 1: Git (Odporúčané)

```bash
# Na serveri
cd ~
git clone <tvoj-git-repo-url> portfolio
cd portfolio
```

### Metóda 2: SCP

```bash
# Na lokálnom počítači (používa projektový SSH kľúč)
scp -i ssh_keys/id_ed25519_old -r . ubuntu@158.101.194.142:/home/ubuntu/portfolio
```

### Metóda 3: Rsync

```bash
# Na lokálnom počítači (používa projektový SSH kľúč)
rsync -avz -e "ssh -i ssh_keys/id_ed25519_old" --exclude 'node_modules' --exclude '.git' . ubuntu@158.101.194.142:/home/ubuntu/portfolio
```

## Krok 5: Konfigurácia

### Upravenie Caddyfile

1. Otvor `Caddyfile` na serveri
2. Zmeň `tvojadomena.com` na svoju doménu
3. Zmeň `tvoj@email.com` na svoj email (pre Let's Encrypt notifikácie)

```bash
nano Caddyfile
```

Príklad:
```
mojadomena.com {
    reverse_proxy portfolio-app:80
    email moj@email.com
    ...
}
```

## Krok 6: Build a spustenie

```bash
# Prejsť do priečinka projektu
cd ~/portfolio

# Build a spustenie kontajnerov
docker-compose up -d --build

# Overenie, že kontajnery bežia
docker-compose ps

# Zobrazenie logov
docker-compose logs -f
```

## Krok 7: Overenie

1. Otvor prehliadač a navštív `https://tvojadomena.com`
2. Over, že SSL certifikát je platný (zelený zámok)
3. Skontroluj, že stránka sa načítava správne

## Údržba a príkazy

### Aktualizácia aplikácie

```bash
cd ~/portfolio
git pull  # Ak používaš Git
docker-compose up -d --build
```

### Zobrazenie logov

```bash
# Všetky logy
docker-compose logs -f

# Logy konkrétnej služby
docker-compose logs -f portfolio-app
docker-compose logs -f caddy
```

### Reštart služieb

```bash
# Reštart všetkých služieb
docker-compose restart

# Reštart konkrétnej služby
docker-compose restart portfolio-app
docker-compose restart caddy
```

### Zastavenie služieb

```bash
# Zastavenie bez odstránenia kontajnerov
docker-compose stop

# Zastavenie a odstránenie kontajnerov
docker-compose down

# Zastavenie, odstránenie kontajnerov a volumes
docker-compose down -v
```

### Kontrola využitia zdrojov

```bash
# Stav kontajnerov
docker-compose ps

# Využitie zdrojov
docker stats

# Disk využitie
docker system df
```

### Čistenie Docker

```bash
# Odstránenie nepoužívaných obrázkov
docker image prune -a

# Odstránenie nepoužívaných volumes
docker volume prune

# Komplexné čistenie (opatrne!)
docker system prune -a --volumes
```

## Riešenie problémov

### SSL certifikát sa nezískal

1. Over DNS propagáciu: `dig tvojadomena.com`
2. Skontroluj, že porty 80 a 443 sú otvorené
3. Skontroluj logy Caddy: `docker-compose logs caddy`
4. Over email v Caddyfile
5. Pre testovanie môžeš použiť staging Let's Encrypt (pridaj `tls {
    acme_ca https://acme-staging-v02.api.letsencrypt.org/directory
}` do Caddyfile)

### Stránka sa nenačítava

1. Skontroluj logy: `docker-compose logs`
2. Over, že kontajnery bežia: `docker-compose ps`
3. Skontroluj sieťovú konektivitu medzi kontajnermi
4. Over Caddyfile syntax: `docker-compose exec caddy caddy validate --config /etc/caddy/Caddyfile`

### Build zlyhá

1. Skontroluj Dockerfile syntax
2. Over, že všetky závislosti sú v package.json
3. Skontroluj logy build procesu: `docker-compose build --no-cache`

## Bezpečnostné odporúčania

1. **Firewall**: Používaj UFW alebo iptables
2. **SSH**: Zmeň predvolený port a používaj SSH kľúče
3. **Aktualizácie**: Pravidelne aktualizuj Docker a systém
4. **Backup**: Zálohuj Caddy data volume (obsahuje SSL certifikáty)
5. **Monitoring**: Nastav monitoring pre kontajnery

## Backup SSL certifikátov

Caddy ukladá SSL certifikáty v `caddy_data` volume. Pre backup:

```bash
# Backup volume
docker run --rm -v portfolio_caddy_data:/data -v $(pwd):/backup alpine tar czf /backup/caddy_data_backup.tar.gz /data

# Obnovenie
docker run --rm -v portfolio_caddy_data:/data -v $(pwd):/backup alpine tar xzf /backup/caddy_data_backup.tar.gz -C /
```

## Ďalšie zdroje

- [Caddy dokumentácia](https://caddyserver.com/docs/)
- [Docker dokumentácia](https://docs.docker.com/)
- [Docker Compose dokumentácia](https://docs.docker.com/compose/)

