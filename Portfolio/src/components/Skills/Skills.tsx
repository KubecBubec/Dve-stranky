import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { skills } from '../../data/skills'
import {
  SiJavascript,
  SiTypescript,
  SiReact,
  SiPython,
  SiPhp,
  SiGit,
  SiDocker,
  SiNginx,
  SiLinux,
  SiNextdotjs,
  SiTensorflow,
  SiHtml5,
  SiCss3,
} from 'react-icons/si'
import { FiCode, FiDatabase } from 'react-icons/fi'

const skillIcons: Record<string, React.ComponentType<any> | null> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  React: SiReact,
  Python: SiPython,
  Java: FiCode, // SiJava doesn't exist
  PHP: SiPhp,
  'HTML, CSS': null, // Will use custom icon
  'Git + GitHub': SiGit,
  Docker: SiDocker,
  NGINX: SiNginx,
  Linux: SiLinux,
  'Next.js': SiNextdotjs,
  'scikit-learn + TensorFlow': SiTensorflow,
  SQL: FiDatabase,
  C: FiCode,
  R: FiCode,
  'API komunikácie (REST, GraphQL, gRPC, WebSockets)': FiCode,
}

const levelColors = {
  advanced: 'bg-green-500',
  intermediate: 'bg-yellow-500',
  beginner: 'bg-blue-500',
}

const levelLabels = {
  advanced: 'Pokročilý',
  intermediate: 'Stredne pokročilý',
  beginner: 'Začiatočník',
}

const Skills = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const categories = {
    language: skills.filter((s) => s.category === 'language'),
    framework: skills.filter((s) => s.category === 'framework'),
    tool: skills.filter((s) => s.category === 'tool'),
    database: skills.filter((s) => s.category === 'database'),
  }

  return (
    <section
      id="skills"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:from-[#0a0a0a] dark:via-[#1a1a1a] dark:to-[#0a0a0a] dark:bg-gradient-to-b relative overflow-hidden border-t-2 border-gray-200 dark:border-gray-800"
    >
      {/* Neónové pozadie - statické elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-80 h-80 bg-cyan-600/30 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-600/30 dark:bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-yellow-600/30 dark:bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute top-0 right-1/2 w-1 h-96 bg-gradient-to-b from-transparent via-cyan-600/40 dark:via-cyan-500/30 to-transparent blur-sm" />
        <div className="absolute bottom-0 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-green-600/40 dark:via-green-500/30 to-transparent blur-sm" />
      </div>

      {/* Neónové pozadie - animované elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-cyan-600/35 dark:bg-cyan-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, -90, 0],
            y: [0, 70, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/3 left-1/4 w-72 h-72 bg-green-600/35 dark:bg-green-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, 60, 0],
            y: [0, -50, 0],
            scale: [1, 0.85, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/3 w-3 h-3 bg-yellow-600/60 dark:bg-yellow-400 rounded-full blur-md shadow-[0_0_20px_rgba(202,138,4,0.7)] dark:shadow-[0_0_20px_rgba(234,179,8,0.8)]"
          animate={{
            x: [0, 40, -30, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.6, 0.7, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Zručnosti
            </span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Object.entries(categories).map(([category, categorySkills], categoryIndex) => {
              // Skip empty categories
              if (categorySkills.length === 0) return null

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                  className="bg-white dark:bg-[#1a1a1a] rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-4 capitalize">
                    {category === 'language' && 'Jazyky'}
                    {category === 'framework' && 'Frameworks'}
                    {category === 'tool' && 'Nástroje'}
                    {category === 'database' && 'Databázy'}
                  </h3>
                  <div className="space-y-4">
                    {categorySkills.map((skill) => {
                      const Icon = skillIcons[skill.name]
                      const isHtmlCss = skill.name === 'HTML, CSS'
                      
                      return (
                        <div key={skill.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {isHtmlCss ? (
                              <div className="flex gap-1">
                                <SiHtml5 className="w-5 h-5 text-orange-500" />
                                <SiCss3 className="w-5 h-5 text-blue-500" />
                              </div>
                            ) : Icon ? (
                              <Icon className="w-5 h-5" />
                            ) : (
                              <FiCode className="w-5 h-5" />
                            )}
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                              {skill.name}
                            </span>
                          </div>
                          <div
                            className={`w-2 h-2 rounded-full ${levelColors[skill.level]}`}
                            title={levelLabels[skill.level]}
                          />
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
