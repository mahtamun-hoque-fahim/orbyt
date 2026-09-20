'use client'

import { useTransition } from 'react'
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Chip,
  CircularProgress,
} from '@mui/material'
import { Map, Pencil } from 'lucide-react'
import { motion } from 'framer-motion'
import { PHASE_COLORS } from '@/lib/phase-colors'
import { selectTrack, selectCustomTrack } from '@/app/actions/onboarding-actions'

interface Phase {
  id: string
  name: string
  channelName: string
  orderIndex: number
}

interface Props {
  webDevTrackId: string | null
  webDevPhases: Phase[]
  userName: string
}

export default function TrackSelector({
  webDevTrackId,
  webDevPhases,
  userName,
}: Props) {
  const [isPendingTrack, startTrack] = useTransition()
  const [isPendingCustom, startCustom] = useTransition()

  function handleSelectTrack() {
    if (!webDevTrackId) return
    startTrack(() => selectTrack(webDevTrackId))
  }

  function handleSelectCustom() {
    startCustom(() => selectCustomTrack())
  }

  const firstName = userName.split(' ')[0]

  return (
    <Box
      sx={{
        minHeight: '100svh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: 8,
      }}
    >
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h2"
              sx={{ mb: 1.5 }}
            >
              {firstName ? `Welcome, ${firstName}.` : 'Welcome.'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 460 }}>
              Choose how you want to track your progress. You can adjust everything
              from settings later.
            </Typography>
          </Box>

          <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            {/* Full-Stack Track */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 3.5,
                  border: '1px solid',
                  borderColor: '#C5F74F33',
                  borderRadius: '10px',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 0 32px #C5F74F0a',
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Map size={18} color="#C5F74F" />
                    <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>
                      Full-Stack Web Development
                    </Typography>
                    <Chip
                      label="Recommended"
                      size="small"
                      sx={{
                        ml: 'auto',
                        fontSize: '0.7rem',
                        height: 22,
                        backgroundColor: '#C5F74F18',
                        color: '#C5F74F',
                        border: '1px solid #C5F74F33',
                        borderRadius: '6px',
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    HTML to deployment. Eight phases mapped to the best YouTube channels,
                    with{' '}
                    {webDevPhases.reduce((acc) => acc, 0) || 80} topics ready to check off.
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    flex: 1,
                  }}
                >
                  {webDevPhases.map((phase, i) => (
                    <Box
                      key={phase.id}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        py: 0.5,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: PHASE_COLORS[i] ?? '#888888',
                          flexShrink: 0,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        {phase.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 'auto', opacity: 0.5, fontSize: '0.75rem' }}
                      >
                        {phase.channelName}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleSelectTrack}
                  disabled={isPendingTrack || isPendingCustom || !webDevTrackId}
                  sx={{ py: 1.5 }}
                  startIcon={
                    isPendingTrack ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : undefined
                  }
                >
                  {isPendingTrack ? 'Setting up your track...' : 'Start with this track'}
                </Button>
              </Box>
            </Grid>

            {/* Custom Track */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  height: '100%',
                  p: 3.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  backgroundColor: 'background.paper',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Pencil size={18} color="#888888" />
                    <Typography variant="h3" sx={{ fontSize: '1.1rem' }}>
                      Custom track
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    Start with a blank canvas. Define your own phases, add topics, and
                    build the track that fits how you actually learn.
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    flex: 1,
                    fontSize: '0.8rem',
                    lineHeight: 1.7,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '8px',
                    display: 'block',
                  }}
                >
                  You will start with an empty dashboard. Add your first phase from
                  Settings once you are in.
                </Typography>

                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={handleSelectCustom}
                  disabled={isPendingTrack || isPendingCustom}
                  sx={{ py: 1.5 }}
                  startIcon={
                    isPendingCustom ? (
                      <CircularProgress size={16} sx={{ color: 'inherit' }} />
                    ) : undefined
                  }
                >
                  {isPendingCustom ? 'Getting ready...' : 'Start from scratch'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  )
}
