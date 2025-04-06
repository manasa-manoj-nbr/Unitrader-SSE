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
  const [activeTab, setActiveTab] = useState('sold')
  const [loading, setLoading] = useState(true)
  const [animateItems, setAnimateItems] = useState(false)
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
          setLoading(true)
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

          // Add slight delay before removing loading state for smooth animation
          setTimeout(() => {
            setLoading(false)
            // Trigger animation for gallery items
            setTimeout(() => {
              setAnimateItems(true)
            }, 100)
          }, 500)
        } catch (error) {
          console.error('Error fetching user data or cosmic items:', error)
          setLoading(false)
        }
      }
    }
    fetchUserData()
  }, [cosmicUser])

  // When tab is changed, animate items
  const handleTabChange = tab => {
    setAnimateItems(false)
    setActiveTab(tab)
    setTimeout(() => {
      setAnimateItems(true)
    }, 50)

    // If sold tab, fetch items
    if (tab === 'sold') {
      handleSoldClick()
    }
  }

  if (loading || !profileData) {
    return (
      <Layout navigationPaths={navigationItems}>
        <PageMeta
          title="Profile | UniTrader"
          description="UniTrader is your friendly college-hood marketplace."
        />
        <Headers navigation={navigationItems} />
        <div className="section">
          <div className="container">
            <div className="loading">Loading your profile...</div>
          </div>
        </div>
        <style jsx>{`
          .loading {
            color: white;
            text-align: center;
            padding: 60px;
            margin-top: 80px;
            font-size: 1.2rem;
            position: relative;
          }
          .loading:after {
            content: '';
            display: block;
            width: 40px;
            height: 40px;
            margin: 20px auto;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.2);
            border-top-color: #007bff;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </Layout>
    )
  }

  const rollNumber = computeRollNumber(profileData.email)
  const username = computeUsername(profileData.email)

  // When "sold" tab is clicked, re-fetch sold items
  const handleSoldClick = async () => {
    if (!rollNumber) {
      console.log('Roll number not available.')
      return
    }
    try {
      const soldItems = await getDataByRoll(rollNumber)
      console.log('Sold items for roll number', rollNumber, ':', soldItems)
      // Update state to refresh UI with animation
      setAnimateItems(false)
      setTimeout(() => {
        setProfileData(prev => ({ ...prev, sold: soldItems }))
        setAnimateItems(true)
      }, 50)
    } catch (error) {
      console.error('Error fetching sold items:', error)
    }
  }

  // Render tab content based on activeTab
  const renderContent = () => {
    switch (activeTab) {
      case 'sold':
        return (
          <div className={`galleries ${animateItems ? 'animate' : ''}`}>
            {profileData.sold && profileData.sold.length > 0 ? (
              profileData.sold.map((item, index) => (
                <div
                  key={index}
                  className="galleryItem"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                    animation: animateItems
                      ? `fadeIn 0.5s ease-out ${index * 0.1}s forwards`
                      : 'none',
                  }}
                >
                  <div className="imageContainer">
                    <img
                      src={
                        item.metadata?.image?.imgix_url ||
                        '/default-product.png'
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
              <p>
                No sold items found. Items you list for sale will appear here.
              </p>
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
        title={`${username || 'User'} Profile | UniTrader`}
        description="UniTrader is your friendly college-hood marketplace."
      />

      {/* Headers component is now handled by the Layout component */}
      {/* Removed the duplicate Headers component from here */}

      <div className="section">
        <div className="container">
          <div className="profileContainer">
            <div className="headerWrapper">
              {/* Animated banner content */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '30px',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  opacity: 0,
                  animation: 'fadeInLeft 1s ease-out 0.5s forwards',
                }}
              >
                {username ? `Welcome, ${username}` : 'Welcome back!'}
              </div>
              <style jsx>{`
                @keyframes fadeInLeft {
                  from {
                    opacity: 0;
                    transform: translate(-20px, -50%);
                  }
                  to {
                    opacity: 1;
                    transform: translate(0, -50%);
                  }
                }
              `}</style>
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
                <h2>{username || 'User'}</h2>
                <p className="title">{profileData.title || 'Student'}</p>
                <p className="email">
                  {profileData.email || 'No email provided'}
                </p>
                {rollNumber && (
                  <p className="rollNumber">Roll No: {rollNumber}</p>
                )}
              </div>
              {/* Right Column: Tabs + Content */}
              <div className="rightCol">
                <nav>
                  <ul className="tabs">
                    {['sold'].map(tab => (
                      <li key={tab}>
                        <button
                          onClick={() => handleTabChange(tab)}
                          className={activeTab === tab ? 'active' : ''}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
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

      <footer className="pageFooter">
        <p>© {new Date().getFullYear()} UniTrader - Your College Marketplace</p>
      </footer>
    </Layout>
  )
}

export default ProfilePage

export async function getServerSideProps() {
  // Initialize navigationItems with proper structure for Headers component
  const navigationItems = {
    logo: {
      imgix_url: '/cosmic.svg', // Default logo path, replace with actual path
    },
    menu: [
      { title: 'Find Products', url: '/search' },
      { title: 'Sell Items', url: '/upload-details' },
      { title: 'Chat', url: '/chat' },
    ],
  }

  return {
    props: { navigationItems },
  }
}
