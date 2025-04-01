import { Toaster } from 'react-hot-toast'
import { StateContext } from '../utils/context/StateContext'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import '../styles/app.sass'
import './profile.css'

const NextProgress = dynamic(() => import('next-progress'), { ssr: false })

function MyApp({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <StateContext>
      {isClient && <NextProgress delay={300} options={{ showSpinner: true }} />}
      <Toaster />
      {isClient && <Component {...pageProps} />}
    </StateContext>
  )
}

export default MyApp
