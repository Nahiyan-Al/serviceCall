import type { ReactElement } from 'react'
import type { FieldError } from 'react-hook-form'

type CourseFieldProps = {
  label: string
  error?: FieldError
  children: ReactElement
}

const CourseField = ({ label, error, children }: CourseFieldProps) => (
  <div className="block">
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-gray-800">{label}</span>
      {children}
    </label>
    {error?.message && (
      <p className="mt-1 text-sm text-red-600" role="alert">
        {error.message}
      </p>
    )}
  </div>
)

export default CourseField
