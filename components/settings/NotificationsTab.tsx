'use client'

import { useState, useTransition } from 'react'
import {
  Box,
  Typography,
  Switch,
  TextField,
  MenuItem,
  Button,
  Alert,
  Stack,
  Divider,
} from '@mui/material'
import {
  saveNotificationSettings,
  savePushSubscriptionAction,
} from '@/app/actions/settings-actions'

const TIMEZONES = [
  'UTC',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Sao_Paulo',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Moscow',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Asia/Seoul',
  'Australia/Sydney',
  'Pacific/Auckland',
]

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const output = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i)
  }
  return output
}

interface Props {
  initialSettings: { enabled: boolean; localTime: string; timezone: string }
}

export default function NotificationsTab({ initialSettings }: Props) {
  const [enabled, setEnabled] = useState(initialSettings.enabled)
  const [time, setTime] = useState(initialSettings.localTime)
  const [timezone, setTimezone] = useState(initialSettings.timezone)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleToggle(checked: boolean) {
    setEnabled(checked)
    setError(null)

    if (checked) {
      if (!('Notification' in window)) {
        setError('Push notifications are not supported in this browser.')
        setEnabled(false)
        return
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setError('Notification permission was denied. Enable it in your browser settings.')
        setEnabled(false)
        return
      }

      try {
        const registration = await navigator.serviceWorker.register('/sw.js')
        await navigator.serviceWorker.ready

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY
        if (!vapidKey) {
          setError('Push notifications are not configured yet.')
          setEnabled(false)
          return
        }

        const sub = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        })

        const p256dh = btoa(
          String.fromCharCode(...new Uint8Array(sub.getKey('p256dh')!))
        )
        const auth = btoa(
          String.fromCharCode(...new Uint8Array(sub.getKey('auth')!))
        )

        await savePushSubscriptionAction(sub.endpoint, p256dh, auth)
      } catch {
        setError('Could not subscribe to push notifications. Try again.')
        setEnabled(false)
        return
      }
    }
  }

  function handleSave() {
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await saveNotificationSettings(enabled, time, timezone)
      if ('error' in result) {
        setError(String(result.error))
      } else {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
      }
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Notifications
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Get a daily reminder to check off a topic and stay in orbit.
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ borderRadius: '8px' }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ borderRadius: '8px' }}>Settings saved.</Alert>}

      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '0.9rem' }}>
            Daily reminder
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Sends once per day if you have not checked off a topic
          </Typography>
        </Box>
        <Switch
          checked={enabled}
          onChange={(_, checked) => handleToggle(checked)}
          sx={{
            '& .MuiSwitch-switchBase.Mui-checked': { color: '#C5F74F' },
            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
              backgroundColor: '#C5F74F',
            },
          }}
        />
      </Stack>

      <Divider />

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2.5,
          opacity: enabled ? 1 : 0.4,
          pointerEvents: enabled ? 'auto' : 'none',
          transition: 'opacity 0.2s',
        }}
      >
        <TextField
          label="Reminder time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          size="small"
          fullWidth
          slotProps={{ inputLabel: { shrink: true }, htmlInput: { step: 300 } }}
        />

        <TextField
          label="Timezone"
          select
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          size="small"
          fullWidth
        >
          {TIMEZONES.map((tz) => (
            <MenuItem key={tz} value={tz}>
              {tz.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isPending}
        sx={{ alignSelf: 'flex-start', px: 3 }}
      >
        {isPending ? 'Saving...' : 'Save settings'}
      </Button>
    </Box>
  )
}
