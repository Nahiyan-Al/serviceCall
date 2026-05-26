import type { User } from 'firebase/auth'
import { useAuthState, useDataQuery } from './firebase'

export type Profile = {
  user: User | null
  isAdmin: boolean
}

/** Auth user plus admin flag from Realtime Database `admins/{uid}`. */
export function useProfile(): [Profile, boolean, Error | null] {
  const { user } = useAuthState()
  const [adminFlag, loading, error] = useDataQuery(`/admins/${user?.uid ?? 'guest'}`)
  const isAdmin = adminFlag === true
  return [{ user, isAdmin }, loading, error]
}
