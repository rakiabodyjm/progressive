import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { logoutUser } from '@src/redux/data/userSlice'
import store from '@src/redux/store'
import axios, { AxiosResponse } from 'axios'

export default function axiosDefaults() {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  axios.defaults.withCredentials = true

  /**
   * have interceptor
   */
  axios.interceptors.request.use(
    (config) => {
      const token = process?.browser ? window?.localStorage.getItem('token') : null

      if (token) {
        return {
          ...config,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      }
      return { ...config }
      // headers =
    },
    (err) => {
      console.log('Error in axios defaults')
      console.error(err)
      return Promise.reject(err)
    }
  )
  axios.interceptors.response.use((response: AxiosResponse) => {
    if (response.status === 401) {
      store.dispatch(
        setNotification({
          message: `Unauthorized, Please Relogin`,
          type: NotificationTypes.ERROR,
        })
      )
      store.dispatch(logoutUser())
    }
    return response
  })
}
