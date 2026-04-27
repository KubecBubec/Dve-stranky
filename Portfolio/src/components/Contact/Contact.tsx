import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { FiMail, FiGithub, FiInstagram, FiSend, FiCheckCircle, FiXCircle } from 'react-icons/fi'
import emailjs from '@emailjs/browser'
import { personalInfo } from '../../data/personalInfo'
import { emailjsConfig } from '../../config/emailjs'

type MessageStatus = 'idle' | 'success' | 'error'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [messageStatus, setMessageStatus] = useState<MessageStatus>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessageStatus('idle')
    setStatusMessage('')

    // Kontrola, či sú EmailJS credentials nastavené
    if (!emailjsConfig.publicKey || !emailjsConfig.serviceId || !emailjsConfig.templateId) {
      setIsSubmitting(false)
      setMessageStatus('error')
      
      // V development móde zobraz detailnejšie informácie, v produkcii len všeobecnú hlášku
      if (import.meta.env.DEV) {
        const missingVars = []
        if (!emailjsConfig.publicKey) missingVars.push('VITE_EMAILJS_PUBLIC_KEY')
        if (!emailjsConfig.serviceId) missingVars.push('VITE_EMAILJS_SERVICE_ID')
        if (!emailjsConfig.templateId) missingVars.push('VITE_EMAILJS_TEMPLATE_ID')
        setStatusMessage(
          `EmailJS nie je správne nakonfigurovaný. Chýbajúce premenné: ${missingVars.join(', ')}. ` +
          'Skontroluj .env súbor a reštartuj dev server.'
        )
        console.error('Chýbajúce EmailJS environment variables:', missingVars)
      } else {
        setStatusMessage(
          'EmailJS nie je správne nakonfigurovaný. Kontaktuj prosím administrátora.'
        )
        console.error('EmailJS configuration error: Missing environment variables')
      }
      return
    }

    try {
      // Inicializácia EmailJS s Public Key
      emailjs.init(emailjsConfig.publicKey)

      // Odoslanie emailu cez EmailJS
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          to_email: personalInfo.email,
        }
      )

      // Úspech
      setMessageStatus('success')
      setStatusMessage('Ďakujem za správu! Odpoviem ti čo najskôr.')
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      // Chyba
      console.error('EmailJS Error:', error)
      setMessageStatus('error')
      setStatusMessage('Nastala chyba pri odosielaní správy. Skús to prosím znova alebo ma kontaktuj priamo na email.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const socialLinks = [
    { icon: FiGithub, href: personalInfo.social.github, label: 'GitHub' },
    { icon: FiInstagram, href: personalInfo.social.instagram, label: 'Instagram' },
    { icon: FiMail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  ].filter((link) => link.href)

  return (
    <section
      id="contact"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a] dark:bg-gradient-to-b relative overflow-hidden border-t-2 border-gray-200 dark:border-gray-800"
    >
      {/* Neónové pozadie - statické elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-80 h-80 bg-blue-600/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-1 h-96 bg-gradient-to-b from-transparent via-blue-600/40 dark:via-blue-500/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/3 right-0 w-1 h-80 bg-gradient-to-b from-transparent via-purple-600/40 dark:via-purple-500/30 to-transparent blur-sm" />
      </div>

      {/* Neónové pozadie - animované elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-blue-600/35 dark:bg-blue-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, 85, 0],
            y: [0, -65, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-600/35 dark:bg-purple-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, -75, 0],
            y: [0, 60, 0],
            scale: [1, 0.95, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-1 bg-gradient-to-l from-transparent via-cyan-600/45 dark:via-cyan-500/30 to-transparent blur-sm"
          animate={{
            x: [0, -180, 0],
            opacity: [0.5, 0.85, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-3 h-3 bg-cyan-600/60 dark:bg-cyan-400 rounded-full blur-md shadow-[0_0_20px_rgba(8,145,178,0.7)] dark:shadow-[0_0_15px_rgba(34,211,238,0.8)]"
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 55, -35, 0],
            scale: [1, 1.7, 0.75, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kontakt
            </span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <h3 className="text-2xl font-semibold mb-6">Zostaňme v kontakte</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Máš projekt alebo otázku? Neváhaj ma kontaktovať. Rád odpoviem na tvoje
                otázky alebo si popovídame o možnej spolupráci.
              </p>

              <div className="space-y-4 mb-8">
                <a
                  href={`mailto:${personalInfo.email}`}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <FiMail className="w-5 h-5" />
                  <span>{personalInfo.email}</span>
                </a>
              </div>

              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  if (!social.href) return null
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="w-6 h-6" />
                    </a>
                  )
                })}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Meno
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Tvoje meno"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="tvoj@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                  >
                    Správa
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tvoja správa..."
                  />
                </div>

                {/* Status Message */}
                {messageStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg flex items-start gap-3 ${
                      messageStatus === 'success'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    {messageStatus === 'success' ? (
                      <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <FiXCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p
                      className={`text-sm ${
                        messageStatus === 'success'
                          ? 'text-green-800 dark:text-green-200'
                          : 'text-red-800 dark:text-red-200'
                      }`}
                    >
                      {statusMessage}
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      />
                      Odosielam...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Odoslať správu
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact




