// import type { User, UserMetaData } from '@src/redux/data/userSlice'
import type { User, UserMetaData, UserState, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { DspResponseType } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import jwtDecode from '@src/utils/lib/jwtDecode'
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
  subdistributor?: SubdistributorResponseType
  roles: UserTypes[]
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
  /**
   * Logs out user and removes token from localStorage
   */
  logoutUser() {
    window?.localStorage?.removeItem('token')
  },
  /**
   *
   * Gets specific user data from parameter returning UserResponse
   * Second parameter if it's fresh data from db
   * @returns {UserResponse}
   */
  getUser(id: string, params?: { cached: boolean }): Promise<UserResponse> {
    return axios
      .get(`/user/${id}?cache=${!!params?.cached || false}`)
      .then(({ data }: { data: UserResponse }) => data)
      .catch((err: AxiosError) => {
        throw err
      })
  },
  /**
   * Creates Keys from 'user_api' to 'User Api'
   * id => "User ID"
   * roles => "Account Type"
   * @param param
   * @returns {string}
   */
  formatKeyIntoReadables(param: string) {
    if (typeof param !== 'string') {
      return JSON.stringify(param)
      // throw new Error(`To Readable case received non string ${JSON.stringify(param)}`)
    }

    const toCapsFirst = (toCapitalParam: string): string =>
      toCapitalParam
        .split('_')
        .map((ea) => ea.charAt(0).toUpperCase() + ea.slice(1))
        .join(' ')

    if (param.indexOf('_') > 0) {
      return toCapsFirst(param)
    }
    if (param === 'id') {
      return 'User ID'
    }
    if (param === 'roles') {
      return 'Account Types'
    }

    return toCapsFirst(param)
  },
  updateUser(id: string, args: Partial<UserResponse>) {
    return axios
      .patch(`/user/${id}`, args)
      .then((res) => res)
      .catch((err: AxiosError) => {
        throw err
      })
  },
  extractError(err: AxiosError): string {
    const errResponse: string | string[] = err?.response?.data?.message
    const errRequest = err?.request
    if (errResponse) {
      if (Array.isArray(errResponse)) {
        return errResponse.join(', ')
      }
      return errResponse
    }
    if (errRequest) {
      return errRequest
    }
    return err.message
  },
  /**
   *
   * reduceUser used by userSlice to convert userdata fetched into something more useful
   */
}
