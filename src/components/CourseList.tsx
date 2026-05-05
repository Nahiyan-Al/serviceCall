import { conflictsWithSelection } from "../utilities/courseConflicts";
import { Link } from "@tanstack/react-router";

export interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

interface CourseListProps {
  courses: Record<string, Course>;
  selectedIds: string[];
  selectedCourses: Course[];
  onToggleCourse: (courseId: string) => void;
}

const CheckIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CourseList = ({ courses, selectedIds, selectedCourses, onToggleCourse }: CourseListProps) => (
  <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
    {Object.entries(courses).map(([id, course]) => {
      const selected = selectedIds.includes(id);
      const blocked = !selected && conflictsWithSelection(course, selectedCourses);
      return (
        <li key={id} className="h-full min-w-0">
          <div
            className={`relative flex h-full flex-col rounded-lg border p-4 text-left shadow-sm transition-colors ${
              blocked
                ? "border-gray-200 bg-gray-100 opacity-65"
                : selected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-400"
                  : "border-gray-200 bg-white"
            }`}
          >
            <button
              type="button"
              aria-pressed={selected}
              disabled={blocked}
              title={blocked ? "Time conflicts with a selected course" : undefined}
              onClick={() => onToggleCourse(id)}
              className={`flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${blocked ? "cursor-not-allowed" : ""}`}
            >
            {selected && (
              <span
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow"
                aria-hidden
              >
                <CheckIcon />
              </span>
            )}
            {blocked && (
              <span
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-400 text-lg font-semibold leading-none text-white shadow-sm"
                aria-hidden
              >
                ×
              </span>
            )}
            <h2
              className={`pr-10 text-lg font-bold ${
                blocked ? "text-gray-500" : selected ? "text-blue-900" : "text-gray-900"
              }`}
            >
              {course.term} CS {course.number}
            </h2>
            <p
              className={`mt-3 flex-1 text-sm leading-snug ${
                blocked ? "text-gray-500" : selected ? "text-blue-950" : "text-gray-800"
              }`}
            >
              {course.title}
            </p>
            <hr
              className={`my-4 border-0 border-t ${
                blocked ? "border-gray-200" : selected ? "border-blue-200" : "border-gray-200"
              }`}
            />
            <p
              className={`text-sm ${
                blocked ? "text-gray-500" : selected ? "text-blue-800" : "text-gray-600"
              }`}
            >
              {course.meets}
            </p>
            </button>
            <Link
              to="/courses/$courseId/edit"
              params={{ courseId: id }}
              className="mt-4 inline-flex w-fit rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
            >
              Edit
            </Link>
          </div>
        </li>
      );
    })}
  </ul>
);

export default CourseList;
