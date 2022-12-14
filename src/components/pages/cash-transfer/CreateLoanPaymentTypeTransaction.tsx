/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Divider, Grid, Link, Paper, Tooltip, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import ConfirmationModal from '@src/components/ConfirmationModal'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse, formatIntoCurrency } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import axios, { AxiosError } from 'axios'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

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
  const [confirmation, setConfirmation] = useState<boolean>(false)

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
    /**
     * handle post here
     */

    setConfirmation(true)

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
          setConfirmation(false)
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
        <Typography variant="h4">
          {cash_transfer.as === CashTransferAs.LOAN ? 'Loan' : 'Load'} Payment
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Record payment to this {cash_transfer.as === CashTransferAs.LOAN ? 'Loan' : 'Load'}
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

      <AsyncButton
        loading={loading}
        disabled={loading}
        onClick={() => {
          setConfirmation(true)
        }}
        fullWidth
      >
        SUBMIT
      </AsyncButton>
      {confirmation && (
        <ConfirmationModal
          open={confirmation}
          handleClose={() => {
            setConfirmation(false)
          }}
          submitFunction={handleSubmit}
          ctData={formValues}
          renderProps={(formValues) => (
            <Paper style={{ padding: 16 }}>
              <Grid container spacing={1} style={{ textAlign: 'left' }}>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between" alignItems="baseline">
                    <Box>
                      <FormLabel>From:</FormLabel>
                    </Box>
                    <Box>
                      <Typography>{formValues?.caesar_bank_from?.description}</Typography>
                    </Box>
                  </Box>
                  <Box pt={1}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <FormLabel>To:</FormLabel>
                    </Box>
                    <Box>
                      <Typography>
                        {formValues?.caesar_bank_to?.description || formValues?.to?.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box pt={1}>
                    <Divider />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box display="flex" justifyContent="space-between">
                    <Box>
                      <FormLabel>Amount:</FormLabel>
                    </Box>
                    <Box>
                      <Typography>{formatIntoCurrency(formValues?.amount as number)}</Typography>
                    </Box>
                  </Box>
                  <Box pt={1}>
                    <Divider />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}
        />
      )}
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
        Record as Transaction to {!toggled ? 'Caesar' : "Caesar's Bank Account"}
      </Typography>
    }
  >
    <Link component="button" color="textSecondary" variant="caption" onClick={onClick}>
      {toggled ? 'Use Bank Account instead' : 'Use Caesar Account instead'}
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
