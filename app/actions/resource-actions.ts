'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { userResourceLinks, userPhases } from '@/db/schema'

async function getSession() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

export async function addResourceLink(
  phaseId: string,
  label: string,
  url: string,
  phaseSlug: string
) {
  const session = await getSession()
  const db = getDb()

  const [phase] = await db
    .select({ id: userPhases.id })
    .from(userPhases)
    .where(and(eq(userPhases.id, phaseId), eq(userPhases.userId, session.user.id)))
    .limit(1)

  if (!phase) return { error: 'Not found' }

  await db.insert(userResourceLinks).values({
    phaseId,
    userId: session.user.id,
    label: label.trim(),
    url: url.trim(),
  })

  revalidatePath(`/phase/${phaseSlug}`)
  return { success: true }
}

export async function deleteResourceLink(linkId: string, phaseSlug: string) {
  const session = await getSession()
  const db = getDb()

  const [link] = await db
    .select({ id: userResourceLinks.id })
    .from(userResourceLinks)
    .where(
      and(
        eq(userResourceLinks.id, linkId),
        eq(userResourceLinks.userId, session.user.id)
      )
    )
    .limit(1)

  if (!link) return { error: 'Not found' }

  await db.delete(userResourceLinks).where(eq(userResourceLinks.id, linkId))

  revalidatePath(`/phase/${phaseSlug}`)
  return { success: true }
}
