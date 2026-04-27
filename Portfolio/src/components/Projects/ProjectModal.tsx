import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { FiX, FiGithub, FiExternalLink } from 'react-icons/fi'
import { FaTelegram } from 'react-icons/fa'
import type { Project } from '../../types'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const ProjectModal = ({ project, isOpen, onClose }: ProjectModalProps) => {
  // Blokovanie scrollu na pozadí, keď je modal otvorený
  useEffect(() => {
    if (isOpen) {
      // Uloženie pôvodnej hodnoty overflow
      const originalOverflow = document.body.style.overflow
      // Zablokovanie scrollu
      document.body.style.overflow = 'hidden'
      
      // Obnovenie scrollu pri unmount alebo zatvorení
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  if (!project) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#0a0a0a] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 p-6 flex items-start justify-between">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white pr-4">
                  {project.title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Zavrieť"
                >
                  <FiX className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Image */}
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mb-6 overflow-hidden relative">
                  {project.image ? (
                    <img
                      src={encodeURI(project.image)}
                      alt={project.title}
                      className="w-full h-auto object-contain"
                      onError={(e) => {
                        // Fallback na gradient s písmenom, ak sa obrázok nenačíta
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const parent = target.parentElement
                        if (parent) {
                          parent.innerHTML = `<div class="w-full min-h-64 flex items-center justify-center"><div class="text-white text-6xl font-bold opacity-50">${project.title.charAt(0)}</div></div>`
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full min-h-64 flex items-center justify-center">
                      <div className="text-white text-6xl font-bold opacity-50">
                        {project.title.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Popis projektu
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {project.longDescription || project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                    Technológie
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl.startsWith('http') ? project.liveUrl : `https://${project.liveUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      <span>Landing Page</span>
                    </a>
                  )}
                  {project.telegramUrl && (
                    <a
                      href={project.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#0088cc] text-white rounded-lg hover:bg-[#006ba3] transition-colors"
                    >
                      <FaTelegram className="w-5 h-5" />
                      <span>Telegram Bot</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ProjectModal


