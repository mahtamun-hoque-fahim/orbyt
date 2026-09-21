'use client'

import { Box, Typography, Stack } from '@mui/material'
import { motion } from 'framer-motion'
import { progressColor } from '@/lib/phase-colors'

interface Props {
  completedTopics: number
  totalTopics: number
  pct: number
}

export default function OverallProgressBar({ completedTopics, totalTopics, pct }: Props) {
  const color = progressColor(pct)

  return (
    <Box>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'baseline', mb: 1.5 }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Overall progress
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: '1.5rem', color }}>
            {pct}%
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {completedTopics} of {totalTopics} topics
          </Typography>
        </Stack>
      </Stack>

      <Box
        sx={{
          height: 8,
          borderRadius: '100px',
          backgroundColor: '#1e1e1e',
          overflow: 'hidden',
        }}
      >
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ height: '100%', borderRadius: '100px', backgroundColor: color }}
        />
      </Box>
    </Box>
  )
}
