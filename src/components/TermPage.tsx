import { useMemo, useState } from "react";
import CourseList, { type Course } from "./CourseList";
import CoursePlanModal from "./CoursePlanModal";
import TermSelector, { type Term } from "./TermSelector";
import { conflictsWithSelection } from "../utilities/courseConflicts";
import { useProfile } from "../utilities/profile";
import { toggleList } from "../utilities/toggleList";

interface TermPageProps {
  title: string;
  courses: Record<string, Course>;
}

const TermPage = ({ title, courses }: TermPageProps) => {
  const [profile, profileLoading, profileError] = useProfile();
  const [selectedTerm, setSelectedTerm] = useState<Term>("Fall");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [planOpen, setPlanOpen] = useState(false);

  const filteredCourses = Object.fromEntries(
    Object.entries(courses).filter(([, course]) => course.term === selectedTerm),
  );

  const selectedCourses = useMemo(
    () => selectedIds.map((id) => courses[id]).filter((c): c is Course => c != null),
    [selectedIds, courses],
  );

  const toggleCourseSelection = (courseId: string) => {
    const course = courses[courseId];
    if (!course) return;

    if (selectedIds.includes(courseId)) {
      setSelectedIds((ids) => toggleList(courseId, ids));
      return;
    }

    if (conflictsWithSelection(course, selectedCourses)) return;

    setSelectedIds((ids) => toggleList(courseId, ids));
  };

  if (profileError) {
    return (
      <p className="text-red-600" role="alert">
        Error loading profile: {profileError.message}
      </p>
    );
  }

  if (profileLoading) {
    return <p className="text-gray-600">Loading user profile…</p>;
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TermSelector selection={selectedTerm} setSelection={setSelectedTerm} />
        <button
          type="button"
          onClick={() => setPlanOpen(true)}
          className="self-start rounded-lg border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 sm:self-auto"
        >
          Course plan
        </button>
      </div>
      <CoursePlanModal
        isOpen={planOpen}
        onClose={() => setPlanOpen(false)}
        selectedIds={selectedIds}
        courses={courses}
      />
      <CourseList
        courses={filteredCourses}
        selectedIds={selectedIds}
        selectedCourses={selectedCourses}
        onToggleCourse={toggleCourseSelection}
        isAdmin={profile.isAdmin}
        profileLoading={profileLoading}
      />
    </>
  );
};

export default TermPage;
