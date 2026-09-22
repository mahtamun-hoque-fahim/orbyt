import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { notificationSettings, userPhases } from '@/db/schema'
import { toLocalTime } from '@/lib/utils'
import SettingsTabs from '@/components/settings/SettingsTabs'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function SettingsPage({ searchParams }: Props) {
  const { tab } = await searchParams
  const activeTab = tab === 'profile' || tab === 'track' ? tab : 'notifications'

  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const userId = session.user.id

  const [notifRecord, phases] = await Promise.all([
    db
      .select()
      .from(notificationSettings)
      .where(eq(notificationSettings.userId, userId))
      .limit(1),
    db
      .select()
      .from(userPhases)
      .where(eq(userPhases.userId, userId))
      .orderBy(userPhases.orderIndex),
  ])

  const notif = notifRecord[0]
  const localTime =
    notif?.reminderTime && notif?.timezone
      ? toLocalTime(notif.reminderTime, notif.timezone)
      : '09:00'

  const phaseData = phases.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    channelName: p.channelName,
    orderIndex: p.orderIndex,
  }))

  return (
    <SettingsTabs
      activeTab={activeTab}
      user={{ name: session.user.name ?? '', email: session.user.email }}
      notifSettings={{
        enabled: notif?.enabled ?? false,
        localTime,
        timezone: notif?.timezone ?? 'UTC',
      }}
      phases={phaseData}
    />
  )
}
