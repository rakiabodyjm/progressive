/* eslint-disable no-redeclare */
import { UserRoles, UserTypes } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import axios from 'axios'

interface ExternalCeasar {
  wallet_id: string

  last_name: string

  first_name: string

  cp_number: string

  email: string

  role: UserRoles

  ceasar_coin: number
}

export interface CaesarWalletResponse {
  id: string

  account_type: UserRoles

  account_id: string

  ceasar_id: string

  data?: ExternalCeasar

  created_at: Date

  updated_at: Date
}

export function createWallet(param: Record<UserTypes, string>): Promise<CaesarWalletResponse> {
  return axios
    .post('/caesar', {
      ...param,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function getWalletById(id: string): Promise<CaesarWalletResponse> {
  return axios
    .get(`/caesar/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function getWallet<T = string>(...arg: T[]): Promise<CaesarWalletResponse>
export function getWallet<T = Record<UserTypes, string>>(params: T): Promise<CaesarWalletResponse>
export function getWallet(
  params: Record<UserTypes, string>,
  value?: string
): Promise<CaesarWalletResponse> {
  if (typeof params === 'string') {
    return axios
      .get('/caesar/account', {
        params: {
          [params]: value,
        },
      })
      .then((res) => res.data)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
  }
  return axios
    .get('/caesar/account', {
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
