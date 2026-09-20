import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { userPhases, tracks, templatePhases } from '@/db/schema'
import TrackSelector from '@/components/onboarding/TrackSelector'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const userId = session.user.id

  // Redirect guard: user already picked a track
  const existing = await db
    .select({ id: userPhases.id })
    .from(userPhases)
    .where(eq(userPhases.userId, userId))
    .limit(1)

  if (existing.length > 0) redirect('/dashboard')

  // Load the web-dev track
  const [webDevTrack] = await db
    .select()
    .from(tracks)
    .where(eq(tracks.slug, 'web-dev'))
    .limit(1)

  // Load its phases for the preview card
  const phases = webDevTrack
    ? await db
        .select({
          id: templatePhases.id,
          name: templatePhases.name,
          channelName: templatePhases.channelName,
          orderIndex: templatePhases.orderIndex,
        })
        .from(templatePhases)
        .where(eq(templatePhases.trackId, webDevTrack.id))
        .orderBy(templatePhases.orderIndex)
    : []

  return (
    <TrackSelector
      webDevTrackId={webDevTrack?.id ?? null}
      webDevPhases={phases}
      userName={session.user.name ?? ''}
    />
  )
}
