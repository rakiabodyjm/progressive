import '../styles/globals.css'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import { useEffect, useMemo } from 'react'
import Head from 'next/head'
import theme from '@src/theme'
import { Provider } from 'react-redux'
import store from '@src/redux/store'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import Notification from '@src/components/common/Notification'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import dynamic from 'next/dynamic'
import NavigationLayout from '@src/components/layout/NavigationLayout'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
const Login = dynamic(() => import(`@src/components/pages/login`))

/**
 * sets axios defaults
 */
axiosDefaults()
function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const pathname = useMemo(() => router.pathname, [router])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const { user } = store.getState()

  const isAuthenticated = useMemo(() => !!user?.data.user_id, [user])
  useEffect(() => {
    if (user?.metadata.exp < Math.floor(Date.now() / 1000)) {
      console.log('user session expired')
      store.dispatch(
        setNotification({
          message: `User session expired`,
          type: NotificationTypes.WARNING,
        })
      )
    }
  }, [user])
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
            <NavigationLayout>
              {isAuthenticated ? <Component {...pageProps} /> : <Login />}
            </NavigationLayout>
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </>
  )
}

export default MyApp
