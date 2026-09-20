import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle<typeof schema>> | null = null

export function getDb() {
  if (!_db) {
    // neon() throws on undefined — provide a placeholder during `next build`
    // when env vars are absent. No query ever runs at build time.
    const url =
      process.env.DATABASE_URL ??
      'postgresql://build:build@build.neon.tech/build'
    const sql = neon(url)
    _db = drizzle(sql, { schema })
  }
  return _db
}

export type Db = ReturnType<typeof getDb>
