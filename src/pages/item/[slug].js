import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import toast from 'react-hot-toast'
import { useStateContext } from '../../utils/context/StateContext'
import Layout from '../../components/Layout'
import HotBid from '../../components/HotBid'
import Discover from '../../screens/Home/Discover'
import Dropdown from '../../components/Dropdown'
import Modal from '../../components/Modal'
import OAuth from '../../components/OAuth'
import Image from '../../components/Image'
import TextInput from '../../components/TextInput'
import {
  getDataBySlug,
  getAllDataByType,
  getDataByCategory,
} from '../../lib/cosmic'
import getStripe from '../../lib/getStripe'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { FaWhatsapp } from 'react-icons/fa'

import styles from '../../styles/pages/Item.module.sass'

const Item = ({ itemInfo, categoriesGroup, navigationItems }) => {
  const { onAdd, cartItems, cosmicUser } = useStateContext()
  const router = useRouter()
  const { push } = router

  // Retrieve receiver identifier from query (e.g. a roll number or name)
  const { name: rawItemName } = router.query

  // Once the router is ready, print sender's roll number, receiver's roll number,
  // and fetch the logged-in user's email from Firestore.
  useEffect(() => {
    if (router.isReady) {
      const senderRoll = cosmicUser?.rollNumber || '2023BCY0001'
      console.log('Sender Roll Number:', senderRoll)
      console.log('Receiver Roll Number:', rawItemName)

      // Fetch the logged-in user's email from Firestore using cosmicUser.uid
      if (cosmicUser?.uid) {
        const userRef = doc(db, 'users', cosmicUser.uid)
        getDoc(userRef)
          .then(docSnap => {
            if (docSnap.exists()) {
              const userData = docSnap.data()
              console.log(
                "Logged-in user's email from Firestore:",
                userData.email
              )
            } else {
              console.log('No user document found in Firestore for this uid.')
            }
          })
          .catch(error => {
            console.error('Error fetching user doc:', error)
          })
      } else {
        console.log('No cosmicUser.uid available to fetch user email.')
      }
    }
  }, [router.isReady, cosmicUser, rawItemName])

  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleAuthModal, setVisibleAuthModal] = useState(false)
  const [price, setPrice] = useState(0)
  const [showReportModal, setShowReportModal] = useState(false)

  // Convert metadata.count to an integer and only create an array if it's > 0.
  const countValue = parseInt(itemInfo?.[0]?.metadata?.count, 10)
  const counts =
    countValue > 0
      ? Array.from({ length: countValue }, (_, index) => index + 1)
      : ['Not Available']

  const [option, setOption] = useState(counts[0])

  const chatWithBuyer = () => {
    push(
      `/chat?name=${itemInfo[0]?.title}&pic=${itemInfo[0]?.metadata?.image?.imgix_url}`
    )
  }
  console.log('hello')
  const handleAddToCart = () => {
    cosmicUser?.hasOwnProperty('id') ? handleCheckout() : handleOAuth()
  }

  const handleOAuth = useCallback(
    async user => {
      if (!cosmicUser?.hasOwnProperty('id')) {
        setVisibleAuthModal(true)
      }
      if (!user || !user?.hasOwnProperty('id')) return
    },
    [cosmicUser]
  )

  const handleCheckout = async () => {
    let oldCart = await onAdd(itemInfo[0], option)
    if ((itemInfo[0]?.metadata?.color || '').toLowerCase() === 'auction') {
      oldCart[0].metadata.price = price
    }
    const addCart = oldCart
    console.log(addCart)

    if (addCart?.length) {
      const stripe = await getStripe()
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addCart),
      })

      if (response.statusCode === 500) return

      const data = await response.json()
      toast.loading('Redirecting...', { position: 'bottom-right' })
      console.log(data)
      stripe.redirectToCheckout({ sessionId: data.id })
    }
  }

  const PriceDisplay = () => {
    const colorValue = (itemInfo[0]?.metadata?.color || '').toLowerCase()
    const isAuction = colorValue === 'auction'
    return (
      <span className={cn(styles.price, 'flex items-center gap-2')}>
        <span>₹ {itemInfo[0]?.metadata?.price}</span>
        {isAuction && (
          <>
            <style>
              {`
                @keyframes fadeInOut {
                  0%, 100% { opacity: 1; }
                  50% { opacity: 0; }
                }
                .fade {
                  animation: fadeInOut 1s infinite;
                }
              `}
            </style>
            <span className="fade" style={{ color: 'red', marginLeft: '4px' }}>
              LIVE
            </span>
          </>
        )}
      </span>
    )
  }

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.bg}>
            <div className={styles.preview}>
              <div className={styles.categories}>
                <div className={cn('status-purple', styles.category)}>
                  {itemInfo[0]?.metadata?.color}
                </div>
              </div>
              <div
                className={styles.image}
                onClick={() => {
                  const imageDetails = itemInfo[0]?.metadata?.image
                  if (imageDetails) {
                    console.log('Image details:', imageDetails)
                  } else {
                    console.log('Unable to fetch')
                  }
                }}
              >
                <Image
                  size={{ width: '100%', height: '100%' }}
                  srcSet={`${itemInfo[0]?.metadata?.image?.imgix_url}`}
                  src={itemInfo[0]?.metadata?.image?.imgix_url}
                  alt="Item"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
          <div className={styles.details}>
            <div
              className={styles.nav}
              style={{ display: 'flex', justifyContent: 'center' }}
            >
              {itemInfo[0]?.metadata?.phone_number && (
                <a
                  href={`https://wa.me/+91${itemInfo[0].metadata.phone_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(styles.link)}
                  style={{
                    color: '#25D366',
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <img
                    src="/images/content/whatsapp.png"
                    alt="WhatsApp"
                    width={28}
                    height={20}
                  />

                  <span>Contact via WhatsApp</span>
                </a>
              )}
            </div>

            <h1 className={cn('h3', styles.title)}>{itemInfo[0]?.title}</h1>
            <div className={styles.cost}>
              <PriceDisplay />
              <div className={styles.counter}>
                {itemInfo[0]?.metadata?.count > 0
                  ? `${itemInfo[0]?.metadata?.count} in stock`
                  : 'Not Available'}
              </div>
            </div>
            <div className={styles.info}>
              {itemInfo[0]?.metadata?.description}
            </div>

            <div className={styles.actions}>
              <div className={styles.dropdown}>
                <Dropdown
                  className={styles.dropdown}
                  value={option}
                  setValue={setOption}
                  options={counts}
                />
              </div>
              <div className={styles.btns}>
                {(itemInfo[0]?.metadata?.color || '').toLowerCase() ===
                  'auction' && (
                  <div className={styles.col}>
                    <TextInput
                      className={styles.field}
                      label="Price"
                      name="price"
                      type="text"
                      placeholder="Place Higher Bid"
                      onChange={e => {
                        setPrice(e.target.value)
                        console.log(option)
                      }}
                      required
                    />
                  </div>
                )}
                <button
                  className={cn('button', styles.button)}
                  onClick={
                    itemInfo[0]?.metadata?.price < price ||
                    (itemInfo[0]?.metadata?.color || '').toLowerCase() !==
                      'auction'
                      ? handleAddToCart
                      : null
                  }
                >
                  {(itemInfo[0]?.metadata?.color || '').toLowerCase() ===
                  'auction'
                    ? 'Place Bid'
                    : 'Buy Now'}
                </button>
              </div>
            </div>
            <br />
            <span
              style={{ color: 'red', cursor: 'pointer', textAlign: 'right' }}
              onClick={() => setShowReportModal(true)}
            ></span>
          </div>
        </div>
      </div>
      <Modal
        visible={visibleAuthModal}
        onClose={() => setVisibleAuthModal(false)}
      >
        <OAuth
          className={styles.steps}
          handleOAuth={handleOAuth}
          handleClose={() => setVisibleAuthModal(false)}
        />
      </Modal>
      <Modal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
      >
        <div className={styles.reportModalContent}>
          <h3>Confirm Report</h3>
          <p>Are you sure you want to report this item?</p>
          <button
            className={cn('button', styles.confirmButton)}
            onClick={() => setShowReportModal(false)}
          >
            Confirm
          </button>
          <button
            style={{ marginLeft: '10px', color: 'red' }}
            onClick={() => setShowReportModal(false)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </Layout>
  )
}

export default Item

export async function getServerSideProps({ params }) {
  const itemInfo = await getDataBySlug(params.slug)
  const navigationItems = (await getAllDataByType('navigation')) || []
  const categoryTypes = (await getAllDataByType('categories')) || []
  const categoriesData = await Promise.all(
    categoryTypes?.map(category => getDataByCategory(category?.id))
  )
  const categoriesGroups = categoryTypes?.map(({ id }, index) => ({
    [id]: categoriesData[index],
  }))
  const categoriesType = categoryTypes?.reduce(
    (arr, { title, id }) => ({ ...arr, [id]: title }),
    {}
  )
  const categoriesGroup = { groups: categoriesGroups, type: categoriesType }

  if (!itemInfo) {
    return { notFound: true }
  }

  return { props: { itemInfo, navigationItems, categoriesGroup } }
}
