import { FiGithub, FiInstagram, FiMail } from 'react-icons/fi'
import { personalInfo } from '../../data/personalInfo'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FiGithub, href: personalInfo.social.github, label: 'GitHub' },
    { icon: FiInstagram, href: personalInfo.social.instagram, label: 'Instagram' },
    { icon: FiMail, href: `mailto:${personalInfo.email}`, label: 'Email' },
  ].filter((link) => link.href)

  return (
    <footer className="bg-gray-50 dark:bg-[#1a1a1a] border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 dark:text-gray-400">
              © {currentYear} Všetky práva vyhradené
            </p>
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-6 h-6" />
                </a>
              )
            })}
          </div>
        </div>
        <div className="mt-8 text-center">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            Vytvorené s ❤️ pomocou React, TypeScript a Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

