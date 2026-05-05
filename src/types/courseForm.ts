import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { isValidMeetingTime } from '../utilities/courseConflicts'

export const COURSE_TERMS = ['Fall', 'Winter', 'Spring', 'Summer'] as const

export type CourseTerm = (typeof COURSE_TERMS)[number]

export const courseFormSchema = z.object({
  title: z.string().min(2, {
    message: 'Title must be at least two characters.',
  }),
  term: z.enum(COURSE_TERMS, {
    message: 'Term must be Fall, Winter, Spring, or Summer.',
  }),
  number: z.string().regex(/^\d+(-\d+)?$/, {
    message: 'Course number must be digits, optionally followed by -section (e.g., "213-2").',
  }),
  meets: z.string().refine(isValidMeetingTime, {
    message: "Must contain days and start-end, e.g., MWF 12:00-13:20 (or leave empty).",
  }),
})

export type CourseFormValues = z.infer<typeof courseFormSchema>

export const courseFormResolver = zodResolver(courseFormSchema)
