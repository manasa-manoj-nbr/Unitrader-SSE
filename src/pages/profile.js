import React, { useState, useEffect, useCallback } from 'react'
import cn from 'classnames'
import Layout from '../components/Layout'
import { PageMeta } from '../components/Meta'
import chooseBySlug from '../utils/chooseBySlug'
import { useStateContext } from '../utils/context/StateContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../lib/firebase'
import {
  getDataByCategory,
  getAllDataByType,
  getDataByRoll,
} from '../lib/cosmic'
import Headers from '../components/Header'
import Image from 'next/image'


const ProfilePage = ({ navigationItems }) => {
  const { cosmicUser } = useStateContext()
  const [profileData, setProfileData] = useState(null)
  const [activeTab, setActiveTab] = useState('purchases')
  const infoAbout = chooseBySlug(null, 'profile')
    // Helper: Compute username from email if domain is "iiitkottayam.ac.in"
    const computeUsername = email => {
        if (!email?.endsWith('@iiitkottayam.ac.in')) return null
        const localPart = email.split('@')[0] // e.g. "user23bcy41"
        const username = localPart.replace(/\d.*$/, '') // Remove digits and everything after them
        return username.toUpperCase() // Returns "user"
    }
  
  // Helper: Compute roll number from email if domain is "iiitkottayam.ac.in"
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

  // Fetch Firestore user data and then fetch sold items from Cosmic
  useEffect(() => {
    const fetchUserData = async () => {
      if (cosmicUser && cosmicUser.id) {
        try {
          // Fetch user document from Firestore
          const userDocRef = doc(db, 'users', cosmicUser.id)
          const userDocSnap = await getDoc(userDocRef)
          let firestoreData = {}
          if (userDocSnap.exists()) {
            firestoreData = userDocSnap.data()
            console.log('Fetched Firestore user data:', firestoreData)
            console.log("User's email from Firestore:", firestoreData.email)
          } else {
            console.log('No user data found for UID:', cosmicUser.id)
          }
          // Compute roll number from email
            const rollNumber = computeRollNumber(firestoreData.email)
          let soldItems = []
          if (rollNumber) {
            console.log('Fetching sold items for roll number:', rollNumber)
            // Use getDataByRoll to fetch products where metadata.seller equals the rollNumber
            soldItems = await getDataByRoll(rollNumber)
            console.log('Fetched sold items from Cosmic:', soldItems)
          }
          // Store combined profile data
          setProfileData({ ...firestoreData, sold: soldItems })
        } catch (error) {
          console.error('Error fetching user data or cosmic items:', error)
        }
      }
    }
    fetchUserData()
  }, [cosmicUser])

  if (!profileData) {
    return (
      <Layout navigationPaths={navigationItems}>
        <PageMeta
          title="Profile | UniTrader"
          description="UniTrader is your friendly college-hood marketplace."
        />
        <Headers navigation={navigationItems} />
        <div className="loading">Loading profile...</div>
        <style jsx>{`
          .loading {
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 80px;
          }
        `}</style>
      </Layout>
    )
  }

    const rollNumber = computeRollNumber(profileData.email)
    const username = computeUsername(profileData.email)

  // When "sold" tab is clicked, re-fetch sold items and print them in the console.
  const handleSoldClick = async () => {
    if (!rollNumber) {
      console.log('Roll number not available.')
      return
    }
    try {
      const soldItems = await getDataByRoll(rollNumber)
      console.log('Sold items for roll number', rollNumber, ':', soldItems)
      // Optionally update state to refresh UI:
      setProfileData(prev => ({ ...prev, sold: soldItems }))
    } catch (error) {
      console.error('Error fetching sold items:', error)
    }
  }

  // Render tab content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'purchases':
        return (
          <div className="photos">
            {profileData.purchases && profileData.purchases.length > 0 ? (
              profileData.purchases.map((photo, index) => (
                <div key={index} className="photoItem">
                  <img src={photo.src} alt={photo.alt} />
                </div>
              ))
            ) : (
              <p>No purchases found.</p>
            )}
          </div>
        )
      case 'sold':
        return (
          <div className="galleries">
            {profileData.sold && profileData.sold.length > 0 ? (
              profileData.sold.map((item, index) => (
                <div key={index} className="galleryItem">
                  <div className="imageContainer">
                    <img
                      src={
                        item.metadata?.image?.imgix_url || '/default-avatar.png'
                      }
                              alt={item.title}
                    />
                  </div>
                  <div className="galleryInfo">
                    <h3>{item.title}</h3>
                    {item.metadata?.price && (
                      <p className="price">₹{item.metadata.price}</p>
                    )}
                    <span className="status">
                      {item.metadata?.status || 'Listed'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No sold items found.</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Layout navigationPaths={navigationItems}>
      <PageMeta
        title="Profile | UniTrader"
        description="UniTrader is your friendly college-hood marketplace."
      />

      {/* Use imported Headers component */}

      <div className="section">
        <div className="container">
          <div className="profileContainer">
            <div className="headerWrapper">
              {/* Banner content (if any) goes here */}
            </div>
            <div className="colsContainer">
              {/* Left Column: Profile Info */}
              <div className="leftCol">
                <div className="imgContainer">
                  <img
                    src={profileData.avatar || '/images/content/avatar.png'}
                    alt={profileData.name || 'User Avatar'}
                  />
                  <span className="statusDot"></span>
                </div>
                <h2>{username}</h2>
                <p className="title">{profileData.title || 'Student'}</p>
                <p className="email">{profileData.email || 'No email provided'}</p>
                {rollNumber && (
                  <p className="rollNumber">Roll No: {rollNumber}</p>
                )}
              </div>
              {/* Right Column: Purchases and Sold Tabs */}
              <div className="rightCol">
                <nav>
                  <ul className="tabs">
                    {['purchases', 'sold'].map(tab => (
                      <li key={tab}>
                        <button
                          onClick={() => {
                            setActiveTab(tab)
                            if (tab === 'sold') handleSoldClick()
                          }}
                          className={activeTab === tab ? 'active' : ''}
                        >
                          {tab}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="pageFooter"></footer>
    </Layout>
  )
}

export default ProfilePage

export async function getServerSideProps() {
  // Initialize navigationItems with proper structure for Headers component
  const navigationItems = {
    logo: {
      imgix_url: '/cosmic.svg' // Default logo path, replace with actual path
    },
    menu: [
      { title: 'Find Products', url: '/search' },
      { title: 'Sell Items', url: '/upload-details' },
      { title: 'Chat', url: '/chat' },
    ]
  }
  
  return {
    props: { navigationItems },
  }
}