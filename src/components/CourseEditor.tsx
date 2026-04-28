import { useState, type FormEvent } from 'react'
import { type Course } from './CourseList'

interface CourseEditorProps {
  course: Course
  onCancel: () => void
}

const CourseEditor = ({ course, onCancel }: CourseEditorProps) => {
  const [title, setTitle] = useState(course.title)
  const [meets, setMeets] = useState(course.meets)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-gray-900">
        Edit {course.term} CS {course.number}
      </h2>
      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Title</span>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Meeting times</span>
          <input
            type="text"
            name="meets"
            value={meets}
            onChange={(event) => setMeets(event.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        </label>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default CourseEditor
