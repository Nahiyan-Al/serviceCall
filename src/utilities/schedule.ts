import { type Course } from '../components/CourseList'

/** Realtime Database path for schedule JSON (`title` + `courses`). */
export const SCHEDULE_DATABASE_PATH = 'schedule'

export type Schedule = {
  title: string
  courses: Record<string, Course>
}

export function isSchedule(value: unknown): value is Schedule {
  if (value === null || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  if (typeof o.title !== 'string' || o.courses === null || typeof o.courses !== 'object') {
    return false
  }
  return true
}
