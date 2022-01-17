import type { UserTypesAndUser } from '@src/pages/admin/accounts'
import type { UserRoles, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import type { DspResponseType } from '@src/utils/api/dspApi'
import type { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import type { UserResponse } from '@src/utils/api/userApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
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

  ceasar_id: string

  description: string

  data?: ExternalCeasar

  created_at: Date

  updated_at: Date

  user?: UserResponse

  subdistributor?: SubdistributorResponseType

  dsp?: DspResponseType

  retailer?: RetailerResponseType

  admin?: AdminResponseType
}

export function createWallet(param: Record<UserTypes, string>): Promise<CaesarWalletResponse> {
  return axios
    .post('/caesar', {
      ...param,
    })
    .then((res) => res.data)

    .catch((err) => {
      console.log('error from creatingwallet', err.response)
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

export function getWallet<T = string>(
  params: UserTypesAndUser,
  value: string
): Promise<CaesarWalletResponse>
// eslint-disable-next-line no-redeclare
export function getWallet<T = Record<UserTypes, string>>(params: T): Promise<CaesarWalletResponse>
// eslint-disable-next-line no-redeclare
export function getWallet(
  params: UserTypesAndUser | Record<UserTypes, string>,
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

export type SearchWalletParams = {
  searchQuery: string
} & PaginateFetchParameters
export function searchWallet(searchParams: SearchWalletParams) {
  const { searchQuery } = searchParams
  return axios
    .get('/caesar/search', {
      params: {
        ...searchParams,
      },
    })
    .then((res) => res.data as Paginated<CaesarWalletResponse>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
