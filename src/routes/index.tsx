import { createFileRoute } from '@tanstack/react-router'
import TermPage from '../components/TermPage'
import { useDataQuery } from '../utilities/firebase'
import { isSchedule, SCHEDULE_DATABASE_PATH } from '../utilities/schedule'

const CourseListPage = () => {
  const [data, loading, error] = useDataQuery(SCHEDULE_DATABASE_PATH)
  const schedule = isSchedule(data) ? data : null

  return (
    <>
      {loading && <p className="text-gray-600">Loading courses...</p>}
      {error && (
        <p className="text-red-600" role="alert">
          Could not load courses: {error.message}
        </p>
      )}
      {!loading && !error && schedule && <TermPage title={schedule.title} courses={schedule.courses} />}
      {!loading && !error && data !== undefined && !schedule && (
        <p className="text-red-600" role="alert">
          Received unexpected data from Firebase.
        </p>
      )}
    </>
  )
}

export const Route = createFileRoute('/')({
  component: CourseListPage,
})
