import { defineCollection, z } from 'astro:content'

const profile = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    role: z.string(),
    email: z.string().email(),
    avatar: z.string(),
    social: z.object({
      github: z.object({
        url: z.string().url(),
        label: z.string(),
      }),
      linkedin: z.object({
        url: z.string().url(),
        label: z.string(),
      }),
      instagram: z.object({
        url: z.string().url(),
        label: z.string(),
      }),
    }),
  }),
})

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: 'Invalid date format',
    }),
    technologies: z.array(z.string()),
    company: z.string(), // Nombre de la empresa
    companySlug: z.string().optional(), // Slug de la empresa (se puede inferir de la carpeta)
  }),
})

export const collections = {
  profile,
  projects
}