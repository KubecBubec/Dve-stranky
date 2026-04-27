# GDPR a Cookies Compliance - Útulňa Kráľová Studňa

## Prehľad implementácie

Pre stránku Útulňa Kráľová Studňa bola implementovaná kompletná GDPR compliance riešenie v súlade so slovenskou a európskou legislatívou.

## Čo bolo implementované

### 1. Cookie Consent Banner
- **Súbor**: `cookies.js`
- **Funkcie**:
  - Automatické zobrazenie banneru pri prvej návšteve
  - Možnosť prijať všetky cookies
  - Možnosť odmietnuť voliteľné cookies
  - Detailné nastavenia cookies podľa kategórií
  - Uloženie preferencií do localStorage

### 2. Zásady ochrany osobných údajov
- **Súbor**: `ochrana-osobnych-udajov.html`
- **Obsahuje**:
  - Úvod a identifikácia správcu údajov
  - Zoznam zbieraných údajov
  - Účely spracovania údajov
  - Právny základ spracovania
  - Doba uchovávania údajov
  - Zdieľanie údajov s tretími stranami
  - Informácie o cookies
  - Práva používateľov podľa GDPR
  - Bezpečnostné opatrenia
  - Kontaktné informácie
  - Informácie o dohľadovom orgáne (Úrad na ochranu osobných údajov SR)

### 3. Podmienky používania
- **Súbor**: `podmienky-pouzivania.html`
- **Obsahuje**:
  - Účel stránky
  - Pravidlá registrácie a používania účtu
  - Správanie používateľov
  - Vlastníctvo obsahu
  - Zodpovednosť prevádzkovateľa a používateľa
  - Bezpečnostné upozornenia týkajúce sa útulne
  - Odkazy na zásady ochrany osobných údajov

### 4. Aktualizácia hlavnej stránky
- Pridaný odkaz na `cookies.js` v `index.html`
- Pridané odkazy v footeri na:
  - Ochranu osobných údajov
  - Podmienky používania
  - Nastavenia cookies

### 5. CSS štýly
- Kompletné štýly pre cookie banner
- Responzívny dizajn pre mobilné zariadenia
- Modal okno pre nastavenia cookies

## Aké požiadavky platia pre vašu stránku

### GDPR (Všeobecné nariadenie o ochrane údajov)

Vaša stránka musí spĺňať GDPR, pretože:

1. **Spracúvate osobné údaje**:
   - Emailové adresy (cez Google OAuth)
   - Mená používateľov
   - Profilové fotografie
   - Údaje o návštevách (dátumy, poznámky)
   - Príspevky vo fóre

2. **Používate cookies**:
   - Session cookies pre autentifikáciu
   - Potenciálne analytické cookies

3. **Používate služby tretích strán**:
   - Google OAuth (autentifikácia)
   - Google Maps (vložená mapa)

### Požiadavky GDPR, ktoré musíte spĺňať:

#### ✅ 1. Informovanie používateľov (Článok 13 GDPR)
- **Splnené**: Zásady ochrany osobných údajov obsahujú všetky požadované informácie

#### ✅ 2. Súhlas so spracovaním údajov (Článok 6 GDPR)
- **Splnené**: Cookie banner umožňuje používateľom poskytnúť alebo odmietnuť súhlas
- **Poznámka**: Google OAuth vyžaduje súhlas pri prihlásení

#### ✅ 3. Právo na prístup k údajom (Článok 15 GDPR)
- **Splnené**: Zásady obsahujú informácie o práve na prístup
- **Odporúčanie**: Implementujte funkciu na export údajov používateľa

#### ✅ 4. Právo na vymazanie (Článok 17 GDPR - "Právo byť zabudnutý")
- **Splnené**: Zásady obsahujú informácie o práve na vymazanie
- **Odporúčanie**: Implementujte funkciu na vymazanie účtu a údajov

#### ✅ 5. Právo na prenosnosť údajov (Článok 20 GDPR)
- **Splnené**: Zásady obsahujú informácie o práve na prenosnosť
- **Odporúčanie**: Implementujte funkciu na export údajov v štandardnom formáte

#### ✅ 6. Informovanie o cookies (ePrivacy Directive)
- **Splnené**: Cookie banner a zásady obsahujú informácie o cookies

#### ✅ 7. Dohľadový orgán
- **Splnené**: Zásady obsahujú kontaktné informácie na Úrad na ochranu osobných údajov SR

### ePrivacy Directive (Smernica o cookies)

Vaša stránka musí spĺňať požiadavky na cookies:

1. **Informovanie o cookies** ✅
   - Cookie banner informuje používateľov o používaní cookies

2. **Súhlas pred použitím cookies** ✅
   - Cookie banner sa zobrazuje pred použitím voliteľných cookies

3. **Možnosť odmietnuť cookies** ✅
   - Používatelia môžu odmietnuť voliteľné cookies

### Zákon č. 18/2018 Z. z. o ochrane osobných údajov (Slovensko)

Tento zákon implementuje GDPR na Slovensku a vaša stránka musí spĺňať:
- Všetky požiadavky GDPR (splnené)
- Kontaktné informácie na dohľadový orgán (splnené)

## Čo ešte môžete urobiť (odporúčania)

### 1. Implementovať funkcie na uplatnenie práv používateľov

Vytvorte API endpointy a UI pre:
- **Export údajov**: `/api/user/export` - export všetkých údajov používateľa v JSON formáte
- **Vymazanie účtu**: `/api/user/delete` - vymazanie účtu a všetkých súvisiacich údajov
- **Oprava údajov**: `/api/user/update` - možnosť upraviť osobné údaje

### 2. Pridať funkciu na správu cookies v nastaveniach

Vytvorte stránku alebo sekciu v nastaveniach, kde používatelia môžu:
- Zmeniť preferencie cookies
- Zobraziť zoznam všetkých používaných cookies
- Vymazať cookies

### 3. Implementovať logovanie súhlasov

Pre právnu ochranu odporúčame:
- Ukladať dátum a čas poskytnutia súhlasu
- Ukladať verziu zásad ochrany osobných údajov, s ktorou používateľ súhlasil
- Ukladať IP adresu (dočasne, len pre právne účely)

### 4. Pridať Data Processing Agreement (DPA)

Ak používate služby tretích strán (Google OAuth, hosting), mali by ste mať:
- Dohody o spracovaní údajov s poskytovateľmi služieb
- Dokumentáciu o bezpečnostných opatreniach

### 5. Pravidelná kontrola a aktualizácia

- Pravidelne kontrolujte, či zásady zodpovedajú aktuálnemu stavu stránky
- Aktualizujte dátum "Posledná aktualizácia" pri zmene zásad
- Informujte používateľov o významných zmenách

## Kontrolný zoznam compliance

- [x] Cookie consent banner
- [x] Zásady ochrany osobných údajov (GDPR)
- [x] Podmienky používania
- [x] Informovanie o cookies
- [x] Možnosť odmietnuť voliteľné cookies
- [x] Kontaktné informácie správcu údajov
- [x] Informácie o dohľadovom orgáne
- [x] Práva používateľov podľa GDPR
- [ ] Funkcia na export údajov (odporúčané)
- [ ] Funkcia na vymazanie účtu (odporúčané)
- [ ] Logovanie súhlasov (odporúčané)

## Kontaktné informácie

Pre otázky týkajúce sa GDPR compliance:
- Úrad na ochranu osobných údajov SR: https://dataprotection.gov.sk
- Email: statny.dozor@pdp.gov.sk

## Zdroje

- [GDPR Text (EUR-Lex)](https://eur-lex.europa.eu/legal-content/SK/TXT/?uri=CELEX:32016R0679)
- [Úrad na ochranu osobných údajov SR](https://dataprotection.gov.sk)
- [Zákon č. 18/2018 Z. z. o ochrane osobných údajov](https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2018/18/)
