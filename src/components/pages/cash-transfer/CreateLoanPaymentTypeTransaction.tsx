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
    from: cash_transfer?.to,
    to: cash_transfer?.from,
    amount: undefined,
  })

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
        .then((res) => {
          console.log('fetch', res)
          return res
        })
  )

  function handleSubmit() {
    console.log('form', formValues)

    /**
     * handle post here
     */
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

          <ToCaesarAndCaesarBank
            caesarMode={!data?.caesar_bank_to}
            caesar={data?.to || undefined}
            caesarBank={data?.caesar_bank_to || undefined}
            onChange={(e) => {
              console.log('e', e)
              setFormValues((prev) => ({
                ...prev,
                [data?.to ? 'from' : 'caesar_bank_from']: e,
              }))
            }}
            disabled
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

const formatFormValues = (
  params: {
    id: CashTransferResponse['id']
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
    caesar_bank_to?: CaesarBank
    amount?: number
  },
  {
    toCaesarEnabled,
    fromCaesarEnabled,
  }: {
    toCaesarEnabled: boolean
    fromCaesarEnabled: boolean
  }
) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object') {
      return { ...acc, [key]: value.id }
    }
    return acc
  }, params)
