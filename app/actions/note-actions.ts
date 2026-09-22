'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { phaseNotes, userPhases } from '@/db/schema'

export async function saveNote(phaseId: string, content: string) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()

  // Verify ownership
  const [phase] = await db
    .select({ id: userPhases.id })
    .from(userPhases)
    .where(and(eq(userPhases.id, phaseId), eq(userPhases.userId, session.user.id)))
    .limit(1)

  if (!phase) return { error: 'Not found' }

  await db
    .insert(phaseNotes)
    .values({
      phaseId,
      userId: session.user.id,
      content,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: phaseNotes.phaseId,
      set: { content, updatedAt: new Date() },
    })

  return { success: true }
}
