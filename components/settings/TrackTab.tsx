'use client'

import { useState, useTransition, useRef, type KeyboardEvent } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
} from '@mui/material'
import {
  GripVertical,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  Check,
  X,
  Plus,
} from 'lucide-react'
import { deletePhase } from '@/app/actions/phase-actions'
import {
  addCustomPhase,
  updatePhaseName,
  reorderPhase,
} from '@/app/actions/settings-actions'

interface Phase {
  id: string
  name: string
  slug: string
  channelName: string | null
  orderIndex: number
}

interface Props {
  initialPhases: Phase[]
}

function PhaseRow({
  phase,
  isFirst,
  isLast,
  onRename,
  onReorder,
  onDelete,
}: {
  phase: Phase
  isFirst: boolean
  isLast: boolean
  onRename: (id: string, name: string) => void
  onReorder: (id: string, dir: 'up' | 'down') => void
  onDelete: (id: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(phase.name)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditing(true)
    setEditValue(phase.name)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commitEdit() {
    if (editValue.trim() && editValue.trim() !== phase.name) {
      onRename(phase.id, editValue.trim())
    }
    setEditing(false)
  }

  function handleKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <Box
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 1.25,
        px: 1.5,
        borderRadius: '8px',
        backgroundColor: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        transition: 'background-color 0.15s',
        minHeight: 48,
      }}
    >
      <GripVertical size={14} color="#444" style={{ flexShrink: 0, cursor: 'grab' }} />

      {editing ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            inputRef={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKey}
            size="small"
            fullWidth
            sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem', py: 0.5 } }}
          />
          <IconButton size="small" onClick={commitEdit} sx={{ color: '#C5F74F' }}>
            <Check size={14} />
          </IconButton>
          <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: 'text.secondary' }}>
            <X size={14} />
          </IconButton>
        </Box>
      ) : (
        <>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
              {phase.name}
            </Typography>
            {phase.channelName && (
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                {phase.channelName}
              </Typography>
            )}
          </Box>

          {hovered && (
            <Stack direction="row" sx={{ gap: 0.25 }}>
              <IconButton
                size="small"
                disabled={isFirst}
                onClick={() => onReorder(phase.id, 'up')}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <ChevronUp size={14} />
              </IconButton>
              <IconButton
                size="small"
                disabled={isLast}
                onClick={() => onReorder(phase.id, 'down')}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <ChevronDown size={14} />
              </IconButton>
              <IconButton
                size="small"
                onClick={startEdit}
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                <Pencil size={13} />
              </IconButton>
              <IconButton
                size="small"
                onClick={() => onDelete(phase.id)}
                sx={{ color: 'text.secondary', '&:hover': { color: '#E53935' } }}
              >
                <Trash2 size={13} />
              </IconButton>
            </Stack>
          )}
        </>
      )}
    </Box>
  )
}

export default function TrackTab({ initialPhases }: Props) {
  const [, startTransition] = useTransition()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newChannel, setNewChannel] = useState('')
  const [newChannelUrl, setNewChannelUrl] = useState('')
  const [addError, setAddError] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)

  function handleRename(id: string, name: string) {
    startTransition(async () => { await updatePhaseName(id, name) })
  }

  function handleReorder(id: string, dir: 'up' | 'down') {
    startTransition(async () => { await reorderPhase(id, dir) })
  }

  function handleDelete(id: string) {
    startTransition(async () => { await deletePhase(id) })
  }

  async function handleAdd() {
    if (!newName.trim()) return
    setAdding(true)
    setAddError(null)
    const result = await addCustomPhase({
      name: newName,
      channelName: newChannel || undefined,
      channelUrl: newChannelUrl || undefined,
    })
    setAdding(false)
    if ('error' in result) {
      setAddError(String(result.error))
    } else {
      setDialogOpen(false)
      setNewName('')
      setNewChannel('')
      setNewChannelUrl('')
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Your track
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Rename or reorder phases. Deleting a phase removes its topics and notes.
        </Typography>
      </Box>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {initialPhases.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              No phases yet. Add your first one below.
            </Typography>
          </Box>
        ) : (
          initialPhases.map((phase, i) => (
            <Box key={phase.id}>
              <PhaseRow
                phase={phase}
                isFirst={i === 0}
                isLast={i === initialPhases.length - 1}
                onRename={handleRename}
                onReorder={handleReorder}
                onDelete={handleDelete}
              />
              {i < initialPhases.length - 1 && <Divider />}
            </Box>
          ))
        )}

        <Divider />
        <Box sx={{ p: 1.5 }}>
          <Button
            startIcon={<Plus size={14} />}
            size="small"
            onClick={() => setDialogOpen(true)}
            sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
          >
            Add phase
          </Button>
        </Box>
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: '10px',
              width: '100%',
              maxWidth: 440,
            },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', pb: 1 }}>
          Add a phase
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {addError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: '8px' }}>{addError}</Alert>
          )}
          <Stack spacing={2}>
            <TextField
              label="Phase name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              placeholder="React"
            />
            <TextField
              label="Channel name (optional)"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              size="small"
              fullWidth
              placeholder="Web Dev Simplified"
            />
            <TextField
              label="Channel URL (optional)"
              value={newChannelUrl}
              onChange={(e) => setNewChannelUrl(e.target.value)}
              size="small"
              fullWidth
              placeholder="https://youtube.com/..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={() => setDialogOpen(false)}
            variant="outlined"
            size="small"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            size="small"
            disabled={!newName.trim() || adding}
          >
            {adding ? 'Adding...' : 'Add phase'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
