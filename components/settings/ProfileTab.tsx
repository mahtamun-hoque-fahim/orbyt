'use client'

import { useState, useTransition } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Divider,
  Stack,
} from '@mui/material'
import { updateProfile, changePassword } from '@/app/actions/settings-actions'

interface Props {
  initialUser: { name: string; email: string }
}

export default function ProfileTab({ initialUser }: Props) {
  const [name, setName] = useState(initialUser.name)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [nameError, setNameError] = useState<string | null>(null)
  const [isPendingName, startNameTransition] = useTransition()

  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [isPendingPw, startPwTransition] = useTransition()

  function handleSaveName() {
    setNameError(null)
    setNameSuccess(false)
    startNameTransition(async () => {
      const result = await updateProfile(name)
      if ('error' in result) {
        setNameError(String(result.error))
      } else {
        setNameSuccess(true)
        setTimeout(() => setNameSuccess(false), 3000)
      }
    })
  }

  function handleChangePassword() {
    setPwError(null)
    setPwSuccess(false)
    startPwTransition(async () => {
      const result = await changePassword(currentPw, newPw)
      if ('error' in result) {
        setPwError(String(result.error))
      } else {
        setPwSuccess(true)
        setCurrentPw('')
        setNewPw('')
        setTimeout(() => setPwSuccess(false), 3000)
      }
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {/* Display name */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Display name
          </Typography>
        </Box>

        {nameError && <Alert severity="error" sx={{ borderRadius: '8px' }}>{nameError}</Alert>}
        {nameSuccess && <Alert severity="success" sx={{ borderRadius: '8px' }}>Name updated.</Alert>}

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          size="small"
          fullWidth
          onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName() }}
        />
        <TextField
          label="Email"
          value={initialUser.email}
          size="small"
          fullWidth
          disabled
          helperText="Email cannot be changed"
        />
        <Button
          variant="contained"
          onClick={handleSaveName}
          disabled={isPendingName || !name.trim()}
          sx={{ alignSelf: 'flex-start', px: 3 }}
        >
          {isPendingName ? 'Saving...' : 'Save name'}
        </Button>
      </Box>

      <Divider />

      {/* Change password */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
            Change password
          </Typography>
        </Box>

        {pwError && <Alert severity="error" sx={{ borderRadius: '8px' }}>{pwError}</Alert>}
        {pwSuccess && <Alert severity="success" sx={{ borderRadius: '8px' }}>Password updated.</Alert>}

        <Stack spacing={2}>
          <TextField
            label="Current password"
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            size="small"
            fullWidth
            autoComplete="current-password"
          />
          <TextField
            label="New password"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            size="small"
            fullWidth
            autoComplete="new-password"
            helperText="At least 8 characters"
            onKeyDown={(e) => { if (e.key === 'Enter') handleChangePassword() }}
          />
        </Stack>

        <Button
          variant="contained"
          onClick={handleChangePassword}
          disabled={isPendingPw || !currentPw || newPw.length < 8}
          sx={{ alignSelf: 'flex-start', px: 3 }}
        >
          {isPendingPw ? 'Updating...' : 'Update password'}
        </Button>
      </Box>
    </Box>
  )
}
