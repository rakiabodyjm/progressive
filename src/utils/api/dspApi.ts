import { extractErrorFromResponse } from '@src/utils/api/common'
import type { MapIdResponseType } from '@src/utils/api/mapIdApi'
import type { RetailerResponseType } from '@src/utils/api/retailerApi'
import type { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import type { UserResponse } from '@src/utils/api/userApi'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios, { AxiosError } from 'axios'

// Update MapId 09-28 11:03
export type DspResponseType = {
  id: string

  dsp_code: string

  user: UserResponse

  area_id: MapIdResponseType[]

  e_bind_number: string

  subdistributor: SubdistributorResponseType

  // retailer: RetailerResponseType[]
  /**
   * Newly added
   */
  // retailer_total: number
}

export interface CreateDspAccount {
  dsp_code: string
  e_bind_number: string
  subdistributor: string
  user: UserResponse['id']
  area_id: MapIdResponseType['area_id'][]
}
export interface DspUpdateType {
  dsp_code: string
  e_bind_number: string
  area_id: MapIdResponseType['area_id'][]
}
export interface DspRegisterParams extends Omit<CreateDspAccount, 'subdistributor' | 'user'> {}
export interface DspRegisterParams2 extends Omit<DspResponseType, 'subdistributor' | 'user'> {}
export const getDsp = (id: string): Promise<DspResponseType> =>
  axios
    .get(`/dsp/${id}`)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getRetailers = (
  id: string,
  paginationParams: { page: number; limit: number }
): Promise<Paginated<RetailerResponseType>> =>
  axios
    .get(`/retailer`, {
      params: {
        dsp: id,
        ...paginationParams,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const getRetailerCount = (id: string): Promise<number> =>
  axios
    .get(`/retailer`, {
      params: {
        countOnly: true,
        dsp: id,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const createDsp = (newDsp: CreateDspAccount) =>
  axios
    .post('/dsp', newDsp)
    .then((res) => res.data as DspResponseType)
    .catch((err: AxiosError) => {
      // if (err && err.response && err.response.data) {
      // do action here
      // }
      if (err.response?.data?.message) {
        // throw new Error('Subdistributor cannot be created')
        throw err.response?.data?.message
      } else if (err.request) {
        throw new Error(err.request)
      } else {
        throw new Error('Failed Creating DSP Account')
      }
    })
export const updateDsp = (params: Partial<DspUpdateType>, id: string) =>
  axios
    .patch(`/dsp/${id}`, {
      ...params,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const searchDsp = (
  params: string,
  filter?: {
    subdistributor: string
  }
): Promise<DspResponseType[]> =>
  axios
    .get('/dsp/search', {
      params: {
        searchQuery: params,
        ...(filter?.subdistributor && {
          subdistributor: filter.subdistributor,
        }),
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })
