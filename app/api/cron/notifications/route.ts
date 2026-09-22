import { eq, and, like } from 'drizzle-orm'
import { getDb } from '@/db'
import { notificationSettings, pushSubscriptions } from '@/db/schema'
import { sendPushNotification } from '@/lib/push'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  // Full string equality — not just header presence
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()

  const utcHour = new Date().getUTCHours().toString().padStart(2, '0')

  // Find enabled users whose reminder_time starts with the current UTC hour
  const eligibleSettings = await db
    .select()
    .from(notificationSettings)
    .where(
      and(
        eq(notificationSettings.enabled, true),
        like(notificationSettings.reminderTime, `${utcHour}:%`)
      )
    )

  let sent = 0
  let staleRemoved = 0

  for (const setting of eligibleSettings) {
    const subs = await db
      .select()
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, setting.userId))

    for (const sub of subs) {
      const result = await sendPushNotification(
        { endpoint: sub.endpoint, p256dhKey: sub.p256dhKey, authKey: sub.authKey },
        'Time to stay in orbit. Check off a topic today.'
      )

      if (!result.ok && result.stale) {
        // 410 Gone — subscription is expired, remove it
        await db
          .delete(pushSubscriptions)
          .where(eq(pushSubscriptions.endpoint, sub.endpoint))
        staleRemoved++
      } else if (result.ok) {
        sent++
      }
    }
  }

  return Response.json({ sent, staleRemoved })
}
