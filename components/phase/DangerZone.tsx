'use client'

import { useState, useTransition } from 'react'
import {
  Box,
  Typography,
  Button,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material'
import { ChevronDown, Trash2 } from 'lucide-react'
import { deletePhase } from '@/app/actions/phase-actions'

export default function DangerZone({
  phaseId,
  phaseName,
}: {
  phaseId: string
  phaseName: string
}) {
  const [confirming, setConfirming] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => { await deletePhase(phaseId) })
  }

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'rgba(229,57,53,0.25)',
        borderRadius: '10px !important',
        backgroundColor: 'background.paper',
        '&:before': { display: 'none' },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronDown size={16} color="#888" />}
        sx={{ px: 2.5, minHeight: 48 }}
      >
        <Typography variant="body1" sx={{ fontWeight: 600, color: '#E53935', fontSize: '0.875rem' }}>
          Danger zone
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2.5, pb: 2.5 }}>
        {!confirming ? (
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.25 }}>
                Delete this phase
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                Deletes all topics, notes, and resources. Your progress history is preserved.
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              color="error"
              startIcon={<Trash2 size={13} />}
              onClick={() => setConfirming(true)}
              sx={{ flexShrink: 0 }}
            >
              Delete phase
            </Button>
          </Stack>
        ) : (
          <Box>
            <Typography
              variant="body1"
              sx={{ mb: 2, fontSize: '0.875rem', color: '#E53935' }}
            >
              Delete {phaseName}? This cannot be undone.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                size="small"
                color="error"
                disabled={isPending}
                onClick={handleDelete}
                sx={{ backgroundColor: '#E53935', '&:hover': { backgroundColor: '#c62828' } }}
              >
                {isPending ? 'Deleting...' : 'Yes, delete it'}
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={() => setConfirming(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
