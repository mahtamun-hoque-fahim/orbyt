'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Typography, TextField } from '@mui/material'
import { saveNote } from '@/app/actions/note-actions'

type SaveState = 'idle' | 'saving' | 'saved'

export default function PhaseNotes({
  phaseId,
  initialContent,
}: {
  phaseId: string
  initialContent: string
}) {
  const [content, setContent] = useState(initialContent)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setContent(value)
    setSaveState('saving')

    if (timerRef.current) clearTimeout(timerRef.current)
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current)

    timerRef.current = setTimeout(async () => {
      await saveNote(phaseId, value)
      setSaveState('saved')
      savedTimerRef.current = setTimeout(() => setSaveState('idle'), 2000)
    }, 800)
  }

  const saveLabel =
    saveState === 'saving'
      ? 'Saving...'
      : saveState === 'saved'
      ? 'Saved'
      : ''

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Notes
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: saveState === 'saved' ? '#43A047' : 'text.secondary',
            fontSize: '0.75rem',
            transition: 'color 0.2s',
            minWidth: 52,
            textAlign: 'right',
          }}
        >
          {saveLabel}
        </Typography>
      </Box>
      <TextField
        multiline
        minRows={5}
        maxRows={14}
        fullWidth
        value={content}
        onChange={handleChange}
        placeholder="Jot down anything about this phase — what clicked, what to revisit, useful links..."
        sx={{
          '& .MuiOutlinedInput-root': {
            fontSize: '0.875rem',
            lineHeight: 1.7,
            fontFamily: 'inherit',
          },
        }}
      />
    </Box>
  )
}
