import React, { useState, useEffect } from 'react'
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

const ProfilePage = ({ navigationItems }) => {
  const { cosmicUser } = useStateContext()
  const [profileData, setProfileData] = useState(null)
  const [activeTab, setActiveTab] = useState('purchases')
  const infoAbout = chooseBySlug(null, 'profile')

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
        <div className="loading">Loading profile...</div>
        <style jsx>{`
          .loading {
            color: white;
            text-align: center;
            padding: 20px;
          }
        `}</style>
      </Layout>
    )
  }

  const rollNumber = computeRollNumber(profileData.email)

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
                  <img
                    src={
                      item.metadata?.image?.imgix_url || '/default-avatar.png'
                    }
                    alt={item.title}
                  />
                  <div className="galleryInfo">
                    <h3>{item.title}</h3>
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

      {/* Inline Navbar */}
      <header className="navbar">
        <nav className="navLinks">
          <ul>
            <li>
              <a href="/search?category=&color=Any+mode">Find Products</a>
            </li>
            <li>
              <a href="/upload-details">Sell Items</a>
            </li>
            <li>
              <a href="/chat">Chat</a>
            </li>
            <li>
              <a href="/profile">Profile</a>
            </li>
          </ul>
        </nav>
      </header>

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
                    src={profileData.avatar || '/default-avatar.png'}
                    alt={profileData.name}
                  />
                  <span className="statusDot"></span>
                </div>
                <h2>{profileData.name}</h2>
                <p className="title">{profileData.title}</p>
                <p className="email">{profileData.email}</p>
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

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

        :global(body) {
          margin: 0;
          padding: 0;
          background: #000;
          color: #eee;
          font-family: 'Montserrat', sans-serif;
        }

        /* Navbar */
        .navbar {
          position: fixed;
          top: 0;
          width: 100%;
          background: linear-gradient(90deg, #222 0%, #111 100%);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          z-index: 1000;
          box-shadow: 0 2px 5px rgba(255, 255, 255, 0.1);
        }
        .navLinks ul {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .navLinks li {
          padding-right: 10px;
        }
        .navLinks li + li::before {
          content: '|';
          color: #aaa;
          margin: 0 10px 0 0;
        }
        .navLinks a {
          color: #ccc;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          padding: 5px 0;
          transition: color 0.3s ease;
        }
        .navLinks a:hover {
          color: #fff;
        }
        /* Main Section */
        .section {
          margin-top: 60px;
          padding: 0;
          min-height: 100vh;
          background: #000;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        /* Profile Container */
        .profileContainer {
          position: relative;
          margin-top: 40px;
        }
        /* Banner / Header */
        .headerWrapper {
          width: 100%;
          height: 200px;
          background: linear-gradient(135deg, #005bea, #00c6fb);
          border-radius: 10px;
          margin-bottom: 40px;
        }
        /* Columns */
        .colsContainer {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-top: -100px;
        }
        /* Left Column (Profile Info) */
        .leftCol {
          background: #111;
          border-radius: 12px;
          width: 300px;
          min-width: 280px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        .imgContainer {
          position: relative;
          width: 120px;
          height: 120px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          background: #333;
          border: 3px solid #007bff;
        }
        .imgContainer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .statusDot {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 15px;
          height: 15px;
          background: #3ee37f;
          border: 2px solid #111;
          border-radius: 50%;
        }
        .leftCol h2 {
          margin-top: 15px;
          font-size: 1.6rem;
          font-weight: 700;
        }
        .title,
        .email {
          font-size: 0.95rem;
          color: #bbb;
          margin-bottom: 5px;
        }
        .rollNumber {
          font-size: 1rem;
          color: #ffcc00;
          margin: 10px 0;
          font-weight: bold;
        }
        /* Right Column (Tabs + Content) */
        .rightCol {
          flex: 1;
          background: #111;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        nav {
          margin-bottom: 20px;
        }
        .tabs {
          display: flex;
          gap: 30px;
          list-style: none;
          padding: 0;
          border-bottom: 1px solid #444;
        }
        .tabs li {
          margin: 0;
        }
        .tabs li button {
          background: none;
          border: none;
          color: #888;
          font-size: 1rem;
          cursor: pointer;
          padding: 10px 0;
          outline: none;
          transition: color 0.3s ease;
          position: relative;
        }
        .tabs li button.active {
          color: #fff;
          font-weight: 600;
        }
        .tabs li button.active::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 2px;
          background: #007bff;
          left: 0;
          bottom: -1px;
        }
        .tabs li button:hover {
          color: #fff;
        }
        /* Purchases / Photos Grid */
        .photos {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 20px;
        }
        .photoItem {
          background: #222;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .photoItem img {
          width: 100%;
          height: auto;
          display: block;
        }
        .photoItem:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
        }
        /* Sold / Galleries */
        .galleries {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .galleryItem {
          position: relative;
          background: #222;
          border-radius: 8px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .galleryItem img {
          width: 100%;
          height: 150px;
          object-fit: cover;
          display: block;
        }
        .galleryInfo {
          padding: 10px;
        }
        .galleryInfo h3 {
          margin: 0 0 5px;
          font-size: 1.1rem;
        }
        /* Footer */
        .pageFooter {
          text-align: center;
          padding: 15px 0;
          background: #111;
          color: #fff;
          font-size: 0.9rem;
          margin-top: 40px;
        }
        @media (max-width: 768px) {
          .colsContainer {
            flex-direction: column;
            margin-top: 0;
          }
          .leftCol {
            margin-bottom: 20px;
          }
          .navbar {
            padding: 10px;
          }
          .navLinks a {
            margin: 0 10px;
          }
        }
      `}</style>
    </Layout>
  )
}

export default ProfilePage

export async function getServerSideProps() {
  const navigationItems = [] // Replace with navigation data if available
  return {
    props: { navigationItems },
  }
}
