import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { Inventory } from '@src/utils/api/inventoryApi'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'

export interface TransactionResponse {
  id: string

  inventory_from: Inventory

  inventory_to: Inventory

  seller: CaesarWalletResponse

  buyer: CaesarWalletResponse

  unit_price: number

  selling_price: number

  buying_account: UserTypesAndUser

  selling_account: UserTypesAndUser

  quantity: number

  cost_price: number

  sales_price: number

  seller_profit: number

  approved: boolean
}

export interface PendingTransactionResponse {
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

export function createPurchase({
  inventoryId,
  buyerCaesarId,
  quantity,
}: {
  inventoryId: string
  buyerCaesarId: string
  quantity: number
}): Promise<{
  transaction?: TransactionResponse
  pending_transactions?: PendingTransactionResponse[]
}> {
  return axios
    .post(`/transaction/purchase/${inventoryId}/${buyerCaesarId}`, {
      quantity,
    })
    .then(
      (res) =>
        res.data as {
          transaction?: TransactionResponse
          pending_transactions?: PendingTransactionResponse[]
        }
    )
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}

/**
 * 
    limit,
    caesar,
    buyer,
    seller,
    inventory_from,
    inventory_to,
    inventory,
 */

type GetAllTransactionsByCaesar =
  | {
      caesar: string
      buyer: never
      seller: never
    }
  | {
      buyer?: string
      seller?: string
      caesar: never
    }
type GetAllTransactionsByInventory =
  | {
      inventory: string
      inventory_from?: never
      inventory_to?: never
    }
  | {
      inventory?: never
      inventory_from?: string
      inventory_to?: string
    }
// type GetAllTransactionsByInventoryDirection = {
//   inventory_from?: string
//   inventory_to?: string
// }
// type GetAllTransactionsByCaesarDirection = {
//   buyer?: string
//   seller?: string
// }
export function getAllTransactions(
  params: GetAllTransactionsByCaesar & GetAllTransactionsByInventory & PaginateFetchParameters
): Promise<Paginated<TransactionResponse>> {
  return axios
    .get('/transactions', {
      params: {
        ...params,
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      throw extractMultipleErrorFromResponse(err)
    })
}
