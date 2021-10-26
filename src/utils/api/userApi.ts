// import type { User, UserMetaData } from '@src/redux/data/userSlice'
import type { User, UserMetaData, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { extractErrorFromResponse } from '@src/utils/api/common'
import { DspResponseType } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import jwtDecode from '@src/utils/lib/jwtDecode'
import type { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios, { AxiosError } from 'axios'

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
  address1: string
  address2: string | null
  username: string
  created_at: Date
  updated_at: Date
  dsp?: DspResponseType
  admin?: AdminResponseType
  retailer?: RetailerResponseType
  subdistributor?: SubdistributorResponseType
  roles: UserTypes[]
  active: boolean
}

export type CreateUser = {
  first_name: string
  last_name: string
  address1: string
  address2: string
  email: string
  phone_number: string
  username: string
  password: string
}
const userApi = {
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

    switch (param) {
      case 'address1':
        return 'Address 1'
      case 'address2':
        return 'Address 2'
      default:
        return toCapsFirst(param)
    }
  },
  updateUser(id: string, args: Partial<UserResponse>) {
    return axios
      .patch(`/user/${id}`, args)
      .then(({ data }: { data: UserResponse }) => data)
      .catch((err: AxiosError) => {
        throw err
      })
  },
  extractError(err: AxiosError): string {
    console.log('serializing error', err)
    const errResponse: string | string[] = err?.response?.data?.message
    const errRequest = err?.request

    if (errResponse) {
      if (Array.isArray(errResponse)) {
        console.log('errResponse is array')
        return errResponse.join(', ')
        // return errResponse as string[]
      }
      return errResponse
    }
    if (errRequest) {
      return errRequest
    }
    return err.message
  },
  getUsers(params: PaginateFetchParameters): Promise<Paginated<UserResponse>> {
    return axios
      .get(`/user`, {
        params,
      })
      .then((res) => res.data)
      .catch((err: AxiosError) => {
        throw err
      })
  },
}

export default userApi

export const { getUser } = userApi

export async function createUser(params: CreateUser) {
  return axios
    .post('/user', params)
    .then(
      (res) =>
        res.data as {
          message: string
          user: UserResponse
        }
    )
    .catch((err: AxiosError) => {
      if (err?.response?.data?.message) {
        throw err.response.data.message
        // throw new Error(err.response.data.message)
      } else {
        throw err
      }
    })
  // .catch((err) => ({
  //   error: err,
  // }))

  // throw new Error(extractErrorFromResponse(err as AxiosError))
}

export function searchUser(userString: string) {
  return axios
    .get('/user/search', {
      params: {
        find: userString,
      },
    })
    .then((res) => res.data as UserResponse[])
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })
}
