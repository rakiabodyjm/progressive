import { extractErrorFromResponse } from '@src/utils/api/common'
import type { UserResponse } from '@src/utils/api/userApi'
import type { CaesarWalletResponse } from '@src/utils/api/walletApi'
import axios from 'axios'

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

export function getAllAdmin() {
  return axios
    .get('/admin')
    .then((res) => res.data as AdminResponseType[])
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}
