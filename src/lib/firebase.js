// src/lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyA4_P7GyvO0PmcvmWZUaonZvJnRXIDkA60',
  authDomain: 'testing-uni-55a39.firebaseapp.com',
  projectId: 'testing-uni-55a39',
  storageBucket: 'testing-uni-55a39.appspot.com', // Must be *.appspot.com for typical usage
  messagingSenderId: '170507639873',
  appId: '1:170507639873:web:67a20e667abe41b9b4bac0',
  measurementId: 'G-JF28JYYL0Q',
}

// Only initialize Firebase once per environment
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Initialize Analytics only on client side
let analytics = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (error) {
    console.error('Error initializing analytics:', error)
  }
}

// Initialize Firestore, Auth, and a single instance of the Google provider
const db = getFirestore(app)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { db, analytics, auth, provider }
