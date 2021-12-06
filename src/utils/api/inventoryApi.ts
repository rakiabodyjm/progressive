/* eslint-disable no-redeclare */
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { Asset } from '@src/utils/api/assetApi'
import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CeasarWalletResponse } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { EntityWithMessage } from '../types/EntityMessage'

export interface Inventory {
  id: string
  quantity: number
  asset: Asset
  ceasar: CeasarWalletResponse
}

export interface CreateInventory {
  quantity: number
  asset: string
  // ceasar: string
}

export type UpdateInventory = {
  quantity: number
}

type GetAllInventoryDto = {
  disabled?: true
  account?: Record<UserTypesAndUser, string>
}

export function getAllInventory(
  params: PaginateFetchParameters & GetAllInventoryDto
): Promise<Paginated<Inventory>>
export function getAllInventory(...params: never): Promise<Inventory[]>
export function getAllInventory(params: unknown) {
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

export function adminAcquireInventory(params: CreateInventory) {
  return axios
    .post(
      '/inventory/admin-acquire',
      {
        ...params,
      },
      {
        headers: {
          role: 'admin',
        },
      }
    )
    .then((res) => res.data as Inventory)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function updateInventory(id: Inventory['id'], updateInventoryDto: UpdateInventory) {
  return axios
    .patch(`/inventory/${id}`, {
      ...updateInventoryDto,
    })
    .then((res) => res.data as EntityWithMessage<Inventory>)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
