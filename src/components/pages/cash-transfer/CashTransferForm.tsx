import { Box, Paper } from '@material-ui/core'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import dynamic from 'next/dynamic'

const TransferTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateTransferTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
)
const WithDrawTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateWithdrawTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
)

const DepositTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateDepositTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
)

const LoanTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateLoanTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
)

const LoanPaymentTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateLoanPaymentTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
)

const LoadTypeTransaction = dynamic(
  () => import('@src/components/pages/cash-transfer/CreateLoadTypeTransaction'),
  {
    loading: () => <LoadingScreen2 />,
  }
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

type LoadTypeProps = {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
  transactionType: CashTransferAs.LOAD
}

type LoanPaymentTypeProps = {
  transactionType: CashTransferAs.LOAN_PAYMENT
  cash_transfer: CashTransferResponse
}
export default function CashTransferForm({
  transactionType,
  ...restProps
}: Omit<
  | TransferTypeProps
  | WithdrawTypeProps
  | DepositTypeProps
  | LoanTypeProps
  | LoadTypeProps
  | LoanPaymentTypeProps,
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

      {transactionType === CashTransferAs.LOAD && (
        <Paper>
          <Box p={2}>
            <LoadTypeTransaction {...restProps} />
          </Box>
        </Paper>
      )}

      {transactionType === CashTransferAs.LOAN_PAYMENT && (
        <Paper>
          <Box p={2}>
            <LoanPaymentTransaction
              {...(restProps as {
                cash_transfer: CashTransferResponse
                triggerMutate: () => void
              })}
            />
          </Box>
        </Paper>
      )}
    </>
  )
}

// export { WithDrawTypeTransaction, DepositTypeTransaction }
