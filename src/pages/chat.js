import dynamic from 'next/dynamic'
import { useEffect } from 'react'

const CometChatNoSSR = dynamic(() => import('../components/chat/index'), {
  ssr: false,
})

import React from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import { useStateContext } from '../utils/context/StateContext'
import Layout from '../components/Layout'
import Image from 'next/image'
import chooseBySlug from '../utils/chooseBySlug'
import { getAllDataByType } from '../lib/cosmic'

import styles from '../styles/pages/NotFound.module.sass'
import { PageMeta } from '../components/Meta'

const AboutUs = ({ navigationItems, landing }) => {
  const infoAbout = chooseBySlug(landing, 'about')
  useEffect(() => {
    window.CometChat = require('@cometchat/chat-sdk-javascript').CometChat
  })

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <PageMeta
        title={'Chat | UniTrader'}
        description={'UniTrader is your friendly college-hood marketplace.'}
      />
      <div className={cn('section', styles.section)} style={{ paddingBottom: 0 }}>
        <CometChatNoSSR />
        <div className={cn('container', styles.container)}></div>
      </div>
    </Layout>
  )
}

export default AboutUs

export async function getServerSideProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []
  const landing = (await getAllDataByType('landings')) || []

  return {
    props: { navigationItems, landing },
  }
}
