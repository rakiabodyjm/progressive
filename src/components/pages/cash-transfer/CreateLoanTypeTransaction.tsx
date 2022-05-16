/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Divider, Link, Tooltip, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

const LoanTypeTransaction = ({
  caesar_bank_from,
  caesar_bank_to,
}: {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
}) => {
  const [transferForm, setTransferForm] = useState<{
    amount?: number
    caesar_bank_from?: CaesarBank
    // caesar_bank_to?: CaesarBank
    description?: string
    as?: CashTransferAs
    bank_fee?: number
    caesar_bank_to?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
  }>({
    amount: undefined,
    caesar_bank_from,
    caesar_bank_to,
    description: undefined,
    as: CashTransferAs.LOAN,
    bank_fee: undefined,
    to: undefined,
    from: undefined,
  })

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [resetValue, setResetValue] = useState<number>()
  const dispatchNotif = useNotification()

  const { mutate } = useSWRConfig()

  const submitAsLoanFunction = useCallback(
    () =>
      axios
        .post('/cash-transfer/loan', {
          ...transferForm,
          // caesar_bank_to:  transferForm?.caesar_bank_to?.id,
          caesar_bank_from: transferForm?.caesar_bank_from?.id,
          // to: transferForm?.caesar_bank_to?.caesar.id,

          ...(toCaesarEnabled
            ? {
                to: transferForm?.to?.id || undefined,
              }
            : {
                caesar_bank_to: transferForm?.caesar_bank_to?.id || undefined,
              }),
        })
        .then((res) => res.data)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
        .finally(() => {
          mutate(`/caesar/${caesar_bank_from?.caesar?.id}`, null, true)
          if (caesar_bank_from?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_from.id}`, null, true)
          }
          if (caesar_bank_to?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_to.id}`, null, true)
          }
        }),
    [transferForm, caesar_bank_from, caesar_bank_to, mutate, toCaesarEnabled]
  )

  const {
    error,
    loading: loanLoading,
    response,
    submit,
  } = useSubmitFormData({
    submitFunction: submitAsLoanFunction,
  })

  const handleSubmit = useCallback(() => {
    setLoading(true)
    if (!transferForm?.amount) {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: `Amount must not be empty or should be greater than 0`,
      })
      return
    }

    if (
      !(transferForm?.caesar_bank_from || transferForm?.from) ||
      !(transferForm?.caesar_bank_to || transferForm?.to)
    ) {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: `Loan must have source and destination account`,
      })
    }
    submit()
  }, [submit])

  useEffect(() => {
    setLoading(loanLoading)
  }, [loanLoading])

  useEffect(() => {
    if (error) {
      ;(error as string[]).forEach((ea) => {
        dispatchNotif({
          type: NotificationTypes.ERROR,
          message: ea,
        })
      })
    }
  }, [error])

  useEffect(() => {
    if (response) {
      dispatchNotif({
        type: NotificationTypes.SUCCESS,
        message: `Loan Created`,
      })
      setTransferForm({
        amount: 0,
        caesar_bank_from,
        caesar_bank_to: undefined,
        description: '',
        as: CashTransferAs.LOAN,
        bank_fee: undefined,
        to: undefined,
      })
      setResetValue(Date.now())
    }
  }, [response])

  useEffect(() => {
    if (toCaesarEnabled) {
      setTransferForm((prev) => ({
        ...prev,
        caesar_bank_to: undefined,
      }))
    } else {
      setTransferForm((prev) => ({
        ...prev,
        to: undefined,
      }))
    }
  }, [toCaesarEnabled])

  return (
    <>
      <Box>
        <Typography variant="h4">Loan</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Loan from Account's Bank to Bank/Person
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <FormLabel>From Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank: CaesarBank) => {
            setTransferForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          defaultValue={transferForm.caesar_bank_from}
          disabled={!!caesar_bank_from}
        />
        <Box my={2}></Box>
        {toCaesarEnabled ? (
          <>
            <FormLabel>To Caesar Account</FormLabel>
            <ToCaesarAutoComplete
              onChange={(caesarSelected) => {
                setTransferForm((prev) => ({
                  ...prev,
                  to: caesarSelected,
                }))
              }}
              filter={(res) => res.filter((ea) => ea.id !== caesar_bank_from?.caesar.id)}
              value={transferForm.to}
              key={resetValue}
            />
          </>
        ) : (
          <>
            <FormLabel>To Another Bank Account</FormLabel>

            <ToCaesarBankAutoComplete
              onChange={(caesarBank: CaesarBank) => {
                setTransferForm((prev) => ({
                  ...prev,
                  caesar_bank_to: caesarBank,
                  to: undefined,
                }))
              }}
              filter={(args) =>
                args.filter((ea) =>
                  transferForm.caesar_bank_from?.id
                    ? transferForm.caesar_bank_from.id !== ea.id
                    : ea
                )
              }
              defaultValue={transferForm?.caesar_bank_to || undefined}
              disabled={!!caesar_bank_to}
              value={transferForm.caesar_bank_to}
              key={resetValue}
            />
          </>
        )}

        <Tooltip
          arrow
          placement="right"
          title={
            <Typography variant="subtitle2">Record as Transaction to User without bank</Typography>
          }
        >
          <Link
            component="button"
            color="textSecondary"
            variant="caption"
            onClick={() => {
              if (toCaesarEnabled) {
                setToCaesarEnabled(false)
              } else {
                setToCaesarEnabled(true)
              }
            }}
          >
            {toCaesarEnabled ? `Use Bank Account instead` : `Use Caesar Account instead`}
          </Link>
        </Tooltip>

        {/**
         *
         *
         * TO Caesar enabled
         *
         *
         *
         */}

        <Box my={2}></Box>

        {transferForm?.caesar_bank_from && (
          <Box my={2}>
            <FeesTransaction
              triggerReset={resetValue}
              newValue={transferForm.bank_fee}
              onChange={(bank_fee: number | undefined) => {
                setTransferForm((prev) => ({
                  ...prev,
                  bank_fee,
                }))
              }}
              caesar_bank={transferForm?.caesar_bank_from}
            />
          </Box>
        )}

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
          value={transferForm.description}
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

        {/* <FormLabel>Transaction Type:</FormLabel> */}
        {/* <AsDropDown
          disabledKeys={['WITHDRAW', 'DEPOSIT', 'LOAN PAYMENT']}
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              as: e.target.value as CashTransferAs,
            }))
          }}
        /> */}

        {/* <Box my={2} />
        {transferForm?.as === CashTransferAs['LOAN PAYMENT'] && <>
        
          
        </>} */}

        <Box my={2}>
          <Divider />
        </Box>
        <AsyncButton onClick={handleSubmit} loading={loading} disabled={loading} fullWidth>
          Submit
        </AsyncButton>
      </Box>
    </>
  )
}

// const InterstAmountNumberField = ({ onChange, value,  }: {
//   onChange: (val: number|undefined)=> void
//   value: number|undefined
// }) => {
//   return (
//     <FormNumberField
//     onChange={onChange}
//     value={value}
//     />
//   )
// }

export default LoanTypeTransaction
