import { Box, Paper } from '@material-ui/core'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import dynamic from 'next/dynamic'

const TransferTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateTransferTypeTransaction')
)
const WithDrawTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateWithdrawTypeTransaction')
)

const DepositTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateDepositTypeTransaction')
)

type TransferTypeProps = {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
  transactionType: 'transfer'
}
type WithdrawTypeProps = {
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
  transactionType: 'withdraw'
}

type DepositTypeProps = {
  caesar_bank_to: CaesarBank
  from: CaesarWalletResponse
  transactionType: 'deposit'
}

export default function CashTransferForm({
  transactionType,
  ...restProps
}: Omit<TransferTypeProps | WithdrawTypeProps | DepositTypeProps, 'children'>) {
  return (
    <>
      {transactionType === 'transfer' && (
        <Paper>
          <Box p={2}>
            <TransferTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === 'withdraw' && (
        <Paper>
          <Box p={2}>
            <WithDrawTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === 'deposit' && (
        <Paper>
          <Box p={2}>
            <DepositTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}
    </>
  )
}

export enum CashTransferAs {
  DEPOSIT = 'DEPOSIT',
  TRANSFER = 'TRANSFER',
  WITHDRAW = 'WITHDRAW',
  LOAN = 'LOAN',
  'LOAN PAYMENT' = 'LOAN PAYMENT',
  INTEREST = 'INTEREST',
  'BANK FEES' = 'BANK FEES',
}

// export { WithDrawTypeTransaction, DepositTypeTransaction }
