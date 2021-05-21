import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { useEffect } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import theme from '@src/theme'
import Nav from '@src/components/Nav'

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

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Nav />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

export default MyApp
