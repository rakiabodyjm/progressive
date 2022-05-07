/* eslint-disable no-redeclare */
import { UserTypes } from '@src/redux/data/userSlice'
import { Asset } from '@src/utils/api/assetApi'
import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { EntityWithMessage } from '../types/EntityMessage'

export interface Inventory {
  id: string
  quantity: number
  asset: Asset
  caesar: CaesarWalletResponse
  name: string
  description: string
  unit_price: number
  srp_for_subd: number
  srp_for_dsp: number
  srp_for_retailer: number
  srp_for_user: number
}

export interface CreateInventory {
  quantity: number
  asset: string
  caesar: string
}

export type UpdateInventory = {
  quantity: number
  name: string
  description: string
  unit_price: number
  srp_for_subd: number
  srp_for_dsp: number
  srp_for_retailer: number
  srp_for_user: number
}

export type GetAllInventoryDto = {
  active?: boolean
} & Partial<Record<UserTypes, string>>

export function getAllInventory(
  params: PaginateFetchParameters & GetAllInventoryDto
): Promise<Paginated<Inventory>>
export function getAllInventory(): Promise<Inventory[]>
export function getAllInventory(params?: (PaginateFetchParameters & GetAllInventoryDto) | never) {
  return axios
    .get('/inventory', {
      params,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function getInventory(id: Inventory['id']): Promise<Inventory> {
  return axios
    .get(`/inventory/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

// export function adminAcquireInventory(params: CreateInventory) {
//   return axios
//     .post('/inventory/admin-acquire', {
//       ...params,
//     })
//     .then((res) => res.data as Inventory)
//     .catch((err) => {
//       throw extractMultipleErrorFromResponse(err)
//     })
// }

/**
 * Will work only on admin
 */
export function createInventory(params: CreateInventory) {
  return axios
    .post('/inventory', {
      ...params,
    })
    .then((res) => res.data as Inventory)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
export function updateInventory(id: Inventory['id'], updateInventoryDto: Partial<UpdateInventory>) {
  return axios
    .patch(`/inventory/${id}`, {
      ...updateInventoryDto,
    })
    .then((res) => res.data as EntityWithMessage<Inventory>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function getCommerce({
  caesar,
  page,
  limit,
}: {
  caesar: string
} & PaginateFetchParameters): Promise<Paginated<Inventory>> {
  return axios
    .get('/inventory/commerce', {
      params: {
        caesar,
        page,
        limit,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
