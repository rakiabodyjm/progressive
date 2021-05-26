import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import theme from '@src/theme'
import Nav from '@src/components/Nav'
import { Provider } from 'react-redux'
import store from '@src/redux/store'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  })
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Nav />
          <Component {...pageProps} />
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default MyApp
