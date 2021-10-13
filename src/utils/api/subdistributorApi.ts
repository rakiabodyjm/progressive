import { extractErrorFromResponse } from '@src/utils/api/common'
import type { DspResponseType } from '@src/utils/api/dspApi'
import type { MapIdResponseType } from '@src/utils/api/mapIdApi'
import type { RetailerResponseType } from '@src/utils/api/retailerApi'
import type { UserResponse } from '@src/utils/api/userApi'
import axios, { AxiosError } from 'axios'
import { Paginated } from '../types/PaginatedEntity'

// Update MapId 09-28 11:03
export type SubdistributorResponseType = {
  id: string

  name: string

  e_bind_number: string

  user: UserResponse

  id_number: string

  id_type: string

  // dsp?: DspResponseType[]

  // retailer?: RetailerResponseType[]

  area_id?: MapIdResponseType

  zip_code: string
}

export const getSubdistributor = (id: string) =>
  axios
    .get(`/subdistributor/${id}`)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getDsps = (id: string): Promise<Paginated<DspResponseType>> =>
  axios
    .get('/dsp', {
      params: {
        subdistributor: id,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getRetailers = (
  id: string,
  paginationParams: { page: number; limit: number }
): Promise<Paginated<RetailerResponseType>> =>
  axios
    .get('/retailer', {
      params: {
        subdistributor: id,
        ...paginationParams,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getRetailerCount = (id: string): Promise<number> =>
  axios
    .get('/retailer', {
      params: {
        countOnly: true,
        subdistributor: id,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getDspCount = (id: string): Promise<number> =>
  axios
    .get('/dsp', {
      params: {
        countOnly: true,
        subdistributor: id,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })
