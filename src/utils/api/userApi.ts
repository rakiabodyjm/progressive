import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import type { User, UserMetaData } from '@src/redux/data/userSlice'
import jwtDecode from '@src/utils/jwtDecode'
import axios, { AxiosError, AxiosResponse } from 'axios'

export type LoginUserParams = {
  email: string
  password: string
  remember_me: boolean
}

export type LoginUserResponse = {
  access_token: string
  message: string
}

export default {
  /**
   * Logs in user and dispatches actions to redux
   */
  async loginUser({
    email,
    password,
    remember_me,
  }: LoginUserParams): Promise<null | (User & UserMetaData)> {
    return axios
      .post('/auth/login', {
        email,
        password,
        remember_me,
      })
      .then((res) => {
        const decoded = jwtDecode(res.data.access_token) as User & UserMetaData
        window?.localStorage?.setItem('token', res.data.access_token)

        return decoded
      })
      .catch((err: AxiosError) => {
        throw err
      })
  },
}
