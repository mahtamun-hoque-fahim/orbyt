import { notFound, redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { eq, and } from 'drizzle-orm'
import Link from 'next/link'
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  Divider,
  Button,
} from '@mui/material'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getAuth } from '@/lib/auth'
import { getDb } from '@/db'
import {
  userPhases,
  userTopics,
  phaseNotes,
  userResourceLinks,
} from '@/db/schema'
import { PHASE_COLORS, progressColor } from '@/lib/phase-colors'
import OverallProgressBar from '@/components/dashboard/OverallProgressBar'
import TopicList from '@/components/phase/TopicList'
import PhaseNotes from '@/components/phase/PhaseNotes'
import ResourceLinks from '@/components/phase/ResourceLinks'
import DangerZone from '@/components/phase/DangerZone'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PhasePage({ params }: Props) {
  const { slug } = await params
  const session = await getAuth().api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const db = getDb()
  const userId = session.user.id

  // Resolve slug scoped to this user
  const [phase] = await db
    .select()
    .from(userPhases)
    .where(and(eq(userPhases.slug, slug), eq(userPhases.userId, userId)))
    .limit(1)

  if (!phase) notFound()

  const [topics, noteRecord, resourceLinks, allUserPhases] = await Promise.all([
    db
      .select()
      .from(userTopics)
      .where(eq(userTopics.phaseId, phase.id))
      .orderBy(userTopics.orderIndex),
    db
      .select()
      .from(phaseNotes)
      .where(eq(phaseNotes.phaseId, phase.id))
      .limit(1),
    db
      .select()
      .from(userResourceLinks)
      .where(eq(userResourceLinks.phaseId, phase.id))
      .orderBy(userResourceLinks.createdAt),
    db
      .select({ id: userPhases.id })
      .from(userPhases)
      .where(eq(userPhases.userId, userId)),
  ])

  const completedTopics = topics.filter((t) => t.completed).length
  const totalTopics = topics.length
  const pct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

  // Phase index for color lookup (0-based)
  const allPhases = await db
    .select({ id: userPhases.id, orderIndex: userPhases.orderIndex })
    .from(userPhases)
    .where(eq(userPhases.userId, userId))
    .orderBy(userPhases.orderIndex)
  const phaseIndex = allPhases.findIndex((p) => p.id === phase.id)
  const phaseColor = PHASE_COLORS[phaseIndex] ?? '#888888'

  const status =
    completedTopics === 0
      ? 'not-started'
      : completedTopics === totalTopics && totalTopics > 0
      ? 'completed'
      : 'in-progress'

  const STATUS_LABEL = {
    'not-started': 'Not started',
    'in-progress': 'In progress',
    completed: 'Completed',
  }
  const STATUS_COLOR = {
    'not-started': '#888888',
    'in-progress': '#FF6D00',
    completed: '#43A047',
  }

  const noteContent = noteRecord[0]?.content ?? ''

  const topicData = topics.map((t) => ({
    id: t.id,
    label: t.label,
    completed: t.completed,
    orderIndex: t.orderIndex,
  }))

  const linkData = resourceLinks.map((l) => ({
    id: l.id,
    label: l.label,
    url: l.url,
  }))

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        {/* Back */}
        <Button
          component={Link}
          href="/dashboard"
          startIcon={<ArrowLeft size={15} />}
          sx={{ color: 'text.secondary', mb: 3, px: 0, fontSize: '0.825rem' }}
        >
          Dashboard
        </Button>

        {/* Phase header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
            <Typography variant="h2">{phase.name}</Typography>
            <Chip
              label={STATUS_LABEL[status]}
              size="small"
              sx={{
                fontSize: '0.72rem',
                height: 22,
                borderRadius: '6px',
                border: '1px solid',
                borderColor: `${STATUS_COLOR[status]}40`,
                color: STATUS_COLOR[status],
                backgroundColor: `${STATUS_COLOR[status]}12`,
              }}
            />
          </Box>

          {phase.channelName && phase.channelUrl && (
            <Box
              component="a"
              href={phase.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                color: 'text.secondary',
                textDecoration: 'none',
                fontSize: '0.825rem',
                '&:hover': { color: phaseColor },
                transition: 'color 0.15s',
              }}
            >
              <ExternalLink size={13} />
              {phase.channelName}
            </Box>
          )}
        </Box>

        {/* Progress bar */}
        <Box sx={{ mb: 5 }}>
          <OverallProgressBar
            completedTopics={completedTopics}
            totalTopics={totalTopics}
            pct={pct}
          />
        </Box>

        <Divider sx={{ mb: 5 }} />

        {/* Main content grid */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {/* Topics — left column */}
          <Grid size={{ xs: 12, md: 8 }}>
            <TopicList
              topics={topicData}
              phaseId={phase.id}
              phaseSlug={slug}
              phaseColor={phaseColor}
            />
          </Grid>

          {/* Notes + Resources — right column */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <PhaseNotes phaseId={phase.id} initialContent={noteContent} />
              <ResourceLinks
                links={linkData}
                phaseId={phase.id}
                phaseSlug={slug}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4 }} />

        {/* Danger zone */}
        <DangerZone phaseId={phase.id} phaseName={phase.name} />
      </Container>
    </Box>
  )
}
