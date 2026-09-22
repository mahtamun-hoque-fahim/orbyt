'use client'

import { useState, useTransition } from 'react'
import {
  Box,
  Typography,
  Chip,
  TextField,
  Button,
  Stack,
  IconButton,
} from '@mui/material'
import { ExternalLink, Plus, X } from 'lucide-react'
import { addResourceLink, deleteResourceLink } from '@/app/actions/resource-actions'

interface ResourceLink {
  id: string
  label: string
  url: string
}

interface Props {
  links: ResourceLink[]
  phaseId: string
  phaseSlug: string
}

export default function ResourceLinks({ links, phaseId, phaseSlug }: Props) {
  const [, startTransition] = useTransition()
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')

  function handleAdd() {
    const trimLabel = label.trim()
    const trimUrl = url.trim()
    if (!trimLabel || !trimUrl) return
    setLabel('')
    setUrl('')
    setAdding(false)
    startTransition(async () => { await addResourceLink(phaseId, trimLabel, trimUrl, phaseSlug) })
  }

  function handleDelete(linkId: string) {
    startTransition(async () => { await deleteResourceLink(linkId, phaseSlug) })
  }

  return (
    <Box>
      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1.5 }}>
        Resources
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: links.length > 0 ? 1.5 : 0 }}>
        {links.map((link) => (
          <Chip
            key={link.id}
            label={link.label}
            icon={<ExternalLink size={12} />}
            onDelete={() => handleDelete(link.id)}
            deleteIcon={<X size={12} />}
            onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
            variant="outlined"
            size="small"
            sx={{
              fontSize: '0.775rem',
              cursor: 'pointer',
              '& .MuiChip-icon': { color: 'text.secondary', ml: 0.5 },
              '& .MuiChip-deleteIcon': {
                color: 'text.secondary',
                '&:hover': { color: '#E53935' },
              },
            }}
          />
        ))}
      </Box>

      {adding ? (
        <Box
          sx={{
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px',
          }}
        >
          <Stack spacing={1.5}>
            <TextField
              label="Label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              placeholder="MDN: CSS Grid"
            />
            <TextField
              label="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="small"
              fullWidth
              placeholder="https://..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            />
            <Stack direction="row" sx={{ gap: 1 }}>
              <Button
                onClick={handleAdd}
                disabled={!label.trim() || !url.trim()}
                variant="contained"
                size="small"
                sx={{ px: 2 }}
              >
                Add
              </Button>
              <IconButton
                size="small"
                onClick={() => { setAdding(false); setLabel(''); setUrl('') }}
                sx={{ color: 'text.secondary' }}
              >
                <X size={14} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Button
          onClick={() => setAdding(true)}
          startIcon={<Plus size={14} />}
          size="small"
          sx={{ color: 'text.secondary', fontSize: '0.8rem', px: 0 }}
        >
          Add resource
        </Button>
      )}
    </Box>
  )
}
