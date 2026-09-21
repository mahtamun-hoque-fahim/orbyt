import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq, and, gte } from 'drizzle-orm'
import { Box, Container, Typography, Divider } from '@mui/material'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import { userPhases, userTopics, progressLog } from '@/db/schema'
import OverallProgressBar from '@/components/dashboard/OverallProgressBar'
import DashboardCharts from '@/components/dashboard/DashboardCharts'
import PhaseCardsGrid from '@/components/dashboard/PhaseCardsGrid'
import type { PhaseCardData, PhaseStatus } from '@/components/dashboard/PhaseCard'

export const dynamic = 'force-dynamic'

function buildDailyProgress(logs: { loggedAt: Date }[]) {
  // Last 30 days
  const days: { date: string; label: string }[] = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      date: d.toISOString().split('T')[0],
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
  }

  const logsByDate = new Map<string, number>()
  logs.forEach((log) => {
    const date = new Date(log.loggedAt).toISOString().split('T')[0]
    logsByDate.set(date, (logsByDate.get(date) ?? 0) + 1)
  })

  let cumulative = 0
  return days.map((day) => {
    const count = logsByDate.get(day.date) ?? 0
    cumulative += count
    return { label: day.label, count, cumulative }
  })
}

export default async function DashboardPage() {
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const userId = session.user.id
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

  const [phases, topics, logs] = await Promise.all([
    db
      .select()
      .from(userPhases)
      .where(eq(userPhases.userId, userId))
      .orderBy(userPhases.orderIndex),
    db
      .select()
      .from(userTopics)
      .where(eq(userTopics.userId, userId)),
    db
      .select({ loggedAt: progressLog.loggedAt })
      .from(progressLog)
      .where(
        and(
          eq(progressLog.userId, userId),
          gte(progressLog.loggedAt, thirtyDaysAgo)
        )
      )
      .orderBy(progressLog.loggedAt),
  ])

  // Compute per-phase stats
  const phaseStats: PhaseCardData[] = phases.map((phase) => {
    const phaseTopics = topics.filter((t) => t.phaseId === phase.id)
    const completedCount = phaseTopics.filter((t) => t.completed).length
    const total = phaseTopics.length
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0
    const status: PhaseStatus =
      completedCount === 0
        ? 'not-started'
        : completedCount === total && total > 0
        ? 'completed'
        : 'in-progress'

    return {
      id: phase.id,
      name: phase.name,
      slug: phase.slug,
      channelName: phase.channelName ?? null,
      channelUrl: phase.channelUrl ?? null,
      orderIndex: phase.orderIndex,
      totalTopics: total,
      completedTopics: completedCount,
      completionPct: pct,
      status,
    }
  })

  const totalTopics = topics.length
  const completedTopics = topics.filter((t) => t.completed).length
  const overallPct =
    totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  const dailyProgress = buildDailyProgress(logs)

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="h2" sx={{ mb: 0.5 }}>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Typography>
        </Box>

        {/* Overall progress */}
        <Box sx={{ mb: 5 }}>
          <OverallProgressBar
            completedTopics={completedTopics}
            totalTopics={totalTopics}
            pct={overallPct}
          />
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* Charts */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
            Analytics
          </Typography>
          <DashboardCharts
            phases={phaseStats}
            dailyProgress={dailyProgress}
            completedTopics={completedTopics}
          />
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* Phase cards */}
        <Box>
          <Typography variant="h3" sx={{ mb: 3, fontSize: '1.1rem', fontWeight: 600 }}>
            Your track
          </Typography>
          <PhaseCardsGrid phases={phaseStats} />
        </Box>
      </Container>
    </Box>
  )
}
