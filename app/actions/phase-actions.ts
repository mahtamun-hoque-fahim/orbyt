'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { userPhases, userTopics, phaseNotes, userResourceLinks } from '@/db/schema'

export async function deletePhase(phaseId: string) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()

  const [phase] = await db
    .select({ id: userPhases.id })
    .from(userPhases)
    .where(and(eq(userPhases.id, phaseId), eq(userPhases.userId, session.user.id)))
    .limit(1)

  if (!phase) return { error: 'Not found' }

  // Application-layer cascade — progress_log is never touched (insert-only)
  await db.delete(userResourceLinks).where(eq(userResourceLinks.phaseId, phaseId))
  await db.delete(phaseNotes).where(eq(phaseNotes.phaseId, phaseId))
  await db.delete(userTopics).where(eq(userTopics.phaseId, phaseId))
  await db.delete(userPhases).where(eq(userPhases.id, phaseId))

  revalidatePath('/dashboard')
  redirect('/dashboard')
}
