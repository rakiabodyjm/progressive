/* eslint-disable no-nested-ternary */
import { useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@src/redux/store'
import axiosDefaults from '@src/utils/lib/axiosDefaults'
import { getUser } from '@src/redux/data/userSlice'
import { useRouter } from 'next/router'
import { AppProps } from 'next/dist/shared/lib/router/router'
import Error from 'next/error'

axiosDefaults()
export default function RouteGuard({
  Component,
  pageProps,
}: {
  Component: AppProps['Component']
  pageProps: any
}) {
  const router = useRouter()
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user)
  const [allowed, setAllowed] = useState(false)

  // useEffect(() => {
  //   if (user) {
  //     dispatch(getUser())
  //   }
  // }, [])
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

  console.log(checkPath)
  return <>{checkPath ? <Component {...pageProps} /> : <Error statusCode={404} />}</>
}
