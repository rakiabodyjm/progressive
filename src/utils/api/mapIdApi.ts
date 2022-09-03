import axios from 'axios'

// Update MapId 09-28 11:03
export interface MapIdResponseType {
  area_id: string
  area_name: string
  parent_name: string
  parent_parent_name: string
  area_parent_pp_name: string
  // dsp?: DspResponseType[]
  // subdistributors?: SubdistributorResponseType[]
}

export interface SearchMap {
  search?: string | undefined
  page?: number
  limit?: number
}
export function searchMap(params?: SearchMap) {
  return axios
    .get('/map-ids', {
      params: {
        search: params?.search || undefined,
        page: params?.page || 0,
        limit: params?.limit || 100,
      },
    })
    .then((res) => res.data as MapIdResponseType[])
    .catch((err) => {
      throw err
    })
}

export function getMap(id: string) {
  return axios
    .get(`/map-ids/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw err
    })
}
