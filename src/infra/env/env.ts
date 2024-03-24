import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.number().default(3333),
  DATABASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
