import { Box, Paper } from '@material-ui/core'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import dynamic, { DynamicOptions, Loader } from 'next/dynamic'
import { ReactComponentElement } from 'react'

function dynamicImportWithLoading<T>(param: T) {
  return dynamic(param, {
    loading: () => <LoadingScreen2 />,
  })
}

const TransferTypeTransaction = dynamicImportWithLoading(
  () => import('@src/components/pages/cash-transfer/CreateTransferTypeTransaction')
)
const WithDrawTypeTransaction = dynamicImportWithLoading(
  () => import('@src/components/pages/cash-transfer/CreateWithdrawTypeTransaction')
)

const DepositTypeTransaction = dynamicImportWithLoading(
  () => import('@src/components/pages/cash-transfer/CreateDepositTypeTransaction')
)

const LoanTypeTransaction = dynamicImportWithLoading(
  () => import('@src/components/pages/cash-transfer/CreateLoanTypeTransaction')
)

const LoanPaymentTransaction = dynamicImportWithLoading(
  () => import('@src/components/pages/cash-transfer/CreateLoanPaymentTypeTransaction')
)

type TransferTypeProps = {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
  transactionType: CashTransferAs.TRANSFER
}
type WithdrawTypeProps = {
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
  transactionType: CashTransferAs.WITHDRAW
}

type DepositTypeProps = {
  caesar_bank_to: CaesarBank
  from: CaesarWalletResponse
  transactionType: CashTransferAs.DEPOSIT
}

type LoanTypeProps = {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
  transactionType: CashTransferAs.LOAN
}

type LoanPaymentTypeProps = {
  transactionType: CashTransferAs.LOAN_PAYMENT
  cash_transfer: CashTransferResponse
}
export default function CashTransferForm({
  transactionType,
  ...restProps
}: Omit<
  TransferTypeProps | WithdrawTypeProps | DepositTypeProps | LoanTypeProps | LoanPaymentTypeProps,
  'children'
>) {
  return (
    <>
      {transactionType === CashTransferAs.TRANSFER && (
        <Paper>
          <Box p={2}>
            <TransferTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === CashTransferAs.WITHDRAW && (
        <Paper>
          <Box p={2}>
            <WithDrawTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === CashTransferAs.DEPOSIT && (
        <Paper>
          <Box p={2}>
            <DepositTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === CashTransferAs.LOAN && (
        <Paper>
          <Box p={2}>
            <LoanTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === CashTransferAs['LOAN PAYMENT'] && (
        <Paper>
          <Box p={2}>
            <LoanPaymentTransaction {...restProps} />
          </Box>
        </Paper>
      )}
    </>
  )
}

// export { WithDrawTypeTransaction, DepositTypeTransaction }
