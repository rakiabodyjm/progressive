import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import theme from '@src/theme'
import { Provider, connect, useSelector, useDispatch } from 'react-redux'
import store, { RootState } from '@src/redux/store'
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import Notification from '@src/components/common/Notification'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import dynamic from 'next/dynamic'
import NavigationLayout from '@src/components/layout/NavigationLayout'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser, logoutUser, setUser } from '@src/redux/data/userSlice'
import { ThemeProvider } from '@material-ui/styles'
import { ColorSchemeTypes, setColorScheme } from '@src/redux/data/colorSchemeSlice'

const Login = dynamic(() => import(`@src/components/pages/login`))

/**
 * sets axios defaults
 */
axiosDefaults()
function MyApp({ Component, pageProps }: { Component: AppProps['Component']; pageProps: any }) {
  const router = useRouter()
  const pathname = useMemo(() => router.pathname, [router])
  const dispatch = useDispatch()

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  const user = useSelector((state: RootState) => state.user)
  // const { user } = store.getState()

  // const isAuthenticated = useMemo(() => !!user?.data.user_id, [user])
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  useEffect(() => {
    if (user?.data.user_id) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
    }
  }, [user])

  const isExpired = (exp: number): boolean => exp > Math.floor(Date.now() / 1000)
  useEffect(() => {
    /**
     * Fetch fresh details if there might be changes
     */
    if (user?.data.user_id) {
      dispatch(getUser())
    }
    /**
     * Check for expiration
     */
    if (user) {
      if (!isExpired(user.metadata.exp)) {
        dispatch(
          setNotification({
            message: `User session expired, please relogin`,
            type: NotificationTypes.WARNING,
          })
        )
        dispatch(logoutUser())
      }
    }
  }, [])

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  useEffect(() => {
    dispatch(setColorScheme(prefersDark ? ColorSchemeTypes.DARK : ColorSchemeTypes.LIGHT))
  }, [prefersDark])

  const colorScheme = useSelector(
    (state: RootState) => state.colorScheme === ColorSchemeTypes.DARK || false
  )

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
            prefersDarkMode: colorScheme,
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

function WrappedAppWithRedux({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MyApp Component={Component} pageProps={pageProps} />
    </Provider>
  )
}
export default WrappedAppWithRedux
