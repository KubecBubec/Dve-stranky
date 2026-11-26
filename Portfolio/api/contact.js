// Vercel serverless funkcia pre kontaktný formulár.
// Posiela správy cez Resend (https://resend.com) na adresu v CONTACT_TO_EMAIL.
//
// Premenné prostredia (nastavujú sa vo Vercel projekte, nie vo frontende):
//   RESEND_API_KEY      - API kľúč z Resend
//   CONTACT_TO_EMAIL    - kam majú správy chodiť
//   CONTACT_FROM_EMAIL  - odosielateľ; bez overenej domény v Resend použi
//                         "Portfolio <onboarding@resend.dev>" (predvolené)

const LIMITS = { name: 100, email: 200, message: 5000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const json = (status, body) => Response.json(body, { status })

export async function POST(request) {
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'

  if (!apiKey || !to) {
    console.error('Contact form: missing RESEND_API_KEY or CONTACT_TO_EMAIL')
    return json(500, { error: 'Kontaktný formulár momentálne nie je dostupný.' })
  }

  let data
  try {
    data = await request.json()
  } catch {
    return json(400, { error: 'Neplatná požiadavka.' })
  }

  // Honeypot: skryté pole, ktoré vyplnia len boty. Tvárime sa, že je všetko OK.
  if (data?.website) {
    return json(200, { ok: true })
  }

  const name = String(data?.name ?? '').replace(/\s+/g, ' ').trim()
  const email = String(data?.email ?? '').trim()
  const message = String(data?.message ?? '').trim()

  if (!name || !email || !message) {
    return json(400, { error: 'Vyplň prosím meno, email aj správu.' })
  }
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return json(400, { error: 'Niektoré pole je príliš dlhé.' })
  }
  if (!EMAIL_RE.test(email)) {
    return json(400, { error: 'Zadaj prosím platnú emailovú adresu.' })
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Nová správa z portfólia od ${name}`,
        text: `Meno: ${name}\nEmail: ${email}\n\n${message}`,
      }),
    })

    if (!res.ok) {
      console.error('Resend error:', res.status, await res.text())
      return json(502, { error: 'Správu sa nepodarilo odoslať.' })
    }
  } catch (error) {
    console.error('Resend request failed:', error)
    return json(502, { error: 'Správu sa nepodarilo odoslať.' })
  }

  return json(200, { ok: true })
}
