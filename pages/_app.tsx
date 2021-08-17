import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { useEffect, useMemo } from 'react'
import '../styles/globals.css'
import Head from 'next/head'
import theme from '@src/theme'
import Nav from '@src/components/layout/Nav/Nav'
import { Provider, useDispatch, useSelector } from 'react-redux'
import store, { RootState } from '@src/redux/store'
import { useRouter } from 'next/router'
import axios from 'axios'
import { SnackbarProvider, useSnackbar } from 'notistack'
import Notification from '@src/components/layout/Notification/Notification'
import jwtDecode from '@src/utils/jwtDecode'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const pathname = useMemo(() => router.pathname, [router])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  useEffect(() => {
    axios.defaults.baseURL =
      process.env.NODE_ENV === 'development'
        ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
        : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
  }, [])
  const inAdminPage = useMemo(() => /admin/.test(pathname), [pathname])
  useEffect(() => {
    console.log('pathname', pathname)
    if (inAdminPage) {
      console.log('in admin page')
      const token = window.localStorage.getItem('token')
      if (token) {
        const decode = jwtDecode(token)
        console.log(decode)
      } else {
        router.push('/admin/login')
        store.dispatch(
          setNotification({
            message: 'You must log in first',
            type: NotificationTypes.ERROR,
          })
        )
      }
    }
  }, [pathname])

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
          <SnackbarProvider>
            <Notification />
            {/admin/.test(pathname) ? null : <Nav />}
            <Component {...pageProps} />
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default MyApp
