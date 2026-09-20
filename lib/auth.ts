import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@/db'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null

/**
 * Lazy singleton — never called at module load time.
 * betterAuth() calls getDb() internally; deferring to request time
 * means the Vercel build never touches DATABASE_URL.
 */
export function getAuth(): ReturnType<typeof betterAuth> {
  if (_auth) return _auth
  _auth = betterAuth({
    database: drizzleAdapter(getDb(), { provider: 'pg' }),
    emailAndPassword: { enabled: true },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24,
    },
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
  })
  return _auth
}
