'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import {
  templatePhases,
  templateTopics,
  userPhases,
  userTopics,
} from '@/db/schema'

export async function selectTrack(trackId: string) {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const userId = session.user.id

  const phases = await db
    .select()
    .from(templatePhases)
    .where(eq(templatePhases.trackId, trackId))
    .orderBy(templatePhases.orderIndex)

  for (const phase of phases) {
    const [inserted] = await db
      .insert(userPhases)
      .values({
        userId,
        trackId: phase.trackId,
        name: phase.name,
        slug: phase.slug,
        channelName: phase.channelName,
        channelUrl: phase.channelUrl,
        playlistUrl: phase.playlistUrl,
        orderIndex: phase.orderIndex,
      })
      .returning()

    const topics = await db
      .select()
      .from(templateTopics)
      .where(eq(templateTopics.phaseId, phase.id))
      .orderBy(templateTopics.orderIndex)

    if (topics.length > 0) {
      await db.insert(userTopics).values(
        topics.map((t) => ({
          phaseId: inserted.id,
          userId,
          label: t.label,
          orderIndex: t.orderIndex,
        }))
      )
    }
  }

  redirect('/dashboard')
}

export async function selectCustomTrack() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  redirect('/dashboard')
}
