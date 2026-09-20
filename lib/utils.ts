/**
 * Convert a local HH:MM time string to UTC HH:MM.
 * Used before storing reminder_time in notification_settings.
 *
 * @param localTime - "HH:MM" in the user's local timezone
 * @param timezone  - IANA timezone string, e.g. "Asia/Dhaka"
 * @returns "HH:MM" in UTC
 */
export function toUtcTime(localTime: string, timezone: string): string {
  const [hours, minutes] = localTime.split(':').map(Number)
  const now = new Date()
  // Build a date in the user's timezone at the given time
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(now)
  const year = parts.find((p) => p.type === 'year')!.value
  const month = parts.find((p) => p.type === 'month')!.value
  const day = parts.find((p) => p.type === 'day')!.value

  // Create date in local timezone, read as UTC
  const localDate = new Date(`${year}-${month}-${day}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`)

  // Offset calculation using the timezone
  const utcDate = new Date(
    localDate.toLocaleString('en-US', { timeZone: 'UTC' })
  )
  const tzDate = new Date(
    localDate.toLocaleString('en-US', { timeZone: timezone })
  )
  const offsetMs = tzDate.getTime() - utcDate.getTime()
  const utcMs = localDate.getTime() - offsetMs

  const result = new Date(utcMs)
  const utcHH = String(result.getUTCHours()).padStart(2, '0')
  const utcMM = String(result.getUTCMinutes()).padStart(2, '0')
  return `${utcHH}:${utcMM}`
}

/**
 * Convert a UTC HH:MM time string to the user's local HH:MM.
 * Used when displaying reminder_time back to the user.
 *
 * @param utcTime  - "HH:MM" stored in DB (UTC)
 * @param timezone - IANA timezone string, e.g. "Asia/Dhaka"
 * @returns "HH:MM" in the user's timezone
 */
export function toLocalTime(utcTime: string, timezone: string): string {
  const [hours, minutes] = utcTime.split(':').map(Number)
  const now = new Date()
  const utcDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), hours, minutes, 0)
  )
  const localStr = utcDate.toLocaleTimeString('en-US', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  // Normalize to HH:MM
  const [h, m] = localStr.split(':')
  return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
