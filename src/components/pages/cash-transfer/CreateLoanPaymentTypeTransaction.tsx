/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, CircularProgress, Divider, Link, Tooltip, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification, { useErrorNotification } from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'

const LoanPaymentTypeTransaction = ({
  cash_transfer,
}: {
  // /**
  //  *caeasr account of the debtor
  //  */
  // caesar: CaesarWalletResponse['id']
  cash_transfer: CashTransferResponse
}) => {
  const [formValues, setFormValues] = useState<{
    id: CashTransferResponse['id']
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
    caesar_bank_to?: CaesarBank
    amount?: number
  }>({
    id: cash_transfer?.id,
    caesar_bank_from: cash_transfer?.caesar_bank_to,
    caesar_bank_to: cash_transfer?.caesar_bank_from,
    from: undefined,
    to: undefined,
    amount: undefined,
  })
  console.log('Form Values: ', formValues)
  //   const [cash_transfer, set_cash_transfer] = useState<CashTransferResponse>(cashTransferProps)
  const [resetValue, setResetValue] = useState<number>()

  const [fromCaesarEnabled, setFromCaesarEnabled] = useState<boolean>(false)
  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const { mutate } = useSWRConfig()
  const dispatchNotif = useNotification()

  const handleSubmit = () => {
    if (!formValues.from && !formValues.caesar_bank_from) {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: 'Source Account cannnot be empty',
      })
    } else if (!formValues.to && !formValues.caesar_bank_to) {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: 'Destination Account cannnot be empty',
      })
    } else if (formValues.amount === 0 || !formValues.amount) {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: 'Amount cannot be empty',
      })
    } else if (formValues.amount !== 0) {
      axios
        .post('/cash-transfer/loan-payment', formatFormValues({ ...formValues }))
        .then((res) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: 'Loan Payment Success',
          })
          setFormValues((prev) => ({
            ...prev,
            amount: undefined,
          }))
        })

        .catch((err) => {
          extractMultipleErrorFromResponse(err as AxiosError).forEach((ea) => {
            dispatchNotif({
              type: NotificationTypes.ERROR,
              message: ea,
            })
          })
        })
        .finally(() => {
          mutate(`/cash-transfer?loan=${formValues?.id}`, undefined, true)
          mutate(`/cash-transfer`, undefined, true)
          mutate(
            `/caesar/${formValues?.caesar_bank_from?.caesar?.id || formValues?.from?.id}`,
            undefined,
            true
          )
        })
    }
  }
  useEffect(() => {
    // DESTINATION ACCOUNT
    if (toCaesarEnabled && formValues.to === undefined) {
      setFormValues((prev) => ({
        ...prev,
        to: cash_transfer.from,
        caesar_bank_to: undefined,
      }))
    } else if (toCaesarEnabled && formValues.to === null) {
      setFormValues((prev) => ({
        ...prev,
        caesar_bank_to: undefined,
      }))
    } else if (!toCaesarEnabled && formValues.caesar_bank_to === undefined) {
      setFormValues((prev) => ({
        ...prev,
        to: undefined,
        caesar_bank_to: cash_transfer.caesar_bank_from,
      }))
    } else if (!toCaesarEnabled && formValues.caesar_bank_to === null) {
      setFormValues((prev) => ({
        ...prev,
        to: undefined,
      }))
    }

    // SOURCE ACCOUNT
    if (fromCaesarEnabled && formValues.from === undefined) {
      setFormValues((prev) => ({
        ...prev,
        from: cash_transfer.to,
        caesar_bank_from: undefined,
      }))
    } else if (fromCaesarEnabled && formValues.from === null) {
      setFormValues((prev) => ({
        ...prev,
        caesar_bank_from: undefined,
      }))
    } else if (!fromCaesarEnabled && formValues.caesar_bank_from === undefined) {
      setFormValues((prev) => ({
        ...prev,
        from: undefined,
        caesar_bank_from: cash_transfer.caesar_bank_to,
      }))
    } else if (!fromCaesarEnabled && formValues.caesar_bank_from === null) {
      setFormValues((prev) => ({
        ...prev,
        from: undefined,
      }))
    }
  }, [toCaesarEnabled, fromCaesarEnabled, cash_transfer])

  return (
    <>
      <Box>
        <Typography variant="h4">Loan Payment</Typography>
        <Typography variant="body2" color="textSecondary">
          Record payment to this Loan
        </Typography>
        <Box my={2}>
          <Divider />
        </Box>
        {fromCaesarEnabled ? (
          <>
            <FormLabel>Payment from User</FormLabel>
            {cash_transfer?.to ? (
              <ToCaesarAutoComplete
                // disabled
                onChange={(cFrom) => {
                  // setFormValues('caesar_bank_from', cbFrom)
                  setFormValues((prev) => ({
                    ...prev,
                    from: cFrom,
                  }))
                }}
                defaultValue={formValues?.from || cash_transfer?.to}
              />
            ) : (
              <Box>
                <CircularProgress />
              </Box>
            )}
          </>
        ) : (
          <>
            <FormLabel>Payment from Bank Account</FormLabel>

            <ToCaesarBankAutoComplete
              // disabled
              onChange={(cbFrom) => {
                setFormValues((prev) => ({
                  ...prev,
                  caesar_bank_from: cbFrom,
                }))
              }}
              defaultValue={
                formValues?.caesar_bank_from || cash_transfer?.caesar_bank_to || undefined
              }
              additionalParams={{
                ceasar:
                  formValues?.caesar_bank_from?.caesar.id ||
                  cash_transfer?.caesar_bank_to?.caesar.id,
              }}
            />
            {/* ) : (
              <>
                <Box>
                  <CircularProgress />
                </Box>
              </>
            )} */}
          </>
        )}

        <SwitchToCaesarBankOrCaesarToggle
          onClick={() => {
            setFromCaesarEnabled((prev) => !prev)
          }}
          toggled={fromCaesarEnabled}
        />

        <Box my={2} />

        {toCaesarEnabled ? (
          <>
            <FormLabel>Payment To User </FormLabel>
            <ToCaesarAutoComplete
              onChange={(toCaesar) => {
                // setFormValues('caesar_bank_from', cbFrom)
                setFormValues((prev) => ({
                  ...prev,
                  to: toCaesar,
                }))
              }}
              defaultValue={formValues?.to || cash_transfer?.from}
              key={resetValue}
            />
          </>
        ) : (
          <>
            <FormLabel>Payment To Bank Account </FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(cbFrom) => {
                setFormValues((prev) => ({
                  ...prev,
                  caesar_bank_to: cbFrom,
                }))
              }}
              defaultValue={formValues.caesar_bank_to || cash_transfer.caesar_bank_from}
              key={resetValue}
            />
          </>
        )}
      </Box>

      <SwitchToCaesarBankOrCaesarToggle
        onClick={() => {
          setToCaesarEnabled((prev) => !prev)
        }}
        toggled={toCaesarEnabled}
      />

      <Box my={2} />

      <FormLabel>Amount</FormLabel>
      <FormNumberField
        onChange={(value) => {
          setFormValues((prev) => ({
            ...prev,
            amount: value,
          }))
        }}
        value={formValues.amount}
      />

      <Box my={2} />

      <AsyncButton onClick={handleSubmit} fullWidth>
        SUBMIT
      </AsyncButton>
    </>
  )
}

const SwitchToCaesarBankOrCaesarToggle = ({
  onClick,
  toggled,
}: {
  onClick: () => void
  toggled: boolean
}) => (
  <Tooltip
    arrow
    placement="right"
    title={
      <Typography variant="subtitle2">
        Record as Transaction to {!toggled ? 'Caesar' : `Caesar's Bank Account`}{' '}
      </Typography>
    }
  >
    <Link component="button" color="textSecondary" variant="caption" onClick={onClick}>
      {toggled ? `Use Bank Account instead` : `Use Caesar Account instead`}
    </Link>
  </Tooltip>
)
export default LoanPaymentTypeTransaction

const formatFormValues = (params: {
  id: CashTransferResponse['id']
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
  from?: CaesarWalletResponse
  caesar_bank_to?: CaesarBank
  amount?: number
}) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object') {
      return { ...acc, [key]: value.id }
    }
    return acc
  }, params)
