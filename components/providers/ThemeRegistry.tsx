'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { AnimatePresence } from 'framer-motion'
import { theme } from '@/lib/theme'

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </ThemeProvider>
    </AppRouterCacheProvider>
  )
}
