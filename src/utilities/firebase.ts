import { useEffect, useState } from 'react'
import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { getDatabase, onValue, ref, type Database } from 'firebase/database'

function readFirebaseOptions(): FirebaseOptions {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_DATABASE_URL,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
  } = import.meta.env

  if (
    typeof VITE_FIREBASE_API_KEY !== 'string' ||
    typeof VITE_FIREBASE_AUTH_DOMAIN !== 'string' ||
    typeof VITE_FIREBASE_DATABASE_URL !== 'string' ||
    typeof VITE_FIREBASE_PROJECT_ID !== 'string' ||
    typeof VITE_FIREBASE_STORAGE_BUCKET !== 'string' ||
    typeof VITE_FIREBASE_MESSAGING_SENDER_ID !== 'string' ||
    typeof VITE_FIREBASE_APP_ID !== 'string'
  ) {
    throw new Error(
      'Missing Firebase web config. Set VITE_FIREBASE_* variables (copy .env.example to .env).',
    )
  }

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: VITE_FIREBASE_DATABASE_URL,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
  }
}

const firebaseApp: FirebaseApp = getApps().length ? getApp() : initializeApp(readFirebaseOptions())

const database: Database = getDatabase(firebaseApp)

export function useDataQuery(path: string): [unknown, boolean, Error | null] {
  const [data, setData] = useState<unknown>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setData(undefined)
    setLoading(true)
    setError(null)

    return onValue(
      ref(database, path),
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
  }, [path])

  return [data, loading, error]
}
