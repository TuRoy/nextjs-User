import '@/styles/globals.css'
// import type { AppProps } from 'next/app'

import { wrapper } from '@/saga/store'

 function App({ Component, pageProps }: any) {
  return <Component {...pageProps} />
}
export default wrapper.withRedux(App)
