import { Box, Container, Typography } from '@mui/material'

export default function ManifestoSection() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 12, md: 16 },
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            lineHeight: 1.25,
            color: 'text.primary',
            maxWidth: 680,
          }}
        >
          Orbyt is not a course platform.
          <br />
          It is not a to-do app.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 4, maxWidth: 560, lineHeight: 1.8, fontSize: '1.05rem' }}
        >
          It is the dashboard you open alongside every tutorial. The thing
          that shows you the 23 topics you have already finished when you feel
          like you have learned nothing. Your orbit log. Your progress made
          visible.
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2.5, maxWidth: 560, lineHeight: 1.8, fontSize: '1.05rem' }}
        >
          Most developers learning via YouTube lose momentum not from inability
          but from invisible progress. Orbyt fixes that. Check off a topic,
          watch the bar move, receive a nudge when you go quiet. Small,
          consistent motion compounds into a finished developer.
        </Typography>
      </Container>
    </Box>
  )
}
