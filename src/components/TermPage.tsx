import { useState } from "react";
import Banner from "./Banner";
import CourseList, { type Course } from "./CourseList";
import TermSelector, { type Term } from "./TermSelector";

interface TermPageProps {
  title: string;
  courses: Record<string, Course>;
}

const TermPage = ({ title, courses }: TermPageProps) => {
  const [selectedTerm, setSelectedTerm] = useState<Term>("Fall");

  const filteredCourses = Object.fromEntries(
    Object.entries(courses).filter(([, course]) => course.term === selectedTerm),
  );

  return (
    <>
      <Banner title={title} />
      <TermSelector selection={selectedTerm} setSelection={setSelectedTerm} />
      <CourseList courses={filteredCourses} />
    </>
  );
};

export default TermPage;
