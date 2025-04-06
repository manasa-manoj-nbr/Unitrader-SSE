import React, { useState, useCallback, useEffect } from 'react'
import cn from 'classnames'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useStateContext } from '../utils/context/StateContext'
import Layout from '../components/Layout'
import Dropdown from '../components/Dropdown'
import Icon from '../components/Icon'
import TextInput from '../components/TextInput'
import Loader from '../components/Loader'
import Modal from '../components/Modal'
import OAuth from '../components/OAuth'
import Preview from '../screens/UploadDetails/Preview'
import Cards from '../screens/UploadDetails/Cards'
import { getAllDataByType } from '../lib/cosmic'
import { OPTIONS } from '../utils/constants/appConstants'
import createFields from '../utils/constants/createFields'
import { getToken } from '../utils/token'
import styles from '../styles/pages/UploadDetails.module.sass'
import { PageMeta } from '../components/Meta'

const Upload = ({ navigationItems, categoriesType }) => {
  const { categories, navigation, cosmicUser } = useStateContext()
  const { push } = useRouter()

  const [color, setColor] = useState(OPTIONS[1])
  const [uploadMedia, setUploadMedia] = useState('')
  const [uploadFile, setUploadFile] = useState('')
  const [chooseCategory, setChooseCategory] = useState('')
  const [fillFiledMessage, setFillFiledMessage] = useState(false)

  // Add 'phone_number' field to the state along with the others.
  const [{ title, count, description, price, seller, phone_number }, setFields] = useState(
    () => ({
      ...createFields,
      seller: '',
      phone_number: '',
    })
  )

  // State for validation errors
  const [countError, setCountError] = useState('')
  const [priceError, setPriceError] = useState('')
  const [phoneNumberError, setPhoneNumberError] = useState('')

  const [visibleAuthModal, setVisibleAuthModal] = useState(false)
  const [visiblePreview, setVisiblePreview] = useState(false)

  useEffect(() => {
    let isMounted = true
    const uNFTUser = getToken()

    if (
      isMounted &&
      !cosmicUser?.hasOwnProperty('id') &&
      !uNFTUser?.hasOwnProperty('id')
    ) {
      setVisibleAuthModal(true)
    }

    return () => {
      isMounted = false
    }
  }, [cosmicUser])

  const handleUploadFile = async file => {
    const formData = new FormData()
    formData.append('file', file)

    const uploadResult = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    const mediaData = await uploadResult.json()
    setUploadMedia(mediaData?.['media'])
  }

  const handleOAuth = useCallback(
    async user => {
      if (!cosmicUser.hasOwnProperty('id')) {
        setVisibleAuthModal(true)
      }
      if (!user || !user.hasOwnProperty('id')) return
      if (user && uploadFile) await handleUploadFile(uploadFile)
    },
    [cosmicUser, uploadFile]
  )

  const handleUpload = async e => {
    const file = e.target.files[0]
    setUploadFile(file)
    cosmicUser?.hasOwnProperty('id') ? handleUploadFile(file) : handleOAuth()
  }

  // Validate fields and update state. Includes validation for the phone_number.
  const handleChange = ({ target: { name, value } }) => {
    if (name === 'count') {
      const numericValue = parseInt(value, 10)
      if (isNaN(numericValue) || numericValue <= 0) {
        setCountError('Count must be greater than 0')
      } else {
        setCountError('')
      }
    }
    if (name === 'price') {
      const numericValue = parseFloat(value)
      if (isNaN(numericValue) || numericValue < 0) {
        setPriceError('Price cannot be negative')
      } else {
        setPriceError('')
      }
    }
    if (name === 'phone_number') {
      // Regex: optional '+' followed by 10 to 15 digits.
      const pattern = /^\+?\d{10,15}$/
      if (!pattern.test(value)) {
        setPhoneNumberError('Please enter a valid phone number')
      } else {
        setPhoneNumberError('')
      }
    }
    setFields(prevFields => ({
      ...prevFields,
      [name]: value,
    }))
  }

  const handleChooseCategory = useCallback(index => {
    setChooseCategory(index)
  }, [])

  // Check if all required fields are filled to show the preview.
  const previewForm = useCallback(() => {
    if (title && count && price && seller && uploadMedia && phone_number && !phoneNumberError) {
      if (fillFiledMessage) setFillFiledMessage(false)
      setVisiblePreview(true)
    } else {
      setFillFiledMessage(true)
    }
  }, [title, count, price, seller, uploadMedia, phone_number, phoneNumberError, fillFiledMessage])

  const submitForm = useCallback(
    async e => {
      e.preventDefault()

      // Validate count and price
      const numericCount = parseInt(count, 10)
      if (isNaN(numericCount) || numericCount <= 0) {
        toast.error('Count should be greater than 0')
        return
      }
      const numericPrice = parseFloat(price)
      if (isNaN(numericPrice) || numericPrice < 0) {
        toast.error('Price cannot be negative')
        return
      }

      // Check for user authentication before handling upload
      if (!cosmicUser.hasOwnProperty('id')) {
        handleOAuth()
      }
      const user = localStorage.getItem('uNFT-user')
      if (user) {
        const cosmicUserLocal = JSON.parse(user)
        if (cosmicUserLocal?.hasOwnProperty('roll_number')) {
          seller = cosmicUserLocal?.roll_number
          console.log('Seller Roll Number:', seller)
        }
      }

      if (
        cosmicUser &&
        title &&
        color &&
        count &&
        price &&
        seller &&
        uploadMedia &&
        phone_number &&
        !phoneNumberError
      ) {
        if (fillFiledMessage) setFillFiledMessage(false)

        const response = await fetch('/api/create', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            price,
            count,
            color,
            categories: [chooseCategory],
            image: uploadMedia['name'],
            auction: false,
            seller,
            phone_number: parseInt(phone_number, 10),
          }),
        })

        const createdItem = await response.json()

        if (createdItem['object']) {
          toast.success(
            `Successfully created ${createdItem['object']['title']} item`,
            {
              position: 'bottom-right',
            }
          )

          push(`item/${createdItem['object']['slug']}`)
        }
      } else {
        setFillFiledMessage(true)
      }
    },
    [
      chooseCategory,
      color,
      cosmicUser,
      count,
      description,
      fillFiledMessage,
      handleOAuth,
      price,
      push,
      seller,
      title,
      uploadMedia,
      phone_number,
      phoneNumberError,
    ]
  )

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata || navigation}>
      <PageMeta
        title={'Create Item | UniTrader'}
        description={'UniTrader is your friendly college-hood marketplace.'}
      />
      <div className={cn('section', styles.section)}>
        <div className={cn('container', styles.container)}>
          <div className={styles.wrapper}>
            <div className={styles.head}>
              <div className={cn('h2', styles.title)}>Create an item</div>
            </div>
            <form className={styles.form} onSubmit={submitForm}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Upload file</div>
                  <div className={styles.note}>
                    Drag or choose your file to upload
                  </div>
                  <div className={styles.file}>
                    <input
                      className={styles.load}
                      type="file"
                      onChange={handleUpload}
                    />
                    <div className={styles.icon}>
                      <Icon name="upload-file" size="24" />
                    </div>
                    <div className={styles.format}>Upload images or videos</div>
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Item Details</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="Item title"
                      name="title"
                      type="text"
                      placeholder="e.g. Readable Title"
                      onChange={handleChange}
                      value={title}
                      required
                    />
                    <TextInput
                      className={styles.field}
                      label="Description"
                      name="description"
                      type="text"
                      placeholder="e.g. Description"
                      onChange={handleChange}
                      value={description}
                      required
                    />
                    {/*
                    // Seller (Roll Number) Field can be read-only if needed.
                    <TextInput
                      className={styles.field}
                      label="Seller Roll Number"
                      name="seller"
                      type="text"
                      placeholder="e.g. 2023BCY0002"
                      onChange={handleChange}
                      value={localStorage.getItem('uNFT-user')?.roll_number || ''}
                      readOnly 
                      required
                    />
                    */}
                    <TextInput
                      className={styles.field}
                      label="WhatsApp Number"
                      name="phone_number"
                      type="text"
                      placeholder="e.g. +919876543210"
                      onChange={handleChange}
                      value={phone_number}
                      required
                    />
                    {phoneNumberError && (
                      <div style={{ color: 'red', fontSize: '0.9rem' }}>
                        {phoneNumberError}
                      </div>
                    )}
                    <div className={styles.row}>
                      <div className={styles.col}>
                        <div className={styles.field}>
                          <div className={styles.label}>Trade Type</div>
                          <Dropdown
                            className={styles.dropdown}
                            value={color}
                            setValue={setColor}
                            options={OPTIONS}
                          />
                        </div>
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Price"
                          name="price"
                          type="number"
                          placeholder="e.g. Price"
                          onChange={handleChange}
                          value={price}
                          required
                          min={0}
                        />
                        {priceError && (
                          <div style={{ color: 'red', fontSize: '0.9rem' }}>
                            {priceError}
                          </div>
                        )}
                      </div>
                      <div className={styles.col}>
                        <TextInput
                          className={styles.field}
                          label="Count"
                          name="count"
                          type="number"
                          placeholder="e.g. Count"
                          onChange={handleChange}
                          value={count}
                          required
                          min={1}
                        />
                        {countError && (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '0.9rem',
                              marginTop: '0.5rem',
                            }}
                          >
                            {countError}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.options}>
                <div className={styles.category}>Choose category</div>
                <div className={styles.text}>Choose an existing category</div>
                <Cards
                  className={styles.cards}
                  category={chooseCategory}
                  handleChoose={handleChooseCategory}
                  items={categoriesType || categories['type']}
                />
              </div>
              <div className={styles.foot}>
                <button
                  className={cn('button-stroke tablet-show', styles.button)}
                  onClick={previewForm}
                  type="button"
                >
                  Preview
                </button>
                <button className={cn('button', styles.button)} type="submit">
                  <span>Create item</span>
                  <Icon name="arrow-next" size="10" />
                </button>
                {fillFiledMessage && (
                  <div className={styles.saving}>
                    <span>Please fill all fields</span>
                    <Loader className={styles.loader} />
                  </div>
                )}
              </div>
            </form>
          </div>
          <Preview
            className={cn(styles.preview, { [styles.active]: visiblePreview })}
            info={{ title, color, count, description, price, seller, phone_number }}
            image={uploadMedia?.['imgix_url']}
            onClose={() => setVisiblePreview(false)}
          />
        </div>
      </div>
      <Modal
        visible={visibleAuthModal}
        disable={!cosmicUser?.hasOwnProperty('id')}
        onClose={() => setVisibleAuthModal(false)}
      >
        <OAuth
          className={styles.steps}
          handleOAuth={handleOAuth}
          handleClose={() => setVisibleAuthModal(false)}
          disable={!cosmicUser?.hasOwnProperty('id')}
        />
      </Modal>
    </Layout>
  )
}

export default Upload

export async function getServerSideProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []
  const categoryTypes = (await getAllDataByType('categories')) || []

  const categoriesType = categoryTypes?.reduce((arr, { title, id }) => {
    return { ...arr, [id]: title }
  }, {})

  return {
    props: { navigationItems, categoriesType },
  }
}
