import { CaesarWalletResponse } from '@src/utils/api/walletApi'

export type Bank = {
  id: number
  name: string
  description: string
}

export type CaesarBank = {
  id: number
  caesar: CaesarWalletResponse
  bank: Bank
  description: string
  balance: number
}

export type TransferType = {
  id: number
  name: string
  description?: string
}

export type Deposit = {
  name: 'DEPOSIT'
} & TransferType
export type Withdraw = {
  name: 'WITHDRAW'
}

export type Transfer = {
  name: 'TRANSFER'
}

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  LOAN_PAYMENT = 'LOAN PAYMENT',
  INTEREST = 'INTEREST',
  BANK_FEES = 'BANK FEES',
}

export type TransferTypes<T extends Deposit | Withdraw | Transfer> = TransferType & T
