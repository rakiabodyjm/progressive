import { Box, Divider, Paper, Typography } from '@material-ui/core'
import CustomTextField from '@src/components/AutoFormRenderer/CustomTextField'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import CreateNewTransactionModal from '@src/components/pages/cash-transfer/CreateNewTransactionModal'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { CaesarBank, TransferType } from '@src/utils/types/CashTransferTypes'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'

type DepositTypeData = {
  from: CaesarWalletResponse['id']
  caesar_bank_to: CaesarBank['id']
  description: string
  amount: number
  tag: CashTransferAs
}

type WithdrawTypeData = {
  to: CaesarWalletResponse['id']
  caesar_bank_from: CaesarBank['id']
  description: string
  amount: number
  tag: CashTransferAs
}

type TransferTypeData = {
  caesar_bank_from: CaesarBank['id']
  caesar_bank_to: CaesarBank['id']
  description: string
  amount: number
  tag: CashTransferAs
}
export default function CashTransferForm({
  caesarBankData,
  caesar,
}: {
  caesarBankData: CaesarBank
  caesar: CaesarWalletResponse
}) {
  return (
    <>
      <Paper>
        <Box p={2}>
          <TransferTypeTransaction caesar_bank_from={caesarBankData} />
        </Box>
      </Paper>
      <Box my={2}>
        <Divider />
      </Box>
      <Paper>
        <Box p={2}>
          <WithDrawTypeTransaction to={caesar} />
        </Box>
      </Paper>
      <Box my={2}>
        <Divider />
      </Box>
      <Paper>
        <Box p={2}>
          <DepositTypeTransaction from={caesar} />
        </Box>
      </Paper>
    </>
  )
}

const TransferTypeTransaction = ({
  caesar_bank_from,
  caesar_bank_to,
}: {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
}) => {
  const [transferForm, setTransferForm] = useState<{
    amount?: number
    caesar_bank_from?: CaesarBank
    caesar_bank_to?: CaesarBank
    description?: string
    as?: CashTransferAs
  }>({
    amount: undefined,
    caesar_bank_from,
    caesar_bank_to,
    description: undefined,
    as: undefined,
  })

  return (
    <>
      <Box>
        <Typography variant="h4">Transfer</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Transfer from Bank to Bank
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <FormLabel>Form Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank: CaesarBank) => {
            setTransferForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          value={transferForm.caesar_bank_from}
          disabled={!!caesar_bank_from}
          // defaultValue={caesar_bank_from}
        />
        <Box my={2}></Box>
        <FormLabel>To Another Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank: CaesarBank) => {
            setTransferForm((prev) => ({
              ...prev,
              caesar_bank_to: caesarBank,
            }))
          }}
          filter={(args) =>
            args.filter((ea) =>
              transferForm.caesar_bank_from?.id ? transferForm.caesar_bank_from.id !== ea.id : ea
            )
          }
          value={transferForm.caesar_bank_to}
          disabled={!!caesar_bank_to}
        />
        <Box my={2}></Box>
        <FormLabel>Transaction Description</FormLabel>
        <FormTextField
          multiline
          name="description"
          rows={3}
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
        />

        <Box my={2} />
        <FormLabel>Amount</FormLabel>
        <FormNumberField
          onChange={(value) => {
            setTransferForm((prev) => ({
              ...prev,
              amount: value,
            }))
          }}
          value={transferForm.amount}
        />

        <Box my={2} />

        <FormLabel>Transaction Type:</FormLabel>
        <AsDropDown
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              as: e.target.value as CashTransferAs,
            }))
          }}
        />
      </Box>
    </>
  )
}

const WithDrawTypeTransaction = ({
  caesar_bank_from,
  to,
}: {
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
}) => {
  const [withDrawForm, setWithDrawForm] = useState<{
    amount?: number
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    description?: string
  }>({
    amount: undefined,
    caesar_bank_from,
    to,
    description: undefined,
  })
  return (
    <>
      <Box>
        <Typography variant="h4">Withdraw</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Withdrawal from Bank Account
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <FormLabel>From Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank) => {
            setWithDrawForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          value={withDrawForm.caesar_bank_from}
          disabled={!!caesar_bank_from}
        />

        <Box my={2} />
        <FormLabel>To Person</FormLabel>
        <ToCaesarAutoComplete
          onChange={(caesar) => {
            setWithDrawForm((prev) => ({
              ...prev,
              to: caesar,
            }))
          }}
          value={withDrawForm.to}
          disabled={!!to}
        />

        <Box my={2}></Box>
        <FormLabel>Transaction Description</FormLabel>
        <FormTextField
          multiline
          name="description"
          rows={3}
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
        />

        <Box my={2} />
        <FormLabel>Amount</FormLabel>
        <FormNumberField
          onChange={(value) => {
            setWithDrawForm((prev) => ({
              ...prev,
              amount: value,
            }))
          }}
          value={withDrawForm.amount}
        />

        <Box my={2} />
        <FormLabel>Type</FormLabel>
        <AsDropDown
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              as: e.target.value,
            }))
          }}
        />
      </Box>
    </>
  )
}
const DepositTypeTransaction = ({
  caesar_bank_to,
  from,
}: {
  caesar_bank_to?: CaesarBank
  from?: CaesarWalletResponse
}) => {
  const [withDrawForm, setWithDrawForm] = useState<{
    amount?: number
    caesar_bank_to?: CaesarBank
    from?: CaesarWalletResponse
    description?: string
  }>({
    amount: undefined,
    caesar_bank_to,
    from,
    description: undefined,
  })
  return (
    <>
      <Box>
        <Typography variant="h4">Deposit</Typography>
        <Typography variant="body2" color="textSecondary">
          Deposit Money from Person
        </Typography>
      </Box>
      <Box>
        <FormLabel>From Person</FormLabel>
        <ToCaesarAutoComplete
          onChange={(caesar) => {
            setWithDrawForm((prev) => ({
              ...prev,
              to: caesar,
            }))
          }}
          value={withDrawForm.from}
          disabled={!!from}
        />

        <Box my={2} />

        <FormLabel>To Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank) => {
            setWithDrawForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          value={withDrawForm.caesar_bank_to}
          disabled={!!caesar_bank_to}
        />

        <Box my={2}></Box>
        <FormLabel>Transaction Description</FormLabel>
        <FormTextField
          multiline
          name="description"
          rows={3}
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
        />

        <Box my={2} />
        <FormLabel>Amount</FormLabel>
        <FormNumberField
          onChange={(value) => {
            setWithDrawForm((prev) => ({
              ...prev,
              amount: value,
            }))
          }}
          value={withDrawForm.amount}
        />

        <Box my={2} />
        <FormLabel>Type</FormLabel>
        <AsDropDown
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              as: e.target.value,
            }))
          }}
        />
      </Box>
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
const AsDropDown = ({
  onChange,
  value,
}: {
  value?: CashTransferAs
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}) => (
  <FormTextField
    select
    name="as"
    onChange={onChange}
    SelectProps={{
      native: true,
    }}
    {...(value && { value })}
  >
    {Object.values(CashTransferAs).map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ))}
  </FormTextField>
)
