import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { useEffect, useMemo } from 'react'
import Head from 'next/head'
import theme from '@src/theme'
import { Provider, connect, useSelector } from 'react-redux'
import store, { RootState } from '@src/redux/store'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import Notification from '@src/components/common/Notification'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import dynamic from 'next/dynamic'
import NavigationLayout from '@src/components/layout/NavigationLayout'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser, setUser } from '@src/redux/data/userSlice'
import { ThemeProvider } from '@material-ui/styles'
import LoadingScreen from '@src/components/screens/LoadingScreen'

const Login = dynamic(() => import(`@src/components/pages/login`))

/**
 * sets axios defaults
 */
axiosDefaults()
function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const pathname = useMemo(() => router.pathname, [router])

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const user = useSelector((state: RootState) => state.user)
  // const { user } = store.getState()

  const isAuthenticated = useMemo(() => !!user?.data.user_id, [user])
  useEffect(() => {
    /**
     * Fetch fresh details if there might be changes
     */
    if (user?.data.user_id) {
      store.dispatch(getUser())
    }
    /**
     * Check for expiration
     */
    if (user?.metadata.exp < Math.floor(Date.now() / 1000)) {
      store.dispatch(
        setNotification({
          message: `User session expired, please relogin`,
          type: NotificationTypes.WARNING,
        })
      )
      store.dispatch(setUser(null))
    }
  }, [])
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      {/* <Provider store={store}> */}
      <ThemeProvider
        theme={{
          ...theme({
            prefersDarkMode: prefersDark,
          }),
        }}
      >
        <CssBaseline />
        <SnackbarProvider>
          <Notification />
          {isAuthenticated ? (
            <NavigationLayout>
              <Component {...pageProps} />
            </NavigationLayout>
          ) : (
            <Login />
          )}
        </SnackbarProvider>
      </ThemeProvider>
      {/* </Provider> */}
    </>
  )
}

function WrappedMyAppWithReduxProvider({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MyApp Component={Component} pageProps={pageProps} />
    </Provider>
  )
}
export default WrappedMyAppWithReduxProvider
