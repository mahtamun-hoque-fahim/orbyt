import { Box, Container, Typography, Grid } from '@mui/material'
import { PHASE_COLORS } from '@/lib/phase-colors'

const phases = [
  { name: 'HTML and CSS', channel: 'Kevin Powell' },
  { name: 'Vanilla JavaScript', channel: 'Web Dev Simplified' },
  { name: 'React', channel: 'Web Dev Simplified' },
  { name: 'TypeScript', channel: 'Matt Pocock' },
  { name: 'Next.js', channel: 'Fireship' },
  { name: 'SQL and PostgreSQL', channel: 'Fireship' },
  { name: 'Drizzle ORM', channel: 'Web Dev Simplified' },
  { name: 'Deployment', channel: 'Fireship' },
]

export default function TrackPreviewSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 10, md: 14 },
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#080808',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 8 }}>
          <Typography variant="h2" sx={{ mb: 1.5 }}>
            The full-stack track
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 460 }}>
            Eight phases, mapped to the YouTube channels that teach each topic best.
            Follow the track or build your own.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {phases.map((phase, i) => (
            <Grid key={phase.name} size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '10px',
                  backgroundColor: 'background.paper',
                  borderLeftWidth: '3px',
                  borderLeftColor: PHASE_COLORS[i],
                  transition: 'border-color 0.2s ease',
                  '&:hover': {
                    borderColor: PHASE_COLORS[i],
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: PHASE_COLORS[i], display: 'block', mb: 0.75, fontWeight: 600 }}
                >
                  Phase {i + 1}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, mb: 0.5, lineHeight: 1.3 }}
                >
                  {phase.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {phase.channel}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
