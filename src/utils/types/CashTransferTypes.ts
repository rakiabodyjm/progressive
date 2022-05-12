import { CaesarWalletResponse } from '@src/utils/api/walletApi'

export type Bank = {
  id: number
  name: string
  description: string
  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export type CaesarBank = {
  id: string
  caesar: CaesarWalletResponse
  bank: Bank
  description: string
  balance: number
  account_number: string

  created_at: Date
  updated_at: Date
  deleted_at: Date
}

export type TransferType = {
  id: number
  name: string
  description?: string
}

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  LOAN_PAYMENT = 'LOAN PAYMENT',
  'LOAN PAYMENT' = 'LOAN PAYMENT',

  // INTEREST = 'INTEREST',
  // 'BANK FEES' = 'BANK FEES',
}

// export type TransferTypes<T extends Deposit | Withdraw | Transfer> = TransferType & T

export type TransferTypes = 'transfer' | 'withdraw' | 'deposit'

export type CashTransferResponse = {
  id: string

  transfer_type: TransferType

  amount: number

  as: CashTransferAs

  created_at: Date

  updated_at: Date

  deleted_at: Date

  description: string

  caesar_bank_to: CaesarBank

  caesar_bank_from: CaesarBank

  to: CaesarWalletResponse

  from: CaesarWalletResponse

  bank_charge: number

  interest: number

  remaining_balance_from: number

  remaining_balance_to: number

  loan?: CashTransferResponse

  // interest_amount: number
  ref_num: string

  total_amount: number
}
