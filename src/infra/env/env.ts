import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.number().default(3333),
  DATABASE_URL: z.string().url(),
  PIC_AUTHORIZE_TRANSACTION_GATEWAY_URL: z.string().url(),
  NOTIFICATION_SERVICE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>
