'use client'

import Link from 'next/link'
import { Box, Container, Typography, Button, Stack } from '@mui/material'

export default function CtaSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 12, md: 16 },
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#080808',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ mb: 2 }}>
          Ready to enter orbit?
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 5, maxWidth: 400 }}
        >
          Free. No credit card. Takes 30 seconds to set up.
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
            variant="text"
            size="large"
            sx={{ color: 'text.secondary', px: 2 }}
          >
            Already have an account
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
