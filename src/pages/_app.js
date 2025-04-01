import { Toaster } from 'react-hot-toast'
import { StateContext } from '../utils/context/StateContext'
import NextProgress from "next-progress"

import '../styles/app.sass'
import './profile.css'
function MyApp({ Component, pageProps }) {
  return (
    
    <StateContext>
      <NextProgress delay={300} options={{ showSpinner: true }} />
      <Toaster />
      {typeof window !== 'undefined' && <Component {...pageProps} />}
    </StateContext>
  )
}

export default MyApp
