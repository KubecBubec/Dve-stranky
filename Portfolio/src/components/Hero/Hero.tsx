import { motion } from 'framer-motion'
import { FiArrowDown } from 'react-icons/fi'
import { personalInfo } from '../../data/personalInfo'
import { useState, useEffect } from 'react'

const Hero = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    // Detekcia mobilného zariadenia
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Detekcia preferencie znížených animácií
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  const shouldReduceAnimations = isMobile || prefersReducedMotion

  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden bg-white dark:from-[#0a0a0a] dark:via-[#0a0a0a] dark:to-[#1a1a1a] dark:bg-gradient-to-b"
    >
      {/* Neónové pozadie - statické elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none gpu-accelerated">
        {/* Statické neónové kruhy - znížená intenzita blur na mobiloch */}
        <div className={`absolute top-20 left-10 w-72 h-72 bg-blue-600/30 dark:bg-blue-500/10 rounded-full ${shouldReduceAnimations ? 'blur-xl' : 'blur-3xl'}`} />
        <div className={`absolute top-40 right-20 w-96 h-96 bg-purple-600/30 dark:bg-purple-500/10 rounded-full ${shouldReduceAnimations ? 'blur-xl' : 'blur-3xl'}`} />
        {!shouldReduceAnimations && (
          <>
            <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-pink-600/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-40 right-1/3 w-64 h-64 bg-cyan-600/30 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          </>
        )}
        
        {/* Statické neónové čiary - znížený počet na mobiloch */}
        <div className="absolute top-1/4 left-0 w-1 h-96 bg-gradient-to-b from-transparent via-blue-600/40 dark:via-blue-500/30 to-transparent blur-sm" />
        {!shouldReduceAnimations && (
          <>
            <div className="absolute top-1/3 right-0 w-1 h-80 bg-gradient-to-b from-transparent via-purple-600/40 dark:via-purple-500/30 to-transparent blur-sm" />
            <div className="absolute bottom-1/4 left-1/3 w-96 h-1 bg-gradient-to-r from-transparent via-pink-600/40 dark:via-pink-500/30 to-transparent blur-sm" />
          </>
        )}
      </div>

      {/* Neónové pozadie - animované elementy - znížený počet na mobiloch */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none gpu-accelerated">
          {/* Animovaný neónový kruh 1 - vždy viditeľný, ale s menším blur na mobiloch */}
          <motion.div
            className={`absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/35 dark:bg-blue-500/20 rounded-full ${shouldReduceAnimations ? 'blur-lg' : 'blur-2xl'}`}
            animate={shouldReduceAnimations ? {} : {
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Animovaný neónový kruh 2 - len na desktop */}
          {!shouldReduceAnimations && (
            <>
              <motion.div
                className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-600/35 dark:bg-purple-500/20 rounded-full blur-2xl"
                animate={{
                  x: [0, -80, 0],
                  y: [0, 60, 0],
                  scale: [1, 0.8, 1],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              <motion.div
                className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-600/35 dark:bg-pink-500/20 rounded-full blur-2xl"
                animate={{
                  x: [0, 60, 0],
                  y: [0, -80, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Animovaná neónová čiara 1 */}
              <motion.div
                className="absolute top-1/2 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-cyan-600/45 dark:via-cyan-500/40 to-transparent blur-sm"
                animate={{
                  x: [0, 200, 0],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Animovaná neónová čiara 2 */}
              <motion.div
                className="absolute bottom-1/3 right-0 w-80 h-1 bg-gradient-to-l from-transparent via-blue-600/45 dark:via-blue-500/40 to-transparent blur-sm"
                animate={{
                  x: [0, -150, 0],
                  opacity: [0.5, 0.85, 0.5],
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Animovaný neónový bod */}
              <motion.div
                className="absolute top-1/3 right-1/3 w-4 h-4 bg-cyan-600/60 dark:bg-cyan-400 rounded-full blur-md shadow-[0_0_20px_rgba(8,145,178,0.7)] dark:shadow-[0_0_20px_rgba(34,211,238,0.8)]"
                animate={{
                  x: [0, 30, -20, 0],
                  y: [0, -40, 30, 0],
                  scale: [1, 1.5, 0.8, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Animovaný neónový bod 2 */}
              <motion.div
                className="absolute bottom-1/4 left-1/4 w-3 h-3 bg-purple-600/60 dark:bg-purple-400 rounded-full blur-md shadow-[0_0_20px_rgba(147,51,234,0.7)] dark:shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                animate={{
                  x: [0, -25, 35, 0],
                  y: [0, 50, -30, 0],
                  scale: [1, 1.8, 0.7, 1],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </>
          )}
        </div>
      )}

      <div className="container mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-blue-500/20 dark:border-purple-500/20 shadow-2xl">
                <img
                  src="/images/profile/myimage2.jpg"
                  alt={personalInfo.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse pointer-events-none" />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Ahoj, som{' '}
            <span className="block mt-2">{personalInfo.name}</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {personalInfo.title}
          </motion.p>

          <motion.p
            className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {personalInfo.bio}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Pozri moje projekty
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              Kontaktuj ma
            </button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            onClick={() => scrollToSection('about')}
            className="animate-bounce"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            aria-label="Scroll down"
          >
            <FiArrowDown className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero
