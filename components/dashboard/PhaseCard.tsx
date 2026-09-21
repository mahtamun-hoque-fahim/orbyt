'use client'

import Link from 'next/link'
import { Box, Typography, Chip, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'
import { PHASE_COLORS, progressColor } from '@/lib/phase-colors'

export type PhaseStatus = 'not-started' | 'in-progress' | 'completed'

export interface PhaseCardData {
  id: string
  name: string
  slug: string
  channelName: string | null
  channelUrl: string | null
  orderIndex: number
  totalTopics: number
  completedTopics: number
  completionPct: number
  status: PhaseStatus
}

const STATUS_LABEL: Record<PhaseStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
}

const STATUS_COLOR: Record<PhaseStatus, string> = {
  'not-started': '#888888',
  'in-progress': '#FF6D00',
  completed: '#43A047',
}

export default function PhaseCard({ phase, index }: { phase: PhaseCardData; index: number }) {
  const phaseColor = PHASE_COLORS[index] ?? '#888888'
  const barColor = progressColor(phase.completionPct)
  const isActive = phase.status === 'in-progress'
  const isDone = phase.status === 'completed'

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.18 }}
    >
      <Box
        component={Link}
        href={`/phase/${phase.slug}`}
        sx={{
          display: 'block',
          textDecoration: 'none',
          p: 2.5,
          border: '1px solid',
          borderColor: isActive ? phaseColor : isDone ? '#43A04740' : 'divider',
          borderRadius: '10px',
          backgroundColor: 'background.paper',
          cursor: 'pointer',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isActive ? `0 0 20px ${phaseColor}18` : 'none',
          '&:hover': {
            borderColor: phaseColor,
            boxShadow: `0 0 20px ${phaseColor}22`,
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ color: phaseColor, fontWeight: 600, display: 'block', mb: 0.25 }}
            >
              Phase {phase.orderIndex}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {phase.name}
            </Typography>
          </Box>
          <Chip
            label={STATUS_LABEL[phase.status]}
            size="small"
            sx={{
              fontSize: '0.7rem',
              height: 22,
              borderRadius: '6px',
              border: '1px solid',
              borderColor: `${STATUS_COLOR[phase.status]}40`,
              color: STATUS_COLOR[phase.status],
              backgroundColor: `${STATUS_COLOR[phase.status]}12`,
            }}
          />
        </Stack>

        {phase.channelName && (
          <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5, mb: 2 }}>
            <ExternalLink size={11} color="#888888" />
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              {phase.channelName}
            </Typography>
          </Stack>
        )}

        <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {phase.completedTopics} of {phase.totalTopics} topics
          </Typography>
          <Typography variant="caption" sx={{ fontSize: '0.75rem', fontWeight: 600, color: barColor }}>
            {phase.completionPct}%
          </Typography>
        </Stack>

        <Box sx={{ height: 4, borderRadius: '100px', backgroundColor: '#1e1e1e', overflow: 'hidden' }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: `${phase.completionPct}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: '100%', borderRadius: '100px', backgroundColor: barColor }}
          />
        </Box>
      </Box>
    </motion.div>
  )
}
