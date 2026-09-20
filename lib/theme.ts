'use client'

import { createTheme } from '@mui/material/styles'
export { PHASE_COLORS, progressColor } from './phase-colors'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0a0a0a',
      paper: '#111111',
    },
    divider: '#1e1e1e',
    text: {
      primary: '#f5f5f5',
      secondary: '#888888',
    },
    primary: {
      main: '#f5f5f5',
      contrastText: '#0a0a0a',
    },
    error: { main: '#E53935' },
    success: { main: '#43A047' },
    warning: { main: '#FF6D00' },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 },
    h2: { fontSize: '2.25rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 },
    h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.3 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    caption: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
  },
  shape: { borderRadius: 10 },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shadows: Array(25).fill('none') as any,
  components: {
    MuiCard: {
      styleOverrides: {
        root: { border: '1px solid #1e1e1e', backgroundImage: 'none', backgroundColor: '#111111' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none', backgroundColor: '#111111' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        contained: {
          backgroundColor: '#f5f5f5',
          color: '#0a0a0a',
          '&:hover': { backgroundColor: '#e0e0e0' },
        },
        outlined: {
          borderColor: '#1e1e1e',
          color: '#f5f5f5',
          '&:hover': { borderColor: '#888888', backgroundColor: 'rgba(255,255,255,0.04)' },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: { root: { backgroundColor: '#111111' } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        notchedOutline: { borderColor: '#1e1e1e' },
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#888888' },
        },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: '#1e1e1e' } },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6 },
        outlined: { borderColor: '#1e1e1e', '&:hover': { borderColor: '#888888' } },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          color: '#888888',
          '&.Mui-selected': { color: '#f5f5f5' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: { indicator: { backgroundColor: '#f5f5f5' } },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#0a0a0a',
          scrollbarColor: '#1e1e1e #0a0a0a',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: '#0a0a0a' },
          '&::-webkit-scrollbar-thumb': { background: '#1e1e1e', borderRadius: 4 },
        },
      },
    },
  },
})
