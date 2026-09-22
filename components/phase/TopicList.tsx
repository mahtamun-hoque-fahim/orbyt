'use client'

import {
  useState,
  useTransition,
  useOptimistic,
  useRef,
  type KeyboardEvent,
} from 'react'
import {
  Box,
  Typography,
  Stack,
  TextField,
  Button,
  IconButton,
} from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Pencil, Trash2, Check, X, Plus } from 'lucide-react'
import {
  toggleTopic,
  addTopic,
  updateTopic,
  deleteTopic,
} from '@/app/actions/topic-actions'

interface Topic {
  id: string
  label: string
  completed: boolean
  orderIndex: number
}

interface Props {
  topics: Topic[]
  phaseId: string
  phaseSlug: string
  phaseColor: string
}

function AnimatedCheckbox({
  completed,
  color,
}: {
  completed: boolean
  color: string
}) {
  return (
    <Box sx={{ width: 20, height: 20, flexShrink: 0, cursor: 'pointer' }}>
      <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
        <rect
          x="1.5"
          y="1.5"
          width="17"
          height="17"
          rx="4"
          stroke={completed ? color : '#444'}
          strokeWidth="1.5"
          fill={completed ? `${color}20` : 'transparent'}
          style={{ transition: 'all 0.2s' }}
        />
        <AnimatePresence>
          {completed && (
            <motion.path
              key="check"
              d="M5.5 10l3 3 6-6"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>
      </svg>
    </Box>
  )
}

function TopicItem({
  topic,
  phaseSlug,
  phaseColor,
  onToggle,
  onDelete,
  onUpdate,
}: {
  topic: Topic
  phaseSlug: string
  phaseColor: string
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, label: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(topic.label)
  const [hovered, setHovered] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditing(true)
    setEditValue(topic.label)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commitEdit() {
    if (editValue.trim() && editValue.trim() !== topic.label) {
      onUpdate(topic.id, editValue.trim())
    }
    setEditing(false)
  }

  function handleEditKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') commitEdit()
    if (e.key === 'Escape') setEditing(false)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.22 }}
    >
      <Box
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 1,
          px: 1.5,
          borderRadius: '8px',
          transition: 'background-color 0.15s',
          backgroundColor: hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
          minHeight: 44,
        }}
      >
        <Box onClick={() => onToggle(topic.id, topic.completed)} sx={{ display: 'flex' }}>
          <AnimatedCheckbox completed={topic.completed} color={phaseColor} />
        </Box>

        {editing ? (
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <TextField
              inputRef={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKey}
              size="small"
              fullWidth
              sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem', py: 0.5 } }}
            />
            <IconButton size="small" onClick={commitEdit} sx={{ color: phaseColor }}>
              <Check size={14} />
            </IconButton>
            <IconButton size="small" onClick={() => setEditing(false)} sx={{ color: 'text.secondary' }}>
              <X size={14} />
            </IconButton>
          </Box>
        ) : (
          <>
            <Typography
              variant="body1"
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                lineHeight: 1.5,
                color: topic.completed ? 'text.secondary' : 'text.primary',
                textDecoration: topic.completed ? 'line-through' : 'none',
                transition: 'all 0.2s',
              }}
            >
              {topic.label}
            </Typography>

            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  style={{ display: 'flex', gap: 2 }}
                >
                  <IconButton
                    size="small"
                    onClick={startEdit}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
                  >
                    <Pencil size={13} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDelete(topic.id)}
                    sx={{ color: 'text.secondary', '&:hover': { color: '#E53935' } }}
                  >
                    <Trash2 size={13} />
                  </IconButton>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Box>
    </motion.div>
  )
}

export default function TopicList({ topics, phaseId, phaseSlug, phaseColor }: Props) {
  const [, startTransition] = useTransition()
  const [optimisticTopics, updateOptimistic] = useOptimistic(topics)
  const [newLabel, setNewLabel] = useState('')
  const [adding, setAdding] = useState(false)

  function handleToggle(topicId: string, currentCompleted: boolean) {
    startTransition(async () => {
      updateOptimistic((prev) =>
        prev.map((t) =>
          t.id === topicId ? { ...t, completed: !currentCompleted } : t
        )
      )
      await toggleTopic(topicId, !currentCompleted, phaseSlug)
    })
  }

  function handleDelete(topicId: string) {
    startTransition(async () => {
      updateOptimistic((prev) => prev.filter((t) => t.id !== topicId))
      await deleteTopic(topicId, phaseSlug)
    })
  }

  function handleUpdate(topicId: string, label: string) {
    startTransition(async () => {
      updateOptimistic((prev) =>
        prev.map((t) => (t.id === topicId ? { ...t, label } : t))
      )
      await updateTopic(topicId, label, phaseSlug)
    })
  }

  async function handleAdd() {
    const label = newLabel.trim()
    if (!label) return
    setNewLabel('')
    startTransition(async () => {
      const tempId = `temp-${Date.now()}`
      updateOptimistic((prev) => [
        ...prev,
        { id: tempId, label, completed: false, orderIndex: prev.length + 1 },
      ])
      await addTopic(phaseId, label, phaseSlug)
    })
  }

  function handleAddKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleAdd()
    if (e.key === 'Escape') {
      setNewLabel('')
      setAdding(false)
    }
  }

  const completedCount = optimisticTopics.filter((t) => t.completed).length

  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          Topics
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {completedCount} of {optimisticTopics.length} done
        </Typography>
      </Stack>

      <Box
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence initial={false}>
          {optimisticTopics.map((topic) => (
            <TopicItem
              key={topic.id}
              topic={topic}
              phaseSlug={phaseSlug}
              phaseColor={phaseColor}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </AnimatePresence>

        {optimisticTopics.length === 0 && !adding && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              No topics yet. Add the first one below.
            </Typography>
          </Box>
        )}

        {/* Add topic */}
        <Box
          sx={{
            borderTop: optimisticTopics.length > 0 ? '1px solid' : 'none',
            borderColor: 'divider',
            p: 1.5,
          }}
        >
          {adding ? (
            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
              <TextField
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={handleAddKey}
                placeholder="Topic label"
                size="small"
                fullWidth
                autoFocus
                sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
              />
              <Button
                onClick={handleAdd}
                disabled={!newLabel.trim()}
                variant="contained"
                size="small"
                sx={{ px: 2, flexShrink: 0 }}
              >
                Add
              </Button>
              <IconButton
                size="small"
                onClick={() => { setAdding(false); setNewLabel('') }}
                sx={{ color: 'text.secondary' }}
              >
                <X size={14} />
              </IconButton>
            </Stack>
          ) : (
            <Button
              onClick={() => setAdding(true)}
              startIcon={<Plus size={14} />}
              size="small"
              sx={{ color: 'text.secondary', fontSize: '0.8rem' }}
            >
              Add topic
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}
