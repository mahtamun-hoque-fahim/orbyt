'use client'

import { useRouter } from 'next/navigation'
import { Box, Container, Typography, Tabs, Tab } from '@mui/material'
import NotificationsTab from './NotificationsTab'
import ProfileTab from './ProfileTab'
import TrackTab from './TrackTab'

interface Phase {
  id: string
  name: string
  slug: string
  channelName: string | null
  orderIndex: number
}

interface Props {
  activeTab: string
  user: { name: string; email: string }
  notifSettings: { enabled: boolean; localTime: string; timezone: string }
  phases: Phase[]
}

const TABS = [
  { value: 'notifications', label: 'Notifications' },
  { value: 'profile', label: 'Profile' },
  { value: 'track', label: 'Track' },
]

export default function SettingsTabs({
  activeTab,
  user,
  notifSettings,
  phases,
}: Props) {
  const router = useRouter()

  function handleTabChange(_: React.SyntheticEvent, value: string) {
    router.push(`/settings?tab=${value}`)
  }

  return (
    <Box sx={{ py: 5 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 4 }}>
          Settings
        </Typography>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            mb: 4,
            borderBottom: '1px solid',
            borderColor: 'divider',
            '& .MuiTabs-root': { minHeight: 40 },
          }}
        >
          {TABS.map((t) => (
            <Tab
              key={t.value}
              value={t.value}
              label={t.label}
              disableRipple
              sx={{ minHeight: 40, pb: 1.5 }}
            />
          ))}
        </Tabs>

        <Box sx={{ maxWidth: 560 }}>
          {activeTab === 'notifications' && (
            <NotificationsTab initialSettings={notifSettings} />
          )}
          {activeTab === 'profile' && (
            <ProfileTab initialUser={user} />
          )}
          {activeTab === 'track' && (
            <TrackTab initialPhases={phases} />
          )}
        </Box>
      </Container>
    </Box>
  )
}
