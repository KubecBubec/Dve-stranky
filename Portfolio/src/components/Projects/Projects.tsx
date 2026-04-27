import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { projects } from '../../data/projects'
import { FiGithub, FiExternalLink } from 'react-icons/fi'
import ProjectModal from './ProjectModal'
import type { Project } from '../../types'

const Projects = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = (project: Project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <section
      id="projects"
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:from-[#1a1a1a] dark:via-[#0f0f0f] dark:to-[#1a1a1a] dark:bg-gradient-to-b relative overflow-hidden border-t-2 border-gray-200 dark:border-gray-800"
    >
      {/* Neónové pozadie - statické elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-pink-600/30 dark:bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-indigo-600/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-0 w-1 h-80 bg-gradient-to-b from-transparent via-pink-600/40 dark:via-pink-500/30 to-transparent blur-sm" />
        <div className="absolute bottom-1/4 right-0 w-1 h-96 bg-gradient-to-b from-transparent via-indigo-600/40 dark:via-indigo-500/30 to-transparent blur-sm" />
        <div className="absolute top-1/2 left-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-purple-600/40 dark:via-purple-500/30 to-transparent blur-sm" />
      </div>

      {/* Neónové pozadie - animované elementy */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-pink-600/35 dark:bg-pink-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 80, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600/35 dark:bg-indigo-500/15 rounded-full blur-2xl"
          animate={{
            x: [0, 90, 0],
            y: [0, -70, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-96 h-1 bg-gradient-to-r from-transparent via-purple-600/45 dark:via-purple-500/30 to-transparent blur-sm"
          animate={{
            x: [0, 150, 0],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-pink-600/60 dark:bg-pink-400 rounded-full blur-md shadow-[0_0_20px_rgba(219,39,119,0.7)] dark:shadow-[0_0_20px_rgba(236,72,153,0.8)]"
          animate={{
            x: [0, 35, -25, 0],
            y: [0, -45, 35, 0],
            scale: [1, 1.5, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
            Moje <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">projekty</span>
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-[#0a0a0a] rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer"
                onClick={() => openModal(project)}
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden group-hover:scale-105 transition-transform duration-300 flex items-center justify-center">
                  {project.image ? (
                    <>
                      <img
                        src={encodeURI(project.image)}
                        alt={project.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Fallback na gradient s písmenom, ak sa obrázok nenačíta
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><div class="text-white text-4xl font-bold opacity-50">${project.title.charAt(0)}</div></div>`
                          }
                        }}
                      />
                      {/* Jemný overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-white text-4xl font-bold opacity-50">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FiGithub className="w-5 h-5" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        <FiExternalLink className="w-5 h-5" />
                        <span>Live</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Project Modal */}
      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  )
}

export default Projects




