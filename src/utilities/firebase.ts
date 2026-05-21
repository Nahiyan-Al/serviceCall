import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type Auth,
  type NextOrObserver,
  type User,
} from 'firebase/auth'
import { getDatabase, onValue, ref, update, type Database } from 'firebase/database'
import { type Course } from '../components/CourseList'
import { SCHEDULE_DATABASE_PATH } from './schedule'

const ENV_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_DATABASE_URL',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const

function envValue(key: (typeof ENV_KEYS)[number]): string {
  const value = import.meta.env[key]
  return typeof value === 'string' ? value.trim() : ''
}

/** Non-null when Firebase web config is missing or blank in `.env`. */
export function getFirebaseConfigError(): string | null {
  const missing = ENV_KEYS.filter((key) => !envValue(key))
  if (missing.length === 0) return null
  return `Missing Firebase config in .env: ${missing.join(', ')}. Copy values from Firebase Console → Project settings → Your apps → Config (project: servicecall-d2965).`
}

function readFirebaseOptions(): FirebaseOptions {
  const error = getFirebaseConfigError()
  if (error) throw new Error(error)

  return {
    apiKey: envValue('VITE_FIREBASE_API_KEY'),
    authDomain: envValue('VITE_FIREBASE_AUTH_DOMAIN'),
    databaseURL: envValue('VITE_FIREBASE_DATABASE_URL'),
    projectId: envValue('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: envValue('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: envValue('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: envValue('VITE_FIREBASE_APP_ID'),
  }
}

let firebaseApp: FirebaseApp | null = null
let auth: Auth | null = null
let database: Database | null = null

function requireFirebase() {
  if (!firebaseApp || !auth || !database) {
    throw new Error(getFirebaseConfigError() ?? 'Firebase is not initialized.')
  }
  return { firebaseApp, auth, database }
}

function ensureFirebase() {
  if (firebaseApp && auth && database) return requireFirebase()
  const options = readFirebaseOptions()
  firebaseApp = getApps().length ? getApp() : initializeApp(options)
  auth = getAuth(firebaseApp)
  database = getDatabase(firebaseApp)
  return requireFirebase()
}

export const signInWithGoogle = () => {
  const { auth: firebaseAuth } = ensureFirebase()
  return signInWithPopup(firebaseAuth, new GoogleAuthProvider())
}

const firebaseSignOut = () => {
  const { auth: firebaseAuth } = ensureFirebase()
  return signOut(firebaseAuth)
}

export { firebaseSignOut as signOut }

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isInitialLoading: boolean
}

export const addAuthStateListener = (fn: NextOrObserver<User | null>) => {
  const { auth: firebaseAuth } = ensureFirebase()
  return onAuthStateChanged(firebaseAuth, fn)
}

export const useAuthState = (): AuthState => {
  const configError = getFirebaseConfigError()
  const [user, setUser] = useState<User | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(!configError)
  const isAuthenticated = !!user

  useEffect(() => {
    if (configError) return
    const { auth: firebaseAuth } = ensureFirebase()
    setUser(firebaseAuth.currentUser)
    return addAuthStateListener((nextUser) => {
      flushSync(() => {
        setUser(nextUser)
        setIsInitialLoading(false)
      })
    })
  }, [configError])

  return { user, isAuthenticated, isInitialLoading }
}

export function useDataQuery(path: string): [unknown, boolean, Error | null] {
  const configError = getFirebaseConfigError()
  const [data, setData] = useState<unknown>()
  const [loading, setLoading] = useState(!configError)
  const [error, setError] = useState<Error | null>(
    configError ? new Error(configError) : null,
  )

  useEffect(() => {
    if (configError) {
      setLoading(false)
      setError(new Error(configError))
      return
    }

    const { database: db } = ensureFirebase()
    setData(undefined)
    setLoading(true)
    setError(null)

    return onValue(
      ref(db, path),
      (snapshot) => {
        setData(snapshot.val())
        setLoading(false)
        setError(null)
      },
      (err) => {
        setError(err instanceof Error ? err : new Error(String(err)))
        setLoading(false)
      },
    )
  }, [path, configError])

  return [data, loading, error]
}

/** Write only the changed course fields at `schedule/courses/{courseId}`. */
export async function updateCourseFields(
  courseId: string,
  updates: Partial<Course>,
): Promise<void> {
  const { database: db } = ensureFirebase()
  const path = `${SCHEDULE_DATABASE_PATH}/courses/${courseId}`
  console.log('updateCourseFields', path, updates)
  try {
    await update(ref(db, path), updates)
  } catch (err) {
    console.error('updateCourseFields failed', err)
    throw err instanceof Error ? err : new Error(String(err))
  }
}
