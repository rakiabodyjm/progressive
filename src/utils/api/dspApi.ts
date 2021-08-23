import type { UserResponse } from '@src/utils/api/userApi'

export type DspResponseType = {
  id: string
  dsp_code: string
  e_bind_number: string
  area_id: {
    area_id: string
    area_name: string
    parent_name: string
    parent_parent_name: string
    area_parent_pp_name: string
  }
  user: UserResponse
}
