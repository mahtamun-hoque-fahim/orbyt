import { Box, Container, Typography, Grid } from '@mui/material'
import { BookOpen, SquareCheck, Bell } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: BookOpen,
    title: 'Pick your track',
    body: 'Start with the curated Full-Stack Web Dev track, mapped to the best YouTube channels — from HTML to deployment.',
  },
  {
    number: '2',
    icon: SquareCheck,
    title: 'Check off topics',
    body: 'As you finish each tutorial, check off the topic. Watch your phase progress fill in real time.',
  },
  {
    number: '3',
    icon: Bell,
    title: 'Stay in orbit',
    body: 'Set a daily reminder. If you have gone quiet, Orbyt nudges you back. Small, consistent motion is how you ship.',
  },
]

export default function HowItWorksSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{ mb: 8, maxWidth: 400 }}
        >
          How it works
        </Typography>

        <Grid container spacing={6}>
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    <Icon size={18} />
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: 'block', mb: 0.5 }}
                    >
                      {step.number}
                    </Typography>
                    <Typography variant="h3" sx={{ mb: 1.5, fontSize: '1.15rem' }}>
                      {step.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {step.body}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )
          })}
        </Grid>
      </Container>
    </Box>
  )
}
