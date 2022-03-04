/* eslint-disable no-redeclare */
import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import type { UserResponse } from '@src/utils/api/userApi'
import type { CaesarWalletResponse } from '@src/utils/api/walletApi'
import axios from 'axios'
import { Paginated, PaginateFetchParameters } from '../types/PaginatedEntity'

export type AdminResponseType = {
  id: string
  name: string
  user: UserResponse
  caesar_wallet: CaesarWalletResponse
}

export function getAdmin(id: string): Promise<AdminResponseType> {
  return axios
    .get(`/admin/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function getAllAdmin(
  paginateFetchParams: PaginateFetchParameters
): Promise<Paginated<AdminResponseType>>
export function getAllAdmin(): Promise<AdminResponseType[]>
export function getAllAdmin(paginateParameters?: PaginateFetchParameters) {
  return axios
    .get('/admin', {
      params: {
        ...paginateParameters,
      },
    })
    .then((res) => {
      if (paginateParameters) {
        return res.data as Paginated<AdminResponseType>
      }
      return res.data as AdminResponseType[]
    })
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function searchAdmin(searchQuery: string): Promise<AdminResponseType[]> {
  return axios
    .get('/admin/search', {
      params: {
        searchQuery,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
