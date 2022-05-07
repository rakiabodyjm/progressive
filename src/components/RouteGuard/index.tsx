/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@src/redux/store'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser } from '@src/redux/data/userSlice'
import { useRouter } from 'next/router'
import { AppProps } from 'next/dist/shared/lib/router/router'
import Error from 'next/error'
import { LoadingScreen2 } from '@components/LoadingScreen'

axiosDefaults()
export default function RouteGuard({
  Component,
  pageProps,
}: {
  Component: AppProps['Component']
  pageProps: any
}) {
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const checkPath = useMemo(() => {
    if (router.pathname.match(/\/admin\/./)) {
      if (user?.data.admin_id) {
        return true
      }
      return false
    }
    if (router.pathname.match(/\/subdistributor\/./)) {
      if (user?.data.subdistributor_id) {
        return true
      }
      return false
    }
    if (router.pathname.match(/\/dsp\/./)) {
      if (user?.data.dsp_id) {
        return true
      }
      return false
    }
    if (router.pathname.match(/\/([A-Z,a-z])\w+/)) {
      if (router.pathname.match('/profile')) {
        return true
      }
      if (
        user?.data.dsp_id ||
        user?.data.subdistributor_id ||
        user?.data.admin_id ||
        user?.data.retailer_id
      ) {
        return true
      }
      return false
    }
    return true
  }, [router.pathname, user])

  if (user?.loading) {
    return (
      <LoadingScreen2
        containerProps={{
          // minHeight: 'calc(100vh - 64px)',
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
        }}
        progressCircleProps={{
          size: 72,
        }}
        textProps={{
          variant: 'h4',
          style: {
            fontWeight: 600,
          },
        }}
      />
    )
  }
  return (
    <>
      {checkPath && user && !user?.loading ? (
        <Component {...pageProps} />
      ) : (
        <Error statusCode={404} />
      )}
    </>
  )
}
