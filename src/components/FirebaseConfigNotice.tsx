import { getFirebaseConfigError } from '../utilities/firebase'

const FirebaseConfigNotice = () => {
  const message = getFirebaseConfigError()
  if (!message) return null

  return (
    <div
      className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950"
      role="alert"
    >
      <p className="font-semibold">Firebase is not configured</p>
      <p className="mt-2 text-sm">{message}</p>
      <p className="mt-2 text-sm">
        After updating <code className="rounded bg-amber-100 px-1">.env</code>, restart the dev
        server (<code className="rounded bg-amber-100 px-1">npm run dev</code>).
      </p>
    </div>
  )
}

export default FirebaseConfigNotice
