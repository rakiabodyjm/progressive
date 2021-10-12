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
