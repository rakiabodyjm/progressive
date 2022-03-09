/* eslint-disable no-nested-ternary */
import { CssBaseline, useMediaQuery } from '@material-ui/core'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Head from 'next/head'
import theme from '@src/theme'
import { Provider, useSelector, useDispatch } from 'react-redux'
import store, { RootState } from '@src/redux/store'
import { SnackbarProvider } from 'notistack'
import Notification from '@src/components/Notification'
import dynamic from 'next/dynamic'
import NavigationLayout from '@src/components/NavigationLayout'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser, logoutUser } from '@src/redux/data/userSlice'
import { ThemeProvider } from '@material-ui/styles'
import { ColorSchemeTypes, setColorScheme } from '@src/redux/data/colorSchemeSlice'
import { useRouter } from 'next/router'
import useNotification from '@src/utils/hooks/useNotification'
import { nanoid } from '@reduxjs/toolkit'
import { AppProps } from 'next/dist/shared/lib/router/router'
// import { getDefaultCaesar } from '@src/redux/data/currentCaesarSlice'
import RouteGuard from '@src/components/RouteGuard'
import Registration from './register'

const Login = dynamic(() => import(`@src/components/pages/login`))
const CashTransfer = dynamic(() => import(`@src/pages/admin/topup`))
const LoginExtensionModal = dynamic(() => import(`@src/components/LoginExtensionModal`))
const ModalWrapper = dynamic(() => import(`@src/components/ModalWrapper`))

/**
 * sets axios defaults
 */
axiosDefaults()
function MyApp({ Component, pageProps }: { Component: AppProps['Component']; pageProps: any }) {
  const router = useRouter()
  const { pathname } = router
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const dispatch = useDispatch()
  const [loginExtensionModalOpen, setLoginExtensionModalOpen] = useState<boolean>(false)

  useEffect(() => {
    dispatch(setColorScheme(prefersDark ? ColorSchemeTypes.DARK : ColorSchemeTypes.LIGHT))
  }, [prefersDark])

  const user = useSelector((state: RootState) => state.user)

  /**
   * User State exist in redux user state
   */
  const isAuthenticated = useMemo<boolean>(() => !!user?.data.user_id, [user])

  /**
   * Change value of useCallback function
   */
  const [triggerCheckExpiry, setTriggerCheckExpiry] = useState<string>(nanoid())

  const checkLoginExpiryRef = useRef<ReturnType<typeof setInterval> | undefined>()

  useEffect(() => {
    if (checkLoginExpiryRef.current) {
      clearInterval(checkLoginExpiryRef.current)
    }
    checkLoginExpiryRef.current = setInterval(() => {
      console.log('checking')
      if (!loginExtensionModalOpen) {
        setTriggerCheckExpiry(nanoid())
      }
    }, 1000 * 30)

    return () => {
      if (checkLoginExpiryRef.current) {
        clearInterval(checkLoginExpiryRef.current)
      }
    }
  }, [loginExtensionModalOpen])

  const checkAuthExpired = useCallback(() => {
    if (user) {
      if (user.metadata.exp < Date.now() / 1000) {
        return true
      }
      return false
    }
    return true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, triggerCheckExpiry])

  const colorScheme = useSelector(
    (state: RootState) => state.colorScheme === ColorSchemeTypes.DARK || false
  )

  useEffect(() => {
    // get user data

    if (user) {
      dispatch(getUser())
    }
  }, [])

  useEffect(() => {
    if (checkAuthExpired()) {
      if (isAuthenticated) {
        // Show relogin modal
        setLoginExtensionModalOpen(true)
      }
    } else {
      setLoginExtensionModalOpen(false)
    }
  }, [checkAuthExpired, isAuthenticated])

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider
        theme={{
          ...theme({
            prefersDarkMode: colorScheme,
          }),
        }}
      >
        <CssBaseline />
        <SnackbarProvider maxSnack={10}>
          <Notification />

          {isAuthenticated && !router.pathname.split('/').includes('register') ? (
            <NavigationLayout>
              <RouteGuard Component={Component} pageProps={pageProps} />
            </NavigationLayout>
          ) : router.pathname.split('/').includes('register') ? (
            <Registration />
          ) : (
            <Login />
          )}

          {loginExtensionModalOpen && isAuthenticated && (
            <ModalWrapper
              onClose={() => {
                // setLoginExtensionModalOpen(false)
              }}
              containerSize="xs"
              open={loginExtensionModalOpen}
            >
              <LoginExtensionModal
                logout={() => {
                  dispatch(logoutUser())
                  setLoginExtensionModalOpen(false)
                }}
                close={() => {
                  setLoginExtensionModalOpen(false)
                }}
              />
            </ModalWrapper>
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
