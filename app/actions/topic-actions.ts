'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { userTopics, userPhases, progressLog } from '@/db/schema'

async function getSession() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

export async function toggleTopic(
  topicId: string,
  completed: boolean,
  phaseSlug: string
) {
  const session = await getSession()
  const db = getDb()

  const [topic] = await db
    .select()
    .from(userTopics)
    .where(and(eq(userTopics.id, topicId), eq(userTopics.userId, session.user.id)))
    .limit(1)

  if (!topic) return { error: 'Not found' }

  await db
    .update(userTopics)
    .set({ completed, completedAt: completed ? new Date() : null })
    .where(eq(userTopics.id, topicId))

  // INSERT into progress_log when completing — never delete from this table
  if (completed) {
    await db.insert(progressLog).values({
      userId: session.user.id,
      topicId,
    })
  }

  revalidatePath(`/phase/${phaseSlug}`)
  revalidatePath('/dashboard')
  return { success: true }
}

export async function addTopic(
  phaseId: string,
  label: string,
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

  const existing = await db
    .select({ orderIndex: userTopics.orderIndex })
    .from(userTopics)
    .where(eq(userTopics.phaseId, phaseId))
    .orderBy(userTopics.orderIndex)

  const nextIndex = existing.length > 0
    ? existing[existing.length - 1].orderIndex + 1
    : 1

  await db.insert(userTopics).values({
    phaseId,
    userId: session.user.id,
    label: label.trim(),
    orderIndex: nextIndex,
  })

  revalidatePath(`/phase/${phaseSlug}`)
  return { success: true }
}

export async function updateTopic(
  topicId: string,
  label: string,
  phaseSlug: string
) {
  const session = await getSession()
  const db = getDb()

  const [topic] = await db
    .select({ id: userTopics.id })
    .from(userTopics)
    .where(and(eq(userTopics.id, topicId), eq(userTopics.userId, session.user.id)))
    .limit(1)

  if (!topic) return { error: 'Not found' }

  await db
    .update(userTopics)
    .set({ label: label.trim() })
    .where(eq(userTopics.id, topicId))

  revalidatePath(`/phase/${phaseSlug}`)
  return { success: true }
}

export async function deleteTopic(topicId: string, phaseSlug: string) {
  const session = await getSession()
  const db = getDb()

  const [topic] = await db
    .select({ id: userTopics.id })
    .from(userTopics)
    .where(and(eq(userTopics.id, topicId), eq(userTopics.userId, session.user.id)))
    .limit(1)

  if (!topic) return { error: 'Not found' }

  // progress_log rows for this topic are kept — insert-only table
  await db.delete(userTopics).where(eq(userTopics.id, topicId))

  revalidatePath(`/phase/${phaseSlug}`)
  return { success: true }
}
