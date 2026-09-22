import { headers } from 'next/headers'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { pushSubscriptions } from '@/db/schema'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { endpoint, keys } = body as {
    endpoint: string
    keys: { p256dh: string; auth: string }
  }

  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return Response.json({ error: 'Invalid subscription data' }, { status: 400 })
  }

  const db = getDb()

  await db
    .insert(pushSubscriptions)
    .values({
      userId: session.user.id,
      endpoint,
      p256dhKey: keys.p256dh,
      authKey: keys.auth,
    })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: session.user.id, p256dhKey: keys.p256dh, authKey: keys.auth },
    })

  return Response.json({ ok: true })
}
