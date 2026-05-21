import { getFirebaseConfigError, signInWithGoogle, signOut, useAuthState } from '../utilities/firebase'

interface BannerProps {
  title?: string
}

const authButtonClass =
  'rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50'

const Banner = ({ title }: BannerProps) => {
  const configError = getFirebaseConfigError()
  const { user, isInitialLoading } = useAuthState()

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <span className="text-xl font-medium text-blue-600">
          {configError
            ? 'Welcome, guest!'
            : isInitialLoading
              ? 'Checking sign-in…'
              : `Welcome, ${user?.displayName ?? 'guest'}!`}
        </span>
        <span className="ml-auto">
          {!configError &&
            !isInitialLoading &&
            (user ? (
              <button type="button" onClick={() => signOut()} className={authButtonClass}>
                Sign Out
              </button>
            ) : (
              <button type="button" onClick={() => signInWithGoogle()} className={authButtonClass}>
                Sign In
              </button>
            ))}
        </span>
      </div>
      {title ? (
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
      ) : null}
      <hr className="mb-6 border-gray-200" />
    </>
  )
}

export default Banner
