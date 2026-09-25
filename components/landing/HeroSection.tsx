'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Box, Container, Typography, Stack, Button, Grid } from '@mui/material'
import { motion } from 'framer-motion'

const GlobeCanvas = dynamic(() => import('@/components/globe/GlobeCanvas'), {
  ssr: false,
  loading: () => null,
})

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        minHeight: '100svh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 10, md: 8 },
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 6, md: 4 }} sx={{ alignItems: 'center' }}>

          {/* Left — text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
            >
              <Typography
                variant="h1"
                sx={{ mb: 3, lineHeight: 1.05 }}
              >
                Stay in orbit.
                <br />
                Build the web.
              </Typography>

              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 420, mb: 5, lineHeight: 1.75 }}
              >
                A learning tracker for developers following YouTube tutorials.
                Phase-based progress, daily reminders, and a dashboard that
                shows you exactly how far you have come.
              </Typography>

              <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 2 }}>
                <Button
                  component={Link}
                  href="/signup"
                  variant="contained"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '0.95rem' }}
                >
                  Start your orbit
                </Button>
                <Button
                  component={Link}
                  href="/login"
                  variant="outlined"
                  size="large"
                  sx={{ px: 4, py: 1.5, fontSize: '0.95rem' }}
                >
                  Sign in
                </Button>
              </Stack>
            </motion.div>
          </Grid>

          {/* Right — globe */}
          <Grid size={{ xs: 12, md: 6 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.0, ease: 'easeOut', delay: 0.2 }}
            >
              <Box
                sx={{
                  width: '100%',
                  aspectRatio: '1',
                  position: 'relative',
                  // Subtle lime glow behind the globe
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    height: '70%',
                    background:
                      'radial-gradient(circle, rgba(197,247,79,0.07) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 0,
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
                  <GlobeCanvas />
                </Box>
              </Box>
            </motion.div>
          </Grid>

        </Grid>
      </Container>
    </Box>
  )
}
