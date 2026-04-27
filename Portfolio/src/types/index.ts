export interface Project {
  id: number
  title: string
  description: string
  longDescription?: string
  image: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
  telegramUrl?: string
  category: 'web' | 'mobile' | 'fullstack' | 'other'
}

export interface Skill {
  name: string
  level: 'advanced' | 'intermediate' | 'beginner'
  category: 'language' | 'framework' | 'tool' | 'database'
  icon?: string
}

export interface PersonalInfo {
  name: string
  title: string
  email: string
  location?: string
  bio: string
  social: {
    github?: string
    linkedin?: string
    instagram?: string
    twitter?: string
    website?: string
  }
}




