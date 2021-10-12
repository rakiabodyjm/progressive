import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import theme from '@src/theme'
import { Provider, useSelector, useDispatch } from 'react-redux'
import store, { RootState } from '@src/redux/store'
import { SnackbarProvider } from 'notistack'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import Notification from '@src/components/common/Notification'
import { AppProps } from 'next/dist/next-server/lib/router/router'
import dynamic from 'next/dynamic'
import NavigationLayout from '@src/components/layout/NavigationLayout'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser, logoutUser } from '@src/redux/data/userSlice'
import { ThemeProvider } from '@material-ui/styles'
import { ColorSchemeTypes, setColorScheme } from '@src/redux/data/colorSchemeSlice'
import { useRouter } from 'next/router'

const Login = dynamic(() => import(`@src/components/pages/login`))

/**
 * sets axios defaults
 */
axiosDefaults()
function MyApp({ Component, pageProps }: { Component: AppProps['Component']; pageProps: any }) {
  const router = useRouter()
  const { pathname } = router
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const dispatch = useDispatch()

  /**
   * set  color scheme according to device
   */

  useEffect(() => {
    dispatch(setColorScheme(prefersDark ? ColorSchemeTypes.DARK : ColorSchemeTypes.LIGHT))
  }, [prefersDark])

  const user = useSelector((state: RootState) => state.user)
  const isAuthenticated = useMemo<boolean>(() => !!user?.data.user_id, [user])
  const isAuthExpired = useMemo<boolean>(() => {
    console.log('checking for authentication expiration')
    if (isAuthenticated && user) {
      if (user?.metadata.exp < Date.now() / 1000) {
        return true
      }
      return false
    }
    return true
  }, [isAuthenticated, user, pathname])

  useEffect(() => {
    if (isAuthenticated && isAuthExpired) {
      dispatch(
        setNotification({
          message: `User session expired, please relogin`,
          type: NotificationTypes.WARNING,
        })
      )
      dispatch(logoutUser())
    }
  }, [isAuthenticated, isAuthExpired])

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
  /**
   * remove serverside css
   */
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    jssStyles?.parentElement?.removeChild(jssStyles)
  }, [])

  return (
    <Provider store={store}>
      <MyApp Component={Component} pageProps={pageProps} />
    </Provider>
  )
}
export default WrappedAppWithRedux
