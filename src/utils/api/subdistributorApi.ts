import type { UserResponse } from '@src/utils/api/userApi'

export type SubdistributorResponseType = {
  id: string
  user?: UserResponse
  e_bind_number: string
  id_number: string
  id_type: string
  zip_code: string
}
