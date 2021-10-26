import type { UserResponse } from '@src/utils/api/userApi'

export type AdminResponseType = {
  id: string
  name: string
  user: UserResponse
}
