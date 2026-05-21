import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import CourseEditor from '../components/CourseEditor'
import { useAuthState, useDataQuery } from '../utilities/firebase'
import { isSchedule, SCHEDULE_DATABASE_PATH } from '../utilities/schedule'

const CourseEditPage = () => {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()
  const { isAuthenticated, isInitialLoading } = useAuthState()
  const [data, loading, error] = useDataQuery(SCHEDULE_DATABASE_PATH)
  const schedule = isSchedule(data) ? data : null
  const course = schedule?.courses[courseId]

  if (isInitialLoading) return <p className="text-gray-600">Checking sign-in…</p>
  if (!isAuthenticated) {
    return (
      <p className="text-red-600" role="alert">
        You must{' '}
        <Link to="/" className="font-medium text-blue-700 underline hover:text-blue-800">
          sign in
        </Link>{' '}
        to edit courses.
      </p>
    )
  }

  if (loading) return <p className="text-gray-600">Loading courses...</p>
  if (error) {
    return (
      <p className="text-red-600" role="alert">
        Could not load courses: {error.message}
      </p>
    )
  }
  if (!schedule || !course) {
    return (
      <p className="text-red-600" role="alert">
        Course not found.
      </p>
    )
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">{schedule.title}</h1>
      <CourseEditor
        courseId={courseId}
        course={course}
        onCancel={() => navigate({ to: '/' })}
      />
    </>
  )
}

export const Route = createFileRoute('/courses/$courseId/edit')({
  component: CourseEditPage,
})
