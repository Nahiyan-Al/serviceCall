export interface Course {
  term: string;
  number: string;
  meets: string;
  title: string;
}

interface CourseListProps {
  courses: Record<string, Course>;
}

const CourseList = ({ courses }: CourseListProps) => (
  <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 xl:grid-cols-4">
    {Object.entries(courses).map(([id, course]) => (
      <li key={id} className="h-full min-w-0">
        <article className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900">
            {course.term} CS {course.number}
          </h2>
          <p className="mt-3 flex-1 text-sm leading-snug text-gray-800">{course.title}</p>
          <hr className="my-4 border-0 border-t border-gray-200" />
          <p className="text-sm text-gray-600">{course.meets}</p>
        </article>
      </li>
    ))}
  </ul>
);

export default CourseList;
