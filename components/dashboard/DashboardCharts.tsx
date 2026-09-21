'use client'

import { Box, Grid, Typography } from '@mui/material'
import { BarChart, PieChart, LineChart } from '@mui/x-charts'
import { PHASE_COLORS } from '@/lib/phase-colors'
import type { PhaseCardData } from './PhaseCard'

interface DailyPoint {
  label: string
  count: number
  cumulative: number
}

interface Props {
  phases: PhaseCardData[]
  dailyProgress: DailyPoint[]
  completedTopics: number
}

const CHART_SX = {
  '& .MuiChartsAxis-line': { stroke: '#1e1e1e' },
  '& .MuiChartsAxis-tick': { stroke: '#1e1e1e' },
  '& .MuiChartsAxis-tickLabel': { fill: '#888888', fontSize: 11 },
  '& .MuiChartsGrid-line': { stroke: '#1e1e1e' },
}

function EmptyChart({ message }: { message: string }) {
  return (
    <Box
      sx={{
        height: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: '10px',
      }}
    >
      <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem', textAlign: 'center', px: 3 }}>
        {message}
      </Typography>
    </Box>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '10px',
        backgroundColor: 'background.paper',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, fontWeight: 500 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export default function DashboardCharts({ phases, dailyProgress, completedTopics }: Props) {
  const hasPhases = phases.length > 0
  const hasActivity = completedTopics > 0
  const hasTimeData = dailyProgress.some((d) => d.count > 0)

  // Phase status counts for pie
  const notStarted = phases.filter((p) => p.status === 'not-started').length
  const inProgress = phases.filter((p) => p.status === 'in-progress').length
  const completed = phases.filter((p) => p.status === 'completed').length

  // Short phase labels for x-axis
  const phaseLabels = phases.map((_, i) => `P${i + 1}`)

  return (
    <Grid container spacing={2.5}>
      {/* Topics completed per phase — horizontal bar */}
      <Grid size={{ xs: 12, md: 7 }}>
        <ChartCard title="Topics completed per phase">
          {!hasActivity ? (
            <EmptyChart message="Check off your first topic to see this chart." />
          ) : (
            <BarChart
              layout="horizontal"
              series={[{
                data: phases.map((p) => p.completedTopics),
                color: '#C5F74F',
                label: 'Topics done',
              }]}
              yAxis={[{
                data: phases.map((p) => p.name),
                scaleType: 'band',
              }]}
              height={280}
              margin={{ left: 130, right: 20, top: 10, bottom: 30 }}
              sx={CHART_SX}
            />
          )}
        </ChartCard>
      </Grid>

      {/* Phase status breakdown — pie */}
      <Grid size={{ xs: 12, md: 5 }}>
        <ChartCard title="Phase breakdown">
          {!hasPhases ? (
            <EmptyChart message="Add your first phase to see the breakdown." />
          ) : (
            <PieChart
              series={[{
                data: [
                  { value: notStarted, label: 'Not started', color: '#2a2a2a' },
                  { value: inProgress, label: 'In progress', color: '#FF6D00' },
                  { value: completed, label: 'Completed', color: '#43A047' },
                ],
                innerRadius: 52,
                outerRadius: 95,
                paddingAngle: 3,
                cornerRadius: 4,
              }]}
              height={280}
              sx={CHART_SX}
            />
          )}
        </ChartCard>
      </Grid>

      {/* Completion % per phase — column */}
      <Grid size={{ xs: 12 }}>
        <ChartCard title="Phase completion (%)">
          {!hasActivity ? (
            <EmptyChart message="Your phase completion percentages will appear here as you check off topics." />
          ) : (
            <BarChart
              series={[{
                data: phases.map((p) => p.completionPct),
                color: '#3178C6',
                label: 'Completion %',
              }]}
              xAxis={[{
                data: phaseLabels,
                scaleType: 'band',
              }]}
              yAxis={[{ min: 0, max: 100 }]}
              height={260}
              margin={{ left: 48, right: 20, top: 10, bottom: 30 }}
              sx={{
                ...CHART_SX,
                '& .MuiBarElement-root': {
                  rx: 4,
                },
              }}
            />
          )}
        </ChartCard>
      </Grid>

      {/* Cumulative topics over time — line */}
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Cumulative topics completed">
          {!hasTimeData ? (
            <EmptyChart message="Your progress over time will appear here once you start checking off topics." />
          ) : (
            <LineChart
              series={[{
                data: dailyProgress.map((d) => d.cumulative),
                color: '#61DAFB',
                label: 'Total topics',
                showMark: false,
              }]}
              xAxis={[{
                data: dailyProgress.map((d) => d.label),
                scaleType: 'band',
                tickLabelInterval: (_, i) => i % 5 === 0,
              }]}
              height={260}
              margin={{ left: 48, right: 20, top: 10, bottom: 40 }}
              sx={CHART_SX}
            />
          )}
        </ChartCard>
      </Grid>

      {/* Daily activity — area */}
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartCard title="Daily activity (last 30 days)">
          {!hasTimeData ? (
            <EmptyChart message="Your daily check-off activity will build this chart over time." />
          ) : (
            <LineChart
              series={[{
                data: dailyProgress.map((d) => d.count),
                area: true,
                color: '#E44D26',
                label: 'Topics per day',
                showMark: false,
              }]}
              xAxis={[{
                data: dailyProgress.map((d) => d.label),
                scaleType: 'band',
                tickLabelInterval: (_, i) => i % 5 === 0,
              }]}
              height={260}
              margin={{ left: 48, right: 20, top: 10, bottom: 40 }}
              sx={CHART_SX}
            />
          )}
        </ChartCard>
      </Grid>

      {/* Phase colors legend */}
      <Grid size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
          {phases.map((phase, i) => (
            <Box key={phase.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: PHASE_COLORS[i] ?? '#888' }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.72rem' }}>
                P{i + 1} {phase.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}
