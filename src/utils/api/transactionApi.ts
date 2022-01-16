import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { Inventory } from '@src/utils/api/inventoryApi'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'

interface TransactionResponse {
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
