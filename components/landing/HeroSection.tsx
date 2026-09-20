'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Box, Container, Typography, Stack, Button } from '@mui/material'
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
        position: 'relative',
        minHeight: '100svh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Globe background */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70%',
          pointerEvents: 'none',
        }}
      >
        <GlobeCanvas />
      </Box>

      {/* Bottom fade — blends globe into page */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to bottom, transparent, #0a0a0a)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: 16, pb: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
        >
          <Typography
            variant="h1"
            sx={{
              maxWidth: 600,
              mb: 3,
              lineHeight: 1.05,
            }}
          >
            Stay in orbit.
            <br />
            Build the web.
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: 440, mb: 5, lineHeight: 1.7 }}
          >
            A learning tracker for developers following YouTube tutorials.
            Phase-based progress, daily reminders, and a dashboard that
            shows you exactly how far you have come.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap", gap: 2 }}>
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
      </Container>
    </Box>
  )
}
