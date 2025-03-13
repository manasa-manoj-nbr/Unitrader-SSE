import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA4_P7GyvO0PmcvmWZUaonZvJnRXIDkA60',
  authDomain: 'testing-uni-55a39.firebaseapp.com',
  projectId: 'testing-uni-55a39',
  storageBucket: 'testing-uni-55a39.appspot.com', // Ensure this is correct
  messagingSenderId: '170507639873',
  appId: '1:170507639873:web:67a20e667abe41b9b4bac0',
  measurementId: 'G-JF28JYYL0Q',
}

// Initialize Firebase only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Analytics only on the client side
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.error('Error initializing analytics:', error)
  }
}

// Initialize Firestore and Auth
const db = getFirestore(app)
const auth = getAuth(app)

export { db, analytics, auth, GoogleAuthProvider }
