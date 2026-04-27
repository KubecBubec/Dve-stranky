import type { Skill } from '../types'

export const skills: Skill[] = [
  // Programovacie jazyky
  { name: 'Python', level: 'advanced', category: 'language' },
  { name: 'JavaScript', level: 'advanced', category: 'language' },
  { name: 'HTML, CSS', level: 'advanced', category: 'language' },
  { name: 'Java', level: 'intermediate', category: 'language' },
  { name: 'PHP', level: 'intermediate', category: 'language' },
  { name: 'SQL', level: 'intermediate', category: 'language' },
  { name: 'TypeScript', level: 'intermediate', category: 'language' },
  { name: 'C', level: 'beginner', category: 'language' },
  { name: 'R', level: 'beginner', category: 'language' },

  // Frameworks & Knižnice
  { name: 'React', level: 'beginner', category: 'framework' },
  { name: 'Next.js', level: 'intermediate', category: 'framework' },
  { name: 'scikit-learn + TensorFlow', level: 'intermediate', category: 'framework' },

  // Nástroje & Technológie
  { name: 'Docker', level: 'advanced', category: 'tool' },
  { name: 'Git + GitHub', level: 'intermediate', category: 'tool' },
  { name: 'NGINX', level: 'intermediate', category: 'tool' },
  { name: 'Linux', level: 'intermediate', category: 'tool' },
  { name: 'API komunikácie (REST, GraphQL, gRPC, WebSockets)', level: 'intermediate', category: 'tool' },

  // Databázy
  { name: 'PostgreSQL', level: 'intermediate', category: 'database' },
  { name: 'MongoDB', level: 'beginner', category: 'database' },
]



