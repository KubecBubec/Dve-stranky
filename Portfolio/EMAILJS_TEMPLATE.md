# EmailJS Template - Návod na vytvorenie

## 🚀 Rýchly Quick-Start

1. Choď na https://dashboard.emailjs.com/admin → **Email Templates** → **Create New Template**
2. Skopíruj obsah nižšie do template editora
3. Nastav **Service**: `service_xxxxxxx`
4. Nastav **To Email**: tvoj email
5. Nastav **Reply To**: `{{from_email}}`
6. Ulož a skopíruj **Template ID** do `.env` súboru

### Predmet (Subject):
```
Nový kontakt z portfólia: {{from_name}}
```

### Obsah (Content) - Skopíruj toto:
```html
<h2>📧 Nová správa z portfólia</h2>

<div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0;">
    <p><strong>👤 Od:</strong> {{from_name}}</p>
    <p><strong>📮 Email:</strong> {{from_email}}</p>
</div>

<div style="background: white; padding: 20px; border-left: 4px solid #667eea; margin: 15px 0;">
    <h3>Správa:</h3>
    <p style="white-space: pre-wrap; line-height: 1.6;">{{message}}</p>
</div>

<hr style="margin: 20px 0;">

<p style="color: #666; font-size: 12px;">
    <em>Táto správa bola odoslaná cez kontaktný formulár na portfóliu.<br>
    Odpovedz priamo na: <strong>{{from_email}}</strong></em>
</p>
```

---

## 📖 Detailný návod krok za krokom

### 1. Prihlás sa do EmailJS Dashboard
Choď na https://dashboard.emailjs.com/admin

### 2. Vytvor nový Email Template

1. V ľavom menu klikni na **"Email Templates"**
2. Klikni na **"Create New Template"**
3. Vyber si jeden z predvolených template alebo začni s prázdnym

### 3. Nastav Template obsah

#### Subject (Predmet):
```
Nová správa z portfólia od {{from_name}}
```

#### Content (Obsah emailu):

**HTML verzia:**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .info-box {
            background: white;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }
        .label {
            font-weight: bold;
            color: #667eea;
            display: inline-block;
            min-width: 100px;
        }
        .message-box {
            background: white;
            padding: 20px;
            margin: 15px 0;
            border-radius: 4px;
            border: 1px solid #e0e0e0;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Nová správa z portfólia</h1>
    </div>
    
    <div class="content">
        <div class="info-box">
            <div><span class="label">Od:</span> {{from_name}}</div>
            <div><span class="label">Email:</span> {{from_email}}</div>
            <div><span class="label">Pre:</span> {{to_email}}</div>
        </div>
        
        <div class="message-box">
            <h3>Správa:</h3>
            <p style="white-space: pre-wrap;">{{message}}</p>
        </div>
        
        <div class="footer">
            <p>Táto správa bola odoslaná cez kontaktný formulár na portfóliu.</p>
            <p>Odpovedz priamo na: <strong>{{from_email}}</strong></p>
        </div>
    </div>
</body>
</html>
```

**Jednoduchšia textová verzia (ak preferuješ jednoduchší dizajn):**
```html
<h2>Nová správa z portfólia</h2>

<p><strong>Od:</strong> {{from_name}}</p>
<p><strong>Email:</strong> {{from_email}}</p>
<p><strong>Pre:</strong> {{to_email}}</p>

<hr>

<h3>Správa:</h3>
<p style="white-space: pre-wrap;">{{message}}</p>

<hr>
<p><em>Táto správa bola odoslaná cez kontaktný formulár. Odpovedz priamo na: {{from_email}}</em></p>
```

### 4. Dôležité nastavenia

1. **Template Name**: Daj mu názov, napr. "Portfolio Contact Form"
2. **Service**: Vyber tvoj service (`service_xxxxxxx`)
3. **To Email**: Nastav na tvoj email
4. **From Name**: Môžeš nechať prázdne alebo nastaviť "Portfolio Contact Form"
5. **Reply To**: Nastav na `{{from_email}}` - aby si mohol odpovedať priamo na odosielateľa

### 5. Skopíruj Template ID

Po uložení template:
1. Klikni na tvoj template
2. V URL alebo v nastaveniach nájdeš **Template ID** (začína na `template_`)
3. Skopíruj ho do `.env` súboru ako `VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx`

### 6. Testovanie

1. V EmailJS dashboarde môžeš otestovať template pomocou "Test" tlačidla
2. Vyplň testovacie hodnoty:
   - `from_name`: Test User
   - `from_email`: test@example.com
   - `message`: Toto je testovacia správa
   - `to_email`: kubo.jancik@gmail.com

## Premenné používané v template

- `{{from_name}}` - Meno odosielateľa z formulára
- `{{from_email}}` - Email odosielateľa z formulára
- `{{message}}` - Správa z formulára
- `{{to_email}}` - Tvoj email (pre informáciu)

## Tipy

- **Reply To**: Nastav `{{from_email}}` v "Reply To" poli, aby si mohol odpovedať jedným klikom
- **Subject**: Použi `{{from_name}}` v predmete, aby si vedel, od koho je správa
- **Testovanie**: Vždy otestuj template pred použitím v produkcii

