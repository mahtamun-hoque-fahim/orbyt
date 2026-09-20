import {
  pgTable,
  text,
  boolean,
  timestamp,
  varchar,
  integer,
  uuid,
  unique,
} from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// Better Auth tables (managed by Better Auth — do not rename columns)
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  // Reserved for future plan gating — do not remove
  plan: varchar('plan', { length: 20 }).notNull().default('free'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verifications = pgTable('verifications', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// ---------------------------------------------------------------------------
// Track template tables (read-only after seeding)
// ---------------------------------------------------------------------------

export const tracks = pgTable('tracks', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const templatePhases = pgTable('template_phases', {
  id: uuid('id').primaryKey().defaultRandom(),
  trackId: uuid('track_id')
    .notNull()
    .references(() => tracks.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 200 }).notNull(),
  channelName: varchar('channel_name', { length: 200 }).notNull(),
  channelUrl: varchar('channel_url', { length: 500 }).notNull(),
  playlistUrl: varchar('playlist_url', { length: 500 }).notNull(),
  orderIndex: integer('order_index').notNull(),
})

export const templateTopics = pgTable('template_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  phaseId: uuid('phase_id')
    .notNull()
    .references(() => templatePhases.id, { onDelete: 'cascade' }),
  label: varchar('label', { length: 300 }).notNull(),
  orderIndex: integer('order_index').notNull(),
})

// ---------------------------------------------------------------------------
// User data tables (mutable, per-user)
// ---------------------------------------------------------------------------

export const userPhases = pgTable(
  'user_phases',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id').notNull(),
    trackId: uuid('track_id').references(() => tracks.id, { onDelete: 'set null' }),
    name: varchar('name', { length: 200 }).notNull(),
    slug: varchar('slug', { length: 200 }).notNull(),
    channelName: varchar('channel_name', { length: 200 }),
    channelUrl: varchar('channel_url', { length: 500 }),
    playlistUrl: varchar('playlist_url', { length: 500 }),
    orderIndex: integer('order_index').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({
    // Slugs are unique per user, not globally
    userSlugUnique: unique().on(t.userId, t.slug),
  })
)

export const userTopics = pgTable('user_topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  phaseId: uuid('phase_id')
    .notNull()
    .references(() => userPhases.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull(),
  label: varchar('label', { length: 300 }).notNull(),
  completed: boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  orderIndex: integer('order_index').notNull(),
  resourceUrl: varchar('resource_url', { length: 500 }),
})

export const userResourceLinks = pgTable('user_resource_links', {
  id: uuid('id').primaryKey().defaultRandom(),
  phaseId: uuid('phase_id')
    .notNull()
    .references(() => userPhases.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull(),
  label: varchar('label', { length: 200 }).notNull(),
  url: varchar('url', { length: 500 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const phaseNotes = pgTable(
  'phase_notes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    phaseId: uuid('phase_id')
      .notNull()
      .references(() => userPhases.id, { onDelete: 'cascade' }),
    userId: varchar('user_id').notNull(),
    content: text('content').notNull().default(''),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({
    // One note document per phase
    phaseNoteUnique: unique().on(t.phaseId),
  })
)

export const notificationSettings = pgTable(
  'notification_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: varchar('user_id').notNull(),
    enabled: boolean('enabled').notNull().default(false),
    // HH:MM format, stored in UTC — convert from user timezone before saving
    reminderTime: varchar('reminder_time', { length: 5 }),
    timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (t) => ({
    userUnique: unique().on(t.userId),
  })
)

export const pushSubscriptions = pgTable('push_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(),
  endpoint: text('endpoint').notNull().unique(),
  p256dhKey: text('p256dh_key').notNull(),
  authKey: text('auth_key').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

/**
 * INSERT-ONLY — never delete rows from this table.
 * This is the append-only progress ledger that powers the line and area charts.
 * Deleting rows silently corrupts every user's chart data with no recovery path.
 * There is no DELETE route, no cascade delete, no drizzle shortcut for this table.
 */
export const progressLog = pgTable('progress_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: varchar('user_id').notNull(),
  topicId: uuid('topic_id')
    .notNull()
    .references(() => userTopics.id),
  loggedAt: timestamp('logged_at').notNull().defaultNow(),
})
