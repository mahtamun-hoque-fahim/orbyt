'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { eq, and } from 'drizzle-orm'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import {
  notificationSettings,
  pushSubscriptions,
  userPhases,
} from '@/db/schema'
import { toUtcTime } from '@/lib/utils'

async function getSession() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')
  return session
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function updateProfile(name: string) {
  const session = await getSession()
  if (!name.trim()) return { error: 'Name cannot be empty' }

  await getAuth().api.updateUser({
    body: { name: name.trim() },
    headers: await headers(),
  })

  revalidatePath('/settings')
  return { success: true }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters' }
  }

  const result = await getAuth().api.changePassword({
    body: { currentPassword, newPassword, revokeOtherSessions: false },
    headers: await headers(),
  })

  if (result && 'error' in result && result.error) {
    return { error: 'Current password is incorrect' }
  }

  return { success: true }
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function saveNotificationSettings(
  enabled: boolean,
  localTime: string,
  timezone: string
) {
  const session = await getSession()
  const db = getDb()
  const userId = session.user.id

  const utcTime = localTime ? toUtcTime(localTime, timezone) : null

  await db
    .insert(notificationSettings)
    .values({
      userId,
      enabled,
      reminderTime: utcTime,
      timezone,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: notificationSettings.userId,
      set: { enabled, reminderTime: utcTime, timezone, updatedAt: new Date() },
    })

  revalidatePath('/settings')
  return { success: true }
}

export async function savePushSubscriptionAction(
  endpoint: string,
  p256dhKey: string,
  authKey: string
) {
  const session = await getSession()
  const db = getDb()

  await db
    .insert(pushSubscriptions)
    .values({ userId: session.user.id, endpoint, p256dhKey, authKey })
    .onConflictDoUpdate({
      target: pushSubscriptions.endpoint,
      set: { userId: session.user.id, p256dhKey, authKey },
    })

  return { success: true }
}

// ---------------------------------------------------------------------------
// Track tab — phase management
// ---------------------------------------------------------------------------

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    || 'phase'
}

export async function addCustomPhase(data: {
  name: string
  channelName?: string
  channelUrl?: string
  playlistUrl?: string
}) {
  const session = await getSession()
  const db = getDb()
  const userId = session.user.id

  if (!data.name.trim()) return { error: 'Phase name is required' }

  const existing = await db
    .select({ slug: userPhases.slug, orderIndex: userPhases.orderIndex })
    .from(userPhases)
    .where(eq(userPhases.userId, userId))

  const baseSlug = slugify(data.name)
  let slug = baseSlug
  let counter = 1
  while (existing.some((p) => p.slug === slug)) {
    slug = `${baseSlug}-${counter++}`
  }

  const nextIndex =
    existing.length > 0
      ? Math.max(...existing.map((p) => p.orderIndex)) + 1
      : 1

  await db.insert(userPhases).values({
    userId,
    name: data.name.trim(),
    slug,
    channelName: data.channelName?.trim() || null,
    channelUrl: data.channelUrl?.trim() || null,
    playlistUrl: data.playlistUrl?.trim() || null,
    orderIndex: nextIndex,
  })

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function updatePhaseName(phaseId: string, name: string) {
  const session = await getSession()
  const db = getDb()

  const [phase] = await db
    .select({ id: userPhases.id })
    .from(userPhases)
    .where(and(eq(userPhases.id, phaseId), eq(userPhases.userId, session.user.id)))
    .limit(1)

  if (!phase) return { error: 'Not found' }
  if (!name.trim()) return { error: 'Name cannot be empty' }

  await db
    .update(userPhases)
    .set({ name: name.trim() })
    .where(eq(userPhases.id, phaseId))

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function reorderPhase(
  phaseId: string,
  direction: 'up' | 'down'
) {
  const session = await getSession()
  const db = getDb()
  const userId = session.user.id

  const phases = await db
    .select()
    .from(userPhases)
    .where(eq(userPhases.userId, userId))
    .orderBy(userPhases.orderIndex)

  const idx = phases.findIndex((p) => p.id === phaseId)
  const swapIdx = direction === 'up' ? idx - 1 : idx + 1

  if (idx < 0 || swapIdx < 0 || swapIdx >= phases.length) return { error: 'Invalid' }

  const a = phases[idx]
  const b = phases[swapIdx]

  await db
    .update(userPhases)
    .set({ orderIndex: b.orderIndex })
    .where(eq(userPhases.id, a.id))

  await db
    .update(userPhases)
    .set({ orderIndex: a.orderIndex })
    .where(eq(userPhases.id, b.id))

  revalidatePath('/settings')
  revalidatePath('/dashboard')
  return { success: true }
}
