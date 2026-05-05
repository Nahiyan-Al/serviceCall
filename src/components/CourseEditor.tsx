import { useForm } from 'react-hook-form'
import CourseField from './CourseField'
import { type Course } from './CourseList'
import {
  courseFormResolver,
  type CourseFormValues,
  type CourseTerm,
  COURSE_TERMS,
} from '../types/courseForm'

interface CourseEditorProps {
  course: Course
  onCancel: () => void
}

const baseInputClass =
  'w-full rounded-md border px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200'

const CourseEditor = ({ course, onCancel }: CourseEditorProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormValues>({
    resolver: courseFormResolver,
    defaultValues: {
      title: course.title,
      term: (COURSE_TERMS as readonly string[]).includes(course.term)
        ? (course.term as CourseTerm)
        : 'Fall',
      number: course.number,
      meets: course.meets,
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  })

  const onSubmit = async (values: CourseFormValues) => {
    await new Promise((r) => setTimeout(r, 2000))
    reset(values)
  }

  const onInvalid = () => {
    /* RHF surfaced field errors via errors */
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
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Saving…' : 'Save'}
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
