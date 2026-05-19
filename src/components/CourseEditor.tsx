import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import CourseField from './CourseField'
import { type Course } from './CourseList'
import {
  courseFormResolver,
  type CourseFormValues,
  type CourseTerm,
  COURSE_TERMS,
} from '../types/courseForm'
import { updateCourseFields } from '../utilities/firebase'

interface CourseEditorProps {
  courseId: string
  course: Course
  onCancel: () => void
}

function courseToFormValues(course: Course): CourseFormValues {
  return {
    title: course.title ?? '',
    term: (COURSE_TERMS as readonly string[]).includes(course.term)
      ? (course.term as CourseTerm)
      : 'Fall',
    number: String(course.number ?? ''),
    meets: course.meets ?? '',
  }
}

function courseSnapshotKey(course: Course): string {
  const v = courseToFormValues(course)
  return `${v.title}|${v.term}|${v.number}|${v.meets}`
}

function updatesFromBaseline(
  baseline: CourseFormValues,
  values: CourseFormValues,
): Partial<Course> | null {
  const updates: Partial<Course> = {}
  if (values.title !== baseline.title) updates.title = values.title
  if (values.term !== baseline.term) updates.term = values.term
  if (values.number !== baseline.number) updates.number = values.number
  if (values.meets !== baseline.meets) updates.meets = values.meets
  return Object.keys(updates).length > 0 ? updates : null
}

const baseInputClass =
  'w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

const CourseEditor = ({ courseId, course, onCancel }: CourseEditorProps) => {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitNotice, setSubmitNotice] = useState<string | null>(null)
  const lastSyncedKey = useRef(courseSnapshotKey(course))
  const baselineRef = useRef(courseToFormValues(course))
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CourseFormValues>({
    resolver: courseFormResolver,
    defaultValues: courseToFormValues(course),
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  // Sync from Firebase only when stored course data actually changes (not object identity).
  useEffect(() => {
    const key = courseSnapshotKey(course)
    if (key === lastSyncedKey.current) return
    lastSyncedKey.current = key
    const synced = courseToFormValues(course)
    baselineRef.current = synced
    reset(synced)
    setSubmitError(null)
    setSubmitNotice(null)
  }, [course, reset])

  useEffect(() => {
    if (isDirty) setSubmitNotice(null)
  }, [isDirty])

  const onSubmit = async (values: CourseFormValues) => {
    setSubmitNotice(null)
    const updates = updatesFromBaseline(baselineRef.current, values)
    if (!updates) {
      setSubmitNotice('No changes to save.')
      return
    }

    setSubmitError(null)
    try {
      await updateCourseFields(courseId, updates)
      baselineRef.current = values
      lastSyncedKey.current = courseSnapshotKey({ ...course, ...updates })
      setSubmitNotice('Changes saved.')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to save course.')
    }
  }

  const onInvalid = () => {
    setSubmitError(null)
    setSubmitNotice('Fix the highlighted fields before submitting.')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <h2 className="text-xl font-bold text-gray-900">
        Edit course
      </h2>
      <div className="mt-4 space-y-4">
        <CourseField label="Title" error={errors.title}>
          <input
            type="text"
            className={`${baseInputClass} border-gray-300 ${errors.title ? 'border-red-400' : ''}`}
            autoComplete="off"
            {...register('title')}
          />
        </CourseField>
        <CourseField label="Term" error={errors.term}>
          <select
            className={`${baseInputClass} border-gray-300 bg-white ${errors.term ? 'border-red-400' : ''}`}
            {...register('term')}
          >
            {COURSE_TERMS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </CourseField>
        <CourseField label="Course number" error={errors.number}>
          <input
            type="text"
            className={`${baseInputClass} border-gray-300 ${errors.number ? 'border-red-400' : ''}`}
            autoComplete="off"
            {...register('number')}
          />
        </CourseField>
        <CourseField label="Meeting times" error={errors.meets}>
          <input
            type="text"
            className={`${baseInputClass} border-gray-300 ${errors.meets ? 'border-red-400' : ''}`}
            placeholder='e.g., MWF 12:00-13:20 or leave empty'
            {...register('meets')}
          />
        </CourseField>
      </div>
      {submitError ? (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      ) : null}
      {submitNotice ? (
        <p
          className={`mt-4 text-sm ${submitNotice === 'Changes saved.' ? 'text-green-700' : 'text-amber-800'}`}
          role="status"
        >
          {submitNotice}
        </p>
      ) : null}
      {!isDirty && !submitNotice && !submitError ? (
        <p className="mt-4 text-sm text-gray-600">Change a field, then click Submit.</p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CourseEditor
