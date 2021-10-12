import { extractErrorFromResponse } from '@src/utils/api/common'
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

export const getRetailer = (id: string): Promise<RetailerResponseType> =>
  axios
    .get(`/retailer/${id}`)
    .then((res) => res.data)
    .catch((err: AxiosError) => {
      throw new Error(extractErrorFromResponse(err))
    })
