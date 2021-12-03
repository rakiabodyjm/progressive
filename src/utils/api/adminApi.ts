import { extractErrorFromResponse } from '@src/utils/api/common'
import type { UserResponse } from '@src/utils/api/userApi'
import axios from 'axios'

export type AdminResponseType = {
  id: string
  name: string
  user: UserResponse
}

export function getAdmin(id: string): Promise<AdminResponseType> {
  return axios
    .get(`/admin/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}
