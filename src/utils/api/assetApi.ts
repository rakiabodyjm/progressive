/* eslint-disable no-redeclare */
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios, { AxiosError } from 'axios'

export interface Asset {
  id: string
  code: string
  name: string
  description: string
  unit_price: number
  srp_for_subd: number
  srp_for_dsp: number
  srp_for_retailer: number
  srp_for_user: number
  active: boolean
  deleted_at: Date
  updated_at: Date
  created_at: Date
  approval?: string
  whole_number_only: boolean
}

export interface CreateAssetDto {
  code: string
  name: string
  description: string
  unit_price: number
  srp_for_subd: number
  srp_for_dsp: number
  srp_for_retailer: number
  srp_for_user: number
  approval?: UserTypesAndUser[]
  whole_number_only: boolean
}

export interface GetAllAssetDto {
  withDeleted?: true
  active?: boolean
}
export function getAssets(
  params: PaginateFetchParameters & GetAllAssetDto
): Promise<Paginated<Asset>>
export function getAssets(params: never): Promise<Asset[]>
export function getAssets(params?: any) {
  return axios
    .get('/asset', {
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function getAsset(id: string) {
  return axios
    .get('/asset')
    .then((res) => res.data as Asset)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function createAsset(params: CreateAssetDto) {
  return axios
    .post('/asset', params)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      console.log('error creating asset', err)
      throw extractMultipleErrorFromResponse(err)
    })
}

export function updateAsset(id: string, params: Partial<CreateAssetDto>) {
  return axios
    .patch(`/asset/${id}`, params)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function searchAsset(
  searchQuery: string,
  options?: {
    withDeleted?: boolean
  }
): Promise<Asset[]> {
  return axios
    .get('/asset/search', {
      params: {
        searchQuery,
        withDeleted: options?.withDeleted,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}
