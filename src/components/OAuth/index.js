import React, { useState } from 'react'
import cn from 'classnames'
import { useRouter } from 'next/router'
import AppLink from '../AppLink'
import Loader from '../Loader'
import { useStateContext } from '../../utils/context/StateContext'
import { setToken } from '../../utils/token'

// Import Firebase services from your central file
import { db, auth, provider } from '../../lib/firebase'
import { signInWithPopup } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

import styles from './OAuth.module.sass'

const OAuth = ({ className, handleClose, handleOAuth, disable }) => {
  const { setCosmicUser } = useStateContext()
  const router = useRouter()
  const [errorMessage, setErrorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setErrorMessage('')
      console.log('Starting Google sign-in...')

      const result = await signInWithPopup(auth, provider)
      console.log('Sign in result:', result)

      const user = result.user
      console.log('User email:', user.email)

      const firstName = user.displayName
        ? user.displayName.split(' ')[0]
        : 'No first name'
      console.log('User first name:', firstName)

      // Verify email domain
      if (
        !user.email.endsWith('@iiitkottayam.ac.in') &&
        user.email !== 'pavan082005@gmail.com'
      ) {
        console.log('Domain check failed for:', user.email)
        setErrorMessage('Please use your college email address')
        return
      }

      // Store user details in Firestore under the "users" collection
      await setDoc(
        doc(db, 'users', user.uid),
        {
          email: user.email,
          first_name: firstName,
        },
        { merge: true }
      )
      console.log('User data stored successfully in Firestore.')

      // Create user object for state
      const cosmicUser = {
        id: user.uid,
        first_name: firstName,
        avatar_url: user.photoURL || '',
        email: user.email,
      }
        const computeRollNumber = email => {
          if (!email?.endsWith('@iiitkottayam.ac.in')) return null
          const localPart = email.split('@')[0] // e.g. "pavan23bcy2"
          const pattern = /^([a-z]+)(\d{2})([a-z]+)(\d+)$/i
          const match = localPart.match(pattern)
          if (!match) return null
          const [, , year, deptCode, roll] = match
          const paddedRoll = roll.padStart(4, '0')
          return `20${year}${deptCode}${paddedRoll}` // e.g. "2023BCY0002"
        }
      // Update global state and token
      setCosmicUser(cosmicUser)
      setToken({
        id: cosmicUser.id,
        first_name: cosmicUser.first_name,
        avatar_url: cosmicUser.avatar_url,
        roll_number: computeRollNumber(user.email),
      })

      console.log('Successfully signed in!')
      setErrorMessage('Successfully signed in!')
      if (handleOAuth) handleOAuth(cosmicUser)
      if (handleClose) handleClose()
    } catch (error) {
      console.error('Error during Google sign-in:', error)
      setErrorMessage(
        error.code === 'auth/popup-closed-by-user'
          ? 'Sign-in cancelled'
          : 'Error signing in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn(className, styles.transfer)}>
      <div className={cn('h4', styles.title)}>
        Authentication with{' '}
        <AppLink target="_blank" href="#">
          your college email
        </AppLink>
      </div>
      <div className={styles.text}>
        To sell an item you need to sign in with your college email address at{' '}
        <AppLink target="_blank" href="#">
          UniTrader
        </AppLink>
      </div>
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
      <div className={styles.btns}>
        <button
          onClick={handleGoogleSignIn}
          className={cn('button', styles.button, styles.googleButton)}
          disabled={loading}
        >
          {loading ? <Loader /> : 'Sign in with Google'}
        </button>
        <button
          onClick={disable ? handleGoHome : handleClose}
          className={cn('button-stroke', styles.button)}
        >
          {disable ? 'Return Home Page' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

export default OAuth
