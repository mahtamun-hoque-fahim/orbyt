'use client'

import { Box, Grid, Typography, Button } from '@mui/material'
import Link from 'next/link'
import { motion, type Variants } from 'framer-motion'
import PhaseCard, { type PhaseCardData } from './PhaseCard'

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function PhaseCardsGrid({ phases }: { phases: PhaseCardData[] }) {
  if (phases.length === 0) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: 'center',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
        }}
      >
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          You have no phases yet. Add your first phase to start tracking.
        </Typography>
        <Button component={Link} href="/settings?tab=track" variant="outlined" size="large">
          Go to Settings
        </Button>
      </Box>
    )
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <Grid container spacing={2}>
        {phases.map((phase, i) => (
          <Grid key={phase.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <motion.div variants={item}>
              <PhaseCard phase={phase} index={i} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  )
}
