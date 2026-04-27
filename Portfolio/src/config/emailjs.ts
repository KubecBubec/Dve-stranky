// EmailJS Configuration
// Pre získanie týchto údajov:
// 1. Vytvor účet na https://www.emailjs.com/
// 2. Vytvor Email Service (Gmail, Outlook, atď.)
// 3. Vytvor Email Template
// 4. Skopíruj Public Key, Service ID a Template ID sem

export const emailjsConfig = {
  // Tvoj EmailJS Public Key (USER_ID)
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || '',
  
  // Tvoj EmailJS Service ID
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || '',
  
  // Tvoj EmailJS Template ID
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || '',
}


