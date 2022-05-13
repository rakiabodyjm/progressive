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
  const [formValues, _setFormValues] = useState<{
    id: CashTransferResponse['id']
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
    caesar_bank_to?: CaesarBank
    amount?: number
  }>({
    id: cash_transfer?.id,
    caesar_bank_from: cash_transfer?.caesar_bank_to,
    to: cash_transfer?.caesar_bank_from.caesar,
    from: cash_transfer?.caesar_bank_to?.caesar,
    caesar_bank_to: cash_transfer?.caesar_bank_from,
    amount: undefined,
  })

  //   const [cash_transfer, set_cash_transfer] = useState<CashTransferResponse>(cashTransferProps)

  const setFormValues = useCallback(
    (param: keyof typeof formValues, value: any) => {
      _setFormValues((prev) => ({
        ...prev,
        [param]: value,
      }))
    },
    [_setFormValues]
  )

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [resetValue, setResetValue] = useState<number>()

  const [fromCaesarEnabled, setFromCaesarEnabled] = useState<boolean>(false)
  const { mutate } = useSWRConfig()
  const submitFunction = useCallback(
    () =>
      axios.post('/cash-transfer/loan-payment', formatFormValues({ ...formValues })).finally(() => {
        mutate(`/cash-transfer?loan=${formValues?.id}`, undefined, true)
        mutate(`/cash-transfer`, undefined, true)
        mutate(
          `/caesar/${formValues?.caesar_bank_from?.caesar?.id || formValues?.from?.id}`,
          undefined,
          true
        )
      }),
    [formValues, mutate]
  )
  const { error, loading, response, submit } = useSubmitFormData({
    submitFunction,
  })

  const dispatchNotif = useNotification()
  useEffect(() => {
    if (error) {
      console.log(error)
      extractMultipleErrorFromResponse(error as AxiosError).forEach((ea) => {
        dispatchNotif({
          type: NotificationTypes.ERROR,
          message: ea,
        })
      })
    }
  }, [error, dispatchNotif])

  useEffect(() => {
    if (response) {
      dispatchNotif({
        type: NotificationTypes.SUCCESS,
        message: `Loan Payment successfully posted`,
      })
      _setFormValues({
        id: cash_transfer?.id,
        caesar_bank_from: cash_transfer?.caesar_bank_to,
        from: cash_transfer?.caesar_bank_to?.caesar || cash_transfer?.to,
        caesar_bank_to: undefined,
        to: undefined,
        amount: 0,
      })
      setResetValue(Date.now())
    }
  }, [response, cash_transfer, dispatchNotif])

  useEffect(() => {
    if (toCaesarEnabled) {
      setFormValues('caesar_bank_to', undefined)
      setFormValues('to', formValues?.caesar_bank_from?.caesar || cash_transfer?.from)
    }
    if (fromCaesarEnabled) {
      setFormValues('caesar_bank_from', undefined)
      setFormValues('from', formValues?.caesar_bank_to?.caesar || cash_transfer?.to)
    }
  }, [toCaesarEnabled, fromCaesarEnabled, setFormValues])

  useEffect(() => {
    if (!toCaesarEnabled && formValues?.caesar_bank_to) {
      setFormValues('to', formValues?.caesar_bank_to?.caesar)
    }
    if (!fromCaesarEnabled && formValues?.caesar_bank_from) {
      setFormValues('from', formValues?.caesar_bank_from?.caesar)
    }
  }, [
    formValues.caesar_bank_from,
    formValues.caesar_bank_to,
    toCaesarEnabled,
    fromCaesarEnabled,
    setFormValues,
    cash_transfer,
  ])

  const dispatchError = useErrorNotification()
  const handleSubmit = useCallback(() => {
    if (!formValues?.amount) {
      dispatchError(`Amount must not be empty or should be greater than 0`)
      return
    }
    if (!formValues?.from && !formValues?.caesar_bank_from) {
      dispatchError(`Source Account must not be empty`)
      return
    }
    if (!formValues?.to && !formValues?.caesar_bank_to) {
      dispatchError(`Destination ACcount must not be empty`)
      return
    }
    submit()
  }, [formValues, dispatchError, submit])

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
                  setFormValues('from', cFrom)
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
            {/* {console.log(cash_transfer?.caesar_bank_to, cash_transfer?.to)} */}
            {/* {cash_transfer?.caesar_bank_to || formValues?.caesar_bank_from ? ( */}
            <ToCaesarBankAutoComplete
              // disabled
              onChange={(cbFrom) => {
                setFormValues('caesar_bank_from', cbFrom)
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
                setFormValues('to', toCaesar)
              }}
              defaultValue={formValues.to}
              key={resetValue}
              value={formValues.to}
            />
          </>
        ) : (
          <>
            <FormLabel>Payment To Bank Account </FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(cbFrom) => {
                setFormValues('caesar_bank_to', cbFrom)
              }}
              defaultValue={formValues.caesar_bank_to}
              value={formValues.caesar_bank_to}
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
          setFormValues('amount', value)
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