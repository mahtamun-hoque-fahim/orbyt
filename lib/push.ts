import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export interface PushSubscription {
  endpoint: string
  p256dhKey: string
  authKey: string
}

export async function sendPushNotification(
  subscription: PushSubscription,
  message: string
): Promise<{ ok: true } | { ok: false; stale: boolean }> {
  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dhKey,
          auth: subscription.authKey,
        },
      },
      message
    )
    return { ok: true }
  } catch (err: unknown) {
    // 410 Gone = subscription is expired or revoked — caller must delete it
    const status = (err as { statusCode?: number }).statusCode
    if (status === 410) {
      return { ok: false, stale: true }
    }
    throw err
  }
}
