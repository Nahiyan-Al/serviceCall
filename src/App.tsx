import TermPage from "./components/TermPage";
import { type Course } from "./components/CourseList";
import { useJsonQuery } from "./utilities/fetch";

const COURSES_URL =
  "https://courses.cs.northwestern.edu/394/guides/data/cs-courses.php";

type Schedule = {
  title: string;
  courses: Record<string, Course>;
};

function isSchedule(value: unknown): value is Schedule {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  if (typeof o.title !== "string" || o.courses === null || typeof o.courses !== "object") {
    return false;
  }
  return true;
}

const App = () => {
  const [data, loading, error] = useJsonQuery(COURSES_URL);

  const schedule = isSchedule(data) ? data : null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {loading && <p className="text-gray-600">Loading courses…</p>}
        {error && (
          <p className="text-red-600" role="alert">
            Could not load courses: {error.message}
          </p>
        )}
        {!loading && !error && schedule && (
          <TermPage title={schedule.title} courses={schedule.courses} />
        )}
        {!loading && !error && data !== undefined && !schedule && (
          <p className="text-red-600" role="alert">
            Received unexpected data from the course server.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
