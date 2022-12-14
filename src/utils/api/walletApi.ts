import type { UserRoles, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import type { DspResponseType } from '@src/utils/api/dspApi'
import type { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import type { UserResponse } from '@src/utils/api/userApi'
import type { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'

interface ExternalCaesar {
  wallet_id: string

  last_name: string

  first_name: string

  cp_number: string

  email: string

  role: UserRoles

  caesar_coin: number

  peso: number

  dollar: number
}

export interface CaesarWalletResponse {
  id: string

  account_type: UserRoles

  ceasar_id: string

  description: string

  data: ExternalCaesar

  created_at: Date

  updated_at: Date

  user?: UserResponse

  subdistributor?: SubdistributorResponseType

  dsp?: DspResponseType

  retailer?: RetailerResponseType

  admin?: AdminResponseType

  account_id?: string

  cash_transfer_balance: number

  bank_accounts: CaesarBank[]

  has_loan: boolean
}

export function createWallet(
  param: Record<UserTypes, string> & {
    password: string
  }
): Promise<CaesarWalletResponse> {
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

export function getWallet(params: UserTypes, value: string): Promise<CaesarWalletResponse>
// eslint-disable-next-line no-redeclare
export function getWallet(params: Partial<Record<UserTypes, string>>): Promise<CaesarWalletResponse>
// eslint-disable-next-line no-redeclare
export function getWallet(
  params: UserTypes | Partial<Record<UserTypes, string>>,
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
      params: { ...params },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export type SearchWalletParams = {
  searchQuery?: string
} & PaginateFetchParameters
export function searchWallet({ searchQuery, ...searchParams }: SearchWalletParams) {
  return axios
    .get('/caesar/search', {
      params: {
        ...searchParams,
        ...(searchQuery &&
          searchQuery.length > 0 && {
            searchQuery,
          }),
      },
    })
    .then((res) => res.data as Paginated<CaesarWalletResponse>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

/**
 *
 * Will only work if Admin is currently logged in
 */
export function topUpWallet({
  /**
   * caesarId of receiver
   *
   */
  caesar,
  /**
   * amount can be negative
   */
  amount,
}: {
  /**
   * caesarId of receiver
   *
   */
  caesar: string
  /**
   * amount can be negative
   */
  amount: number
}) {
  return axios
    .post('/caesar/topup', { caesar, amount })
    .then((res) => res.data as ExternalCaesar)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

type GetAllWalletParams = PaginateFetchParameters & {
  account_type?: UserTypes
}
export function getAllWallet({ account_type, ...allParams }: GetAllWalletParams) {
  return axios
    .get('/caesar', {
      params: {
        ...allParams,
        ...(account_type &&
          account_type.length > 0 && {
            account_type,
          }),
      },
    })
    .then((res) => res.data as Paginated<CaesarWalletResponse>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function searchWalletV2(
  searchQuery: { searchQuery?: string } & PaginateFetchParameters & {
      account_type?: UserTypes
    }
) {
  return axios
    .get('/caesar/search-v2', {
      params: {
        ...searchQuery,
      },
    })
    .then((res) => res.data as Paginated<CaesarWalletResponse>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
