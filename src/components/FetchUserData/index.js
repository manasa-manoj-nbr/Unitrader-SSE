import React, { useEffect } from 'react'
import { useStateContext } from '../utils/context/StateContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'

const FetchUserData = () => {
  const { cosmicUser } = useStateContext()

  useEffect(() => {
    const fetchUserData = async () => {
      if (cosmicUser && cosmicUser.id) {
        try {
          const userDocRef = doc(db, 'users', cosmicUser.id)
          const userDocSnap = await getDoc(userDocRef)
          if (userDocSnap.exists()) {
            console.log('User data from Firestore:', userDocSnap.data())
          } else {
            console.log('No user data found for user id:', cosmicUser.id)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      } else {
        console.log('No logged in user available.')
      }
    }

    fetchUserData()
  }, [cosmicUser])

  return null // This component doesn't render any UI
}

export default FetchUserData
