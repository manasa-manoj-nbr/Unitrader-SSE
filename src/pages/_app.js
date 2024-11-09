import { Toaster } from 'react-hot-toast'
import { StateContext } from '../utils/context/StateContext'
import NextProgress from "next-progress"

import '../styles/app.sass'

function MyApp({ Component, pageProps }) {
  return (
    <StateContext>
       <NextProgress delay={300} options={{ showSpinner: true }} />
      <Toaster />
      <Component {...pageProps} />
    </StateContext>
  )
}

export default MyApp
