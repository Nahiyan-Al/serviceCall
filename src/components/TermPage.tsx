import { useState } from "react";
import Banner from "./Banner";
import CourseList, { type Course } from "./CourseList";
import TermSelector, { type Term } from "./TermSelector";
import { toggleList } from "../utilities/toggleList";

interface TermPageProps {
  title: string;
  courses: Record<string, Course>;
}

const TermPage = ({ title, courses }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>("Fall");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredCourses = Object.fromEntries(
    Object.entries(courses).filter(([, course]) => course.term === selectedTerm),
  );

  const toggleCourseSelection = (courseId: string) => {
    setSelectedIds((ids) => toggleList(courseId, ids));
  };

  return (
    <>
      <Banner title={title} />
      <TermSelector selection={selectedTerm} setSelection={setSelectedTerm} />
      <CourseList
        courses={filteredCourses}
        selectedIds={selectedIds}
        onToggleCourse={toggleCourseSelection}
      />
    </>
  );
};

export default TermPage;
