import { extractErrorFromResponse, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { Inventory } from '@src/utils/api/inventoryApi'
import { TransactionResponse } from '@src/utils/api/transactionApi'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'

interface PendingTransactionResponse {
  id: string

  pending_purchase_id: string

  approved: boolean

  inventory: Inventory

  caesar_buyer: CaesarWalletResponse

  caesar_seller: CaesarWalletResponse

  quantity: number

  transaction_id?: TransactionResponse

  created_at: Date

  updated_at: Date

  deleted_at: Date
}

export interface GetAllPendingTransactionsDto {
  caesar_buyer?: string

  caesar_seller?: string

  withDeleted?: boolean

  approved?: boolean
}

export const getAllPendingTransactions = (
  getAllPendingTransactionParam: GetAllPendingTransactionsDto & PaginateFetchParameters
): Promise<Paginated<PendingTransactionResponse>> =>
  axios
    .get('/pending-transaction', {
      params: {
        ...getAllPendingTransactionParam,
      },
    })
    .then((res) => res.data as Paginated<PendingTransactionResponse>)
    .catch((err) => {
      throw extractErrorFromResponse(err)
    })

export function getPendingTransaction(id: string): Promise<PendingTransactionResponse> {
  return axios
    .get(`/pending-transaction/${id}`)
    .then((res) => res.data)

    .catch((err) => {
      throw extractErrorFromResponse(err)
    })
}

export function approvePendingTransaction(id: string) {
  return axios
    .post(`/pending-transaction/approve-transaction/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function cancelPendingTransaction(id: string) {
  return axios
    .post(`/pending-transaction/cancel-transaction/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

export function denyPendingTransaction(id: string) {
  return axios
    .post(`/pending-transaction/deny-transaction/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
