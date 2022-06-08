/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, CircularProgress, Divider, Link, Tooltip, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import ToCaesarAndCaesarBank from '@src/components/pages/cash-transfer/ToCaesarAndCaesarBank'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import useNotification, { useErrorNotification } from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import axios, { AxiosError } from 'axios'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

const LoanPaymentTypeTransaction = ({
  cash_transfer,
  triggerMutate,
}: {
  // /**
  //  *caeasr account of the debtor
  //  */
  // caesar: CaesarWalletResponse['id']
  cash_transfer: CashTransferResponse
  triggerMutate: () => void
}) => {
  const [formValues, setFormValues] = useState<{
    id: CashTransferResponse['id']
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    // from?: CaesarWalletResponse
    caesar_bank_to?: CaesarBank
    amount?: number
  }>({
    id: cash_transfer?.id,
    caesar_bank_from: cash_transfer?.caesar_bank_to,
    caesar_bank_to: cash_transfer?.caesar_bank_from,
    // from: cash_transfer?.to,
    to: undefined,
    amount: undefined,
  })
  const dispatchNotif = useNotification()

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { data, isValidating } = useSWR(
    cash_transfer ? `/cash-transfer/${cash_transfer.id}` : null,
    (url) =>
      axios
        .get<CashTransferResponse>(url)
        .then(async (res) => ({
          ...res.data,
          ...(res.data.from && {
            from: await getWalletById(res.data.from.id),
          }),
          ...(res.data.to && {
            to: await getWalletById(res.data.to.id),
          }),
        }))
        .then((res) => res)
  )

  useEffect(() => {
    if (toCaesarEnabled && !formValues.to) {
      setFormValues((prev) => ({
        ...prev,
        to: cash_transfer?.from,
        caesar_bank_to: undefined,
      }))
    } else if (!toCaesarEnabled && !formValues.caesar_bank_to) {
      setFormValues((prev) => ({
        ...prev,
        caesar_bank_to: cash_transfer.caesar_bank_from,
        to: undefined,
      }))
    }
  }, [toCaesarEnabled])

  const handleSubmit = () => {
    console.log('form', formValues)
    console.log('Cash Transfers:', cash_transfer)
    console.log('Data:', data)

    /**
     * handle post here
     */

    setLoading(true)
    if (formValues?.amount !== 0) {
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
          setLoading(false)
          triggerMutate()
        })
    } else {
      setLoading(false)
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: 'Amount cannot be 0',
      })
    }
  }

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

        <>
          <FormLabel>From {data?.caesar_bank_to ? 'Bank' : 'Caesar'} Account </FormLabel>

          <ToCaesarBankAutoComplete
            onChange={(cbFrom) => {
              // setFormValues('caesar_bank_from', cbFrom)
              setFormValues((prev) => ({
                ...prev,
                caesar_bank_from: cbFrom,
              }))
            }}
            defaultValue={formValues?.caesar_bank_from}
            disabled
            // key={resetValue}
          />
        </>

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
                  caesar_bank_to: undefined,
                }))
              }}
              defaultValue={formValues?.to || cash_transfer?.from}
              // key={resetValue}
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
                  to: undefined,
                }))
              }}
              defaultValue={formValues.caesar_bank_to || cash_transfer.caesar_bank_from}
              // key={resetValue}
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

      <AsyncButton loading={loading} disabled={loading} onClick={handleSubmit} fullWidth>
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
    placement="bottom"
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
