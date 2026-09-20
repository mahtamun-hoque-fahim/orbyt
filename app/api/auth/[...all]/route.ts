import { toNextJsHandler } from 'better-auth/next-js'
import { getAuth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Access getAuth() inside handlers — never at module evaluation time
export async function GET(req: Request) {
  return toNextJsHandler(getAuth().handler).GET(req)
}

export async function POST(req: Request) {
  return toNextJsHandler(getAuth().handler).POST(req)
}
