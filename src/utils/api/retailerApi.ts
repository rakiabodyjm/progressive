import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { DspResponseType } from '@src/utils/api/dspApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import type { UserResponse } from '@src/utils/api/userApi'
import axios, { AxiosError } from 'axios'

// Update MapId 09-28 11:03
export type RetailerResponseType = {
  id: string
  e_bind_number: string
  store_name: string
  id_type: string
  id_number: string
  subdistributor: SubdistributorResponseType
  dsp: DspResponseType
  user: UserResponse
}

export interface CreateRetailer {
  store_name: string
  e_bind_number: string
  id_type: string
  id_number: string
  user: UserResponse['id']
  subdistributor: SubdistributorResponseType['id']
  dsp: DspResponseType['id']
}
export type UpdateRetailer = Partial<Omit<CreateRetailer, 'user'>>

export const getRetailer = (id: string): Promise<RetailerResponseType> =>
  axios
    .get(`/retailer/${id}`)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw new Error(extractErrorFromResponse(err))
    })

export const createRetailer = (newRetailer: CreateRetailer) =>
  axios
    .post('/retailer', newRetailer)
    .then((res) => res.data as RetailerResponseType)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })

export const updateRetailer = (id: string, updateRetailer: Partial<CreateRetailer>) =>
  axios
    .patch(`/retailer/${id}`, {
      ...updateRetailer,
    })
    .then((res) => res.data as RetailerResponseType)
    .catch((error: AxiosError) => {
      console.error(error)
      throw extractMultipleErrorFromResponse(error)
    })

export const searchRetailer = (
  searchString: string,
  filter?: {
    subdistributor: string | undefined
    dsp: string | undefined
  }
): Promise<RetailerResponseType[]> =>
  axios
    .get('/retailer/search', {
      params: {
        searchQuery: searchString,
        ...(filter?.subdistributor && {
          subdistributor: filter.subdistributor,
        }),
        ...(filter?.dsp && {
          dsp: filter.dsp,
        }),
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw new Error(extractErrorFromResponse(err))
    })
