'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Box, Container, Typography, Button, Stack } from '@mui/material'
import { LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { signOut } from '@/lib/auth-client'

const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function AppNav() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  return (
    <Box
      component="header"
      sx={{
        height: 56,
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Typography
            component={Link}
            href="/dashboard"
            variant="body1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            Orbyt
          </Typography>

          <Stack direction="row" spacing={0.5}>
            {NAV_LINKS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href
              return (
                <Box
                  key={href}
                  component={Link}
                  href={href}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '0.825rem',
                    fontWeight: 500,
                    color: active ? 'text.primary' : 'text.secondary',
                    backgroundColor: active ? 'rgba(255,255,255,0.06)' : 'transparent',
                    transition: 'color 0.15s, background-color 0.15s',
                    '&:hover': {
                      color: 'text.primary',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                    },
                  }}
                >
                  <Icon size={14} />
                  {label}
                </Box>
              )
            })}
          </Stack>
        </Box>

        <Button
          onClick={handleSignOut}
          variant="text"
          size="small"
          startIcon={<LogOut size={14} />}
          sx={{
            color: 'text.secondary',
            fontSize: '0.8rem',
            '&:hover': { color: 'text.primary' },
          }}
        >
          Sign out
        </Button>
      </Container>
    </Box>
  )
}
