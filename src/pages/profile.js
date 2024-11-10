import { useEffect, useState } from 'react'
import cn from 'classnames'
import styles from '../styles/pages/profile.module.sass'
import Layout from '../components/Layout'
import { PageMeta } from '../components/Meta'
import chooseBySlug from '../utils/chooseBySlug'
import { getAllDataByType } from '../lib/cosmic'

const DEFAULT_PROFILE_DATA = {
  name: 'Sanjay A',
  title: '2023BCS0020',
  email: 'sanjay23bcs20@iiitkottayam.ac.in',
  avatar: '/api/placeholder/120/120',
  stats: {
    followers: 4073,
    following: 322,
    attraction: 200543,
  },
  bio: 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aliquam erat volutpat. Morbi imperdiet, mauris ac auctor dictum, nisl ligula egestas nulla.',
  socialLinks: [
    { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
    { name: 'Pinterest', icon: 'fab fa-pinterest', url: '#' },
    { name: 'Facebook', icon: 'fab fa-facebook', url: '#' },
    { name: 'Dribbble', icon: 'fab fa-dribbble', url: '#' },
  ],
  purchases: [
    { id: 1, src: '/api/placeholder/400/300', alt: 'Photo 1' },
    { id: 2, src: '/api/placeholder/400/300', alt: 'Photo 2' },
    { id: 3, src: '/api/placeholder/400/300', alt: 'Photo 3' },
    { id: 4, src: '/api/placeholder/400/300', alt: 'Photo 4' },
    { id: 5, src: '/api/placeholder/400/300', alt: 'Photo 5' },
    { id: 6, src: '/api/placeholder/400/300', alt: 'Photo 6' },
  ],
  sold: [
    {
      id: 1,
      src: '/api/placeholder/400/300',
      alt: 'Gallery 1',
      title: 'Gallery Collection 1',
      count: 15,
    },
    {
      id: 2,
      src: '/api/placeholder/400/300',
      alt: 'Gallery 2',
      title: 'Gallery Collection 2',
      count: 23,
    },
    {
      id: 3,
      src: '/api/placeholder/400/300',
      alt: 'Gallery 3',
      title: 'Gallery Collection 3',
      count: 18,
    },
    {
      id: 4,
      src: '/api/placeholder/400/300',
      alt: 'Gallery 4',
      title: 'Gallery Collection 4',
      count: 27,
    },
  ],
}

const ProfilePage = ({
  profileData = DEFAULT_PROFILE_DATA,
  navigationItems,
  landing,
}) => {
  const [activeTab, setActiveTab] = useState('purchases')
  const infoAbout = chooseBySlug(landing, 'profile')

  const {
    name,
    title,
    email,
    avatar,
    stats,
    bio,
    socialLinks,
    purchases,
    sold,
  } = profileData

  const renderContent = () => {
    switch (activeTab) {
      case 'purchases':
        return (
          <div className={styles.photos}>
            {purchases.map(photo => (
              <div key={photo.id} className={styles.photoItem}>
                <img src={photo.src} alt={photo.alt} />
              </div>
            ))}
          </div>
        )
      case 'sold':
        return (
          <div className={styles.galleries}>
            {sold.map(gallery => (
              <div key={gallery.id} className={styles.galleryItem}>
                <img src={gallery.src} alt={gallery.alt} />
                <div className={styles.galleryInfo}>
                  <h3>{gallery.title}</h3>
                  <span>{gallery.count} Photos</span>
                </div>
              </div>
            ))}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <PageMeta
        title={'Profile | UniTrader'}
        description={'UniTrader is your friendly college-hood marketplace.'}
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.profileContainer}>
            <div className={styles.headerWrapper}>
              <header></header>
              <div className={styles.colsContainer}>
                {/* Left Column */}
                <div className={styles.leftCol}>
                  <div className={styles.imgContainer}>
                    <img src={avatar} alt={name} />
                    <span className={styles.statusDot}></span>
                  </div>
                  <h2>{name}</h2>
                  <p className={styles.title}>{title}</p>
                  <p className={styles.email}>{email}</p>

                  <ul className={styles.about}>
                    {Object.entries(stats).map(([key, value]) => (
                      <li key={key}>
                        <span>{value.toLocaleString()}</span>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </li>
                    ))}
                  </ul>

                  <div className={styles.content}>
                    <p>{bio}</p>
                    <ul className={styles.socialIcons}>
                      {socialLinks.map(link => (
                        <li key={link.name}>
                          <a href={link.url} aria-label={link.name}>
                            <i className={link.icon}></i>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column */}
                <div className={styles.rightCol}>
                  <nav>
                    <ul className={styles.tabs}>
                      {['purchases', 'sold'].map(tab => (
                        <li key={tab}>
                          <button
                            onClick={() => setActiveTab(tab)}
                            className={activeTab === tab ? styles.active : ''}
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
      </div>
    </Layout>
  )
}

export default ProfilePage

export async function getServerSideProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []
  return {
    props: { navigationItems },
  }
}
