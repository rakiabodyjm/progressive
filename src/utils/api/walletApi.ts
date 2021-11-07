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

export interface CeasarWalletResponse {
  id: string

  account_type: UserRoles

  account_id: string

  ceasar_id: string

  data?: ExternalCeasar

  created_at: Date

  updated_at: Date
}

export function createWallet(param: Record<UserTypes, string>): Promise<CeasarWalletResponse> {
  return axios
    .post('/ceasar', {
      ...param,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function getWalletById(id: string): Promise<CeasarWalletResponse> {
  return axios
    .get(`/ceasar/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function getWallet<T = string>(...arg: T[]): Promise<CeasarWalletResponse>
export function getWallet<T = Record<UserTypes, string>>(params: T): Promise<CeasarWalletResponse>
export function getWallet(
  params: Record<UserTypes, string>,
  value?: string
): Promise<CeasarWalletResponse> {
  console.log('getWallet params', params, value)
  if (typeof params === 'string') {
    return axios
      .get('/ceasar/account', {
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
    .get('/ceasar/account', {
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
