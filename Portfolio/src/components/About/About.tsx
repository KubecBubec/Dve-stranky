import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { personalInfo } from '../../data/personalInfo'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:from-[#1a1a1a] dark:via-[#0f0f0f] dark:to-[#1a1a1a] dark:bg-gradient-to-b relative overflow-hidden border-t-2 border-gray-200 dark:border-gray-800"
    >
      {/* Neónové pozadie - statické elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-purple-600/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/30 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-0 w-1 h-64 bg-gradient-to-b from-transparent via-purple-600/40 dark:via-purple-500/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/3 right-0 w-1 h-72 bg-gradient-to-b from-transparent via-blue-600/40 dark:via-blue-500/30 to-transparent blur-sm" />
      </div>

      {/* Neónové pozadie - animované elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-600/35 dark:bg-purple-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, 80, 0],
            y: [0, -60, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-blue-600/35 dark:bg-blue-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, -70, 0],
            y: [0, 50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-80 bg-gradient-to-b from-transparent via-cyan-600/45 dark:via-cyan-500/30 to-transparent blur-sm"
          animate={{
            rotate: [0, 15, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: 'center' }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            O <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">mne</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Profile Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex justify-center md:justify-start"
            >
              <div className="relative w-full max-w-md">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-500/20 dark:border-purple-500/20">
                  <img
                    src="/images/profile/myimage-Photoroom.png"
                    alt={personalInfo.name}
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/10 to-purple-600/10 pointer-events-none" />
              </div>
            </motion.div>

            {/* Text Content */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
            <motion.div
              className="space-y-6 text-gray-700 dark:text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >

              <p>
                Študujem na <strong>Technickej Univerzite v Košiciach</strong> odbor{' '}
                <strong>Hospodárska Informatika</strong>, kde sa zameriavam na <strong>prácu s dátami</strong> a{' '}
                <strong>učenie modelov neurónových sietí</strong>. Táto kombinácia mi umožňuje vytvárať aplikácie, 
                ktoré nie sú len funkčné, ale aj inteligentné.
              </p>

              <p>
                Najviac ma baví tvorba <strong>web aplikácií cez Docker</strong>, <strong>automatizácia procesov</strong> a{' '}
                <strong>sledovanie výkonu cez admin panely</strong>. Projekt ktorý ma najviac zaujal je <strong>Waze Notifier Pro</strong> - 
                full-stack aplikácia s registráciou, overovaním používateľov a komplexným backend systémom. 
                Taktiež ma zaujala integrácia <strong>Solana blockchainu</strong> do aplikácií, konkrétne práca s krypto peňaženkami a transakciami priamo v kóde.
              </p>

              <p>
                Čo ma na programovaní najviac fascinuje, je <strong>leverage</strong>, ktorý poskytuje - môžem niečo spraviť 
                raz a ono to bude pracovať bez prestávky navždy. Rád riešim komplexné problémy a následne ich automatizujem. 
                Môj štýl práce začína hlbokým pochopením problému, skúmaním možností riešenia a technológií, a úzkou 
                spoluprácou s AI pre rýchly začiatok projektu. Väčšinu času trávim prípravov, dolaďovaním a následným nasadením.
              </p>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About




