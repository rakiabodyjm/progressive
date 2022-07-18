/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Divider, Link, Tooltip, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete, {
  searchCaesarBank,
} from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

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
    from?: CaesarWalletResponse
    // caesar_bank_to?: CaesarBank
    description?: string
    as?: CashTransferAs
    bank_fee?: number
    caesar_bank_to?: CaesarBank
    to?: CaesarWalletResponse
    message?: string
  }>({
    amount: undefined,
    caesar_bank_from: caesar_bank_from as CaesarBank,
    caesar_bank_to: caesar_bank_to as CaesarBank,
    description: undefined,
    as: CashTransferAs.TRANSFER,
    bank_fee: 0,
    from: undefined,
    to: undefined,
    message: undefined,
  })

  const [resetValue, setResetValue] = useState<number>()
  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [fromCaesaeEnabled, setFromCaesaeEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatchNotif = useNotification()

  const { mutate } = useSWRConfig()

  const submitAsLoan = useCallback(
    () =>
      axios
        .post('/cash-transfer/loan', {
          ...transferForm,
          caesar_bank_to: transferForm?.caesar_bank_to?.id,
          caesar_bank_from: transferForm?.caesar_bank_from?.id,
          to: transferForm?.caesar_bank_to?.caesar.id,
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
    [transferForm, caesar_bank_from?.caesar?.id, caesar_bank_from?.id, caesar_bank_to?.id, mutate]
  )

  const {
    error,
    loading: loanLoading,
    response,
    submit,
  } = useSubmitFormData({
    submitFunction: submitAsLoan,
  })

  useEffect(() => {
    if (
      transferForm?.caesar_bank_from?.bank.name === 'BDO' &&
      transferForm?.caesar_bank_to?.bank.name === 'GCASH'
    ) {
      setTransferForm((prev) => ({
        ...prev,
        bank_fee: 25,
      }))
    }
    if (
      transferForm?.caesar_bank_from?.bank.name === 'GCASH' &&
      transferForm?.caesar_bank_to?.bank.name === 'BDO'
    ) {
      setTransferForm((prev) => ({
        ...prev,
        bank_fee: 15,
      }))
    }
  }, [transferForm.caesar_bank_from, transferForm.caesar_bank_to])

  const handleSubmit = useCallback(() => {
    const {
      caesar_bank_from,
      amount,
      as,
      description,
      bank_fee,
      to,
      caesar_bank_to,
      message,
      from,
    } = transferForm

    const formValues = {
      amount,
      caesar_bank_from: caesar_bank_from?.id,
      caesar_bank_to: transferForm?.caesar_bank_to?.id,
      to: transferForm?.to?.id,
      as,
      from: from?.id,
      description,
      bank_fee,
      message,
    }

    setLoading(true)
    if (!as || as === CashTransferAs.LOAN) {
      submit()
      return
    }
    if (transferForm.amount !== 0) {
      axios
        .post('/cash-transfer/transfer', {
          ...formValues,
        })
        .then((res) => {
          console.log('type: transfer | res.data', res.data)
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: `Cash Transfer Success`,
          })
          setTransferForm({
            amount: 0,
            caesar_bank_from: transferForm.caesar_bank_from,
            from: transferForm.from,
            caesar_bank_to: undefined,
            description: '',
            as: CashTransferAs.TRANSFER,
            bank_fee: undefined,
            to: undefined,
            message: '',
          })
          setResetValue(Date.now())
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((ea) => {
            dispatchNotif({
              type: NotificationTypes.ERROR,
              message: ea,
            })
          })
        })
        .finally(() => {
          setLoading(false)
          if (caesar_bank_from?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_from.id}`, null, true)
          }
          if (caesar_bank_to?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_to.id}`, null, true)
          }
          mutate(`/caesar/${caesar_bank_from?.caesar?.id}`, null, true)
        })
    } else {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: `Amount cannot be empty`,
      })
      setLoading(false)
    }
  }, [transferForm, dispatchNotif, submit, mutate])

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
    if (response) {
      dispatchNotif({
        type: NotificationTypes.SUCCESS,
        message: `Loan Created`,
      })
    }
  }, [error, response, dispatchNotif])

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
        <Typography variant="h4">Transfer</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Transfer from Bank to Bank/Person
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>

      <Box>
        <Box my={2}></Box>
        {fromCaesaeEnabled ? (
          <>
            <FormLabel>From Caesar Account</FormLabel>
            <ToCaesarAutoComplete
              onChange={(caesarSelected) => {
                setTransferForm((prev) => ({
                  ...prev,
                  from: caesarSelected,
                }))
              }}
              filter={(res) => res.filter((ea) => ea.id !== caesar_bank_from?.caesar.id)}
              defaultValue={transferForm.from}
              value={transferForm.from}
              key={transferForm.amount}
              // disabled={!!caesar_bank_from?.caesar}
            />
          </>
        ) : (
          <>
            <FormLabel>From Bank Account</FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(caesarBank) => {
                setTransferForm((prev) => ({
                  ...prev,
                  caesar_bank_from: caesarBank,
                }))
              }}
              // defaultValue={transferForm.caesar_bank_from}
              // disabled={!!caesar_bank_from}
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
              if (caesar_bank_from?.caesar.id && !fromCaesaeEnabled) {
                getWalletById(caesar_bank_from?.caesar.id).then((res) => {
                  setTransferForm((prev) => ({
                    ...prev,
                    from: res,
                    caesar_bank_from: undefined,
                  }))
                  setFromCaesaeEnabled(true)
                })
              } else {
                setTransferForm((prev) => ({
                  ...prev,
                  from: undefined,
                  caesar_bank_from,
                }))
                setFromCaesaeEnabled(false)
              }
            }}
          >
            {fromCaesaeEnabled ? `Use Bank Account instead` : `Use Caesar Account instead`}
          </Link>
        </Tooltip>

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
              // value={transferForm.to}
              key={transferForm.amount}
            />
          </>
        ) : (
          <>
            <FormLabel>To Another Bank Account</FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(caesarBank) => {
                setTransferForm((prev) => ({
                  ...prev,
                  caesar_bank_to: caesarBank,
                  to: undefined,
                }))
              }}
              filter={(args) => {
                const retunrObject = args.filter((ea) =>
                  transferForm.caesar_bank_from?.id
                    ? transferForm.caesar_bank_from.id !== ea.id
                    : ea
                )

                return retunrObject
              }}
              defaultValue={transferForm?.caesar_bank_to || undefined}
              disabled={!!caesar_bank_to}
              // value={transferForm.caesar_bank_to}
              key={transferForm.amount}
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
          rows={2}
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
          value={transferForm.description}
        />

        <Box my={2} />

        <FormLabel>Message To Receiver</FormLabel>
        <FormTextField
          multiline
          name="message"
          rows={3}
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }}
          value={transferForm.message}
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

        {/* <FormLabel>Transaction Type:</FormLabel>
        <AsDropDown
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

export default TransferTypeTransaction
