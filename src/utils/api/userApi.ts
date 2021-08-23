// import type { User, UserMetaData } from '@src/redux/data/userSlice'
import type { User, UserMetaData } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { DspResponseType } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import jwtDecode from '@src/utils/lib/jwtDecode'
import axios, { AxiosError, AxiosResponse } from 'axios'

enum UserRoles {
  ADMIN = 'admin',
  DSP = 'dsp',
  RETAILER = 'retailer',
}
export type LoginUserParams = {
  email: string
  password: string
  remember_me: boolean
}

export type LoginUserResponse = {
  access_token: string
  message: string
}

export type UserResponse = {
  id: string
  first_name: string
  last_name: string
  phone_number: string
  email: string
  username: string
  created_at: Date
  updated_at: Date
  dsp?: DspResponseType
  admin?: AdminResponseType
  retailer?: RetailerResponseType
  roles?: UserRoles[]
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
      .catch((err) => {
        throw err
      })
  },

  logoutUser() {
    window?.localStorage?.removeItem('token')
  },
  getUser(id: string) {
    return axios
      .get(`/user/${id}`)
      .then(({ data }: { data: UserResponse }) => data)
      .catch((err: AxiosError) => {
        throw err
      })
  },
}
