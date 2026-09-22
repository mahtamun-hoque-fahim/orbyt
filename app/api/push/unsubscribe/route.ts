import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { pushSubscriptions } from '@/db/schema'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { endpoint } = body as { endpoint: string }

  if (!endpoint) {
    return Response.json({ error: 'Missing endpoint' }, { status: 400 })
  }

  const db = getDb()

  await db
    .delete(pushSubscriptions)
    .where(
      and(
        eq(pushSubscriptions.endpoint, endpoint),
        eq(pushSubscriptions.userId, session.user.id)
      )
    )

  return Response.json({ ok: true })
}
