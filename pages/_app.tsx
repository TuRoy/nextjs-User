import '@/styles/globals.css'
import { wrapper } from '@/saga/store'

 function App({ Component, pageProps }: any) {
  return <Component {...pageProps} />
}
export default wrapper.withRedux(App)
