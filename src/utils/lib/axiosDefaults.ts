import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import store from '@src/redux/store'
import axios, { AxiosResponse } from 'axios'

export default function axiosDefaults() {
  axios.defaults.baseURL =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL
      : process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL
  /**
   * have interceptor
   */
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 401) {
      store.dispatch(
        setNotification({
          message: `Unauthorized, Please Relogin`,
          type: NotificationTypes.ERROR,
        })
      )
    }
    return response
  })
}
