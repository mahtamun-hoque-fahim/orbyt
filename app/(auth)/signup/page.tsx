'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Stack,
} from '@mui/material'
import { motion } from 'framer-motion'
import { signUp } from '@/lib/auth-client'

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const result = await signUp.email({
        name,
        email,
        password,
        callbackURL: '/onboarding',
      })

      if (result.error) {
        setError(result.error.message ?? 'Could not create account. Try again.')
      } else {
        router.push('/onboarding')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 400,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
          p: { xs: 3.5, sm: 5 },
        }}
      >
        <Typography
          variant="h3"
          sx={{ mb: 0.75, fontWeight: 700, letterSpacing: '-0.02em' }}
        >
          Orbyt
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Create your account. Free, no credit card.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            <TextField
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
              autoComplete="name"
              autoFocus
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              autoComplete="new-password"
              helperText="At least 8 characters"
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 1, py: 1.5 }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </Stack>
        </Box>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 3.5, textAlign: 'center', fontSize: '0.875rem' }}
        >
          Already have an account?{' '}
          <Box
            component={Link}
            href="/login"
            sx={{ color: 'text.primary', textDecoration: 'underline' }}
          >
            Sign in
          </Box>
        </Typography>
      </Box>
    </motion.div>
  )
}
