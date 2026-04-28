import { createFileRoute, useNavigate } from '@tanstack/react-router'
import Banner from '../components/Banner'
import CourseEditor from '../components/CourseEditor'
import { useJsonQuery } from '../utilities/fetch'
import { COURSES_URL, isSchedule } from '../utilities/schedule'

const CourseEditPage = () => {
  const { courseId } = Route.useParams()
  const navigate = useNavigate()
  const [data, loading, error] = useJsonQuery(COURSES_URL)
  const schedule = isSchedule(data) ? data : null
  const course = schedule?.courses[courseId]

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
      <Banner title={schedule.title} />
      <CourseEditor course={course} onCancel={() => navigate({ to: '/' })} />
    </>
  )
}

export const Route = createFileRoute('/courses/$courseId/edit')({
  component: CourseEditPage,
})
