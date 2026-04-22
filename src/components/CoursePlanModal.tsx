import Modal from "./Modal";
import { type Course } from "./CourseList";

interface CoursePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIds: string[];
  courses: Record<string, Course>;
}

const CoursePlanModal = ({
  isOpen,
  onClose,
  selectedIds,
  courses,
}: CoursePlanModalProps) => {
  const items = selectedIds
    .map((id) => {
      const course = courses[id];
      return course ? { id, course } : null;
    })
    .filter((x): x is { id: string; course: Course } => x !== null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="pr-8 text-lg font-bold text-gray-900">Your course plan</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm leading-relaxed text-gray-600">
          You have not selected any courses yet. Click a course card in the grid
          to add it to this plan. Click a course that is already selected
          (highlighted with a checkmark) to remove it.
        </p>
      ) : (
        <ul className="mt-4 list-none space-y-4 p-0">
          {items.map(({ id, course }) => (
            <li key={id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <p className="font-semibold text-gray-900">
                {course.term} CS {course.number}
              </p>
              <p className="mt-1 text-sm text-gray-800">{course.title}</p>
              <p className="mt-1 text-sm text-gray-600">{course.meets}</p>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
};

export default CoursePlanModal;
