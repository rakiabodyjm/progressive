/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/anchor-is-valid */

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddOutlined, CloseOutlined } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import CashTransfer from '@src/pages/admin/topup'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  formatIntoReadableDate,
} from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import { CaesarBank, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'

export default function DirectPaidModal({
  open,
  handleClose,
  loanData,
  triggeredRender,
}: {
  open: boolean
  handleClose: () => void
  loanData?: CashTransferResponse
  triggeredRender: () => void
}) {
  const dispatchNotif = useNotification()

  const router = useRouter()
  const [visibleChip, setVisibleChip] = useState<boolean>(false)
  const [specificAmount, setSpecificAmount] = useState<boolean>(false)

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)

  const {
    data: loanPayments,
    isValidating: loanPaymentsLoading,
    error: loanPaymentsError,
  } = useSWR(loanData?.id ? `/cash-transfer?loan=${loanData?.id}` : undefined, (url) =>
    axios.get(url).then((res) => res.data as Paginated<CashTransferResponse>)
  )

  const paidAmount = useMemo(
    () =>
      loanPayments && loanPayments?.data.length > 0
        ? loanPayments?.data.reduce((acc, ea) => acc + ea.total_amount, 0)
        : 0,
    [loanPayments]
  )

  const [formValues, setFormValues] = useState<{
    id?: CashTransferResponse['id']
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
    caesar_bank_to?: CaesarBank
    amount?: number
  }>({
    id: loanData?.id,
    caesar_bank_from: loanData?.caesar_bank_to,
    caesar_bank_to: loanData?.caesar_bank_from,
    from: undefined,
    to: undefined,
    amount: (loanData?.total_amount as number) - paidAmount || 0,
  })

  useEffect(() => {
    if (toCaesarEnabled && formValues.to === undefined) {
      setFormValues((prev) => ({
        ...prev,
        to: loanData?.from,
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
        // caesar_bank_to: loanData?.caesar_bank_from,
      }))
    } else if (!toCaesarEnabled && formValues.caesar_bank_to === null) {
      setFormValues((prev) => ({
        ...prev,
        to: undefined,
      }))
    }
  }, [toCaesarEnabled, loanData])

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
          triggeredRender()
          handleClose()
        })
    }
  }

  return (
    <ModalWrapper containerSize="xs" open={open} onClose={handleClose}>
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        {loanData && (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <FormLabel>Transaction Type:</FormLabel>
                <Typography variant="h5">Loan Payment</Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormLabel>Date loaned:</FormLabel>
                    <Typography>
                      {formatIntoReadableDate(loanData?.created_at || Date.now())}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography>{cashTransferData?.id.split('-')[0]}</Typography>
                  </Grid> */}

                  <Grid item xs={12} sm={6}>
                    <FormLabel>From:</FormLabel>
                    <Typography>
                      {loanData?.caesar_bank_to?.description ||
                        loanData?.to?.description ||
                        'ERROR'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>To:</FormLabel>
                    <Typography>
                      {formValues.caesar_bank_to
                        ? formValues.caesar_bank_to.description
                        : formValues.to?.description
                        ? formValues.to?.description
                        : '<Empty>'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <FormLabel>Payable Loan:</FormLabel>
                    <Typography>
                      {formatIntoCurrency(loanData.total_amount - paidAmount)}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <FormLabel>Payment Amount:</FormLabel>
                    <Typography>{formatIntoCurrency(formValues?.amount as number)}</Typography>
                  </Grid>

                  <Box my={2}>
                    <Chip
                      avatar={
                        <IconButton>
                          <AddOutlined />
                        </IconButton>
                      }
                      style={{
                        display: visibleChip ? 'none' : undefined,
                      }}
                      onClick={() => {
                        setVisibleChip(true)
                      }}
                      label="Select other Destination Account"
                    />
                  </Box>
                  <Box my={2} />
                  <Grid item xs={12}>
                    {visibleChip && (
                      <Box my={1}>
                        <Paper>
                          <Box p={2}>
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="flex-start"
                            >
                              <FormLabel>Change Destination Account</FormLabel>
                              <IconButton
                                style={{
                                  padding: 2,
                                  marginBottom: 8,
                                }}
                                onClick={() => {
                                  setVisibleChip(false)
                                  if (!formValues.caesar_bank_to && !formValues.to) {
                                    setFormValues((prev) => ({
                                      ...prev,
                                      caesar_bank_to: loanData.caesar_bank_from,
                                    }))
                                  }
                                }}
                              >
                                <CloseOutlined
                                  style={{
                                    fontSize: 16,
                                  }}
                                />
                              </IconButton>
                            </Box>
                            {loanData && toCaesarEnabled ? (
                              <>
                                <ToCaesarAutoComplete
                                  onChange={(toCaesar) => {
                                    // setFormValues('caesar_bank_from', cbFrom)
                                    setFormValues((prev) => ({
                                      ...prev,
                                      to: toCaesar,
                                    }))
                                  }}
                                  defaultValue={formValues?.to || loanData?.from}
                                  //   key={resetValue}
                                />
                              </>
                            ) : (
                              <>
                                <ToCaesarBankAutoComplete
                                  onChange={(cbFrom) => {
                                    setFormValues((prev) => ({
                                      ...prev,
                                      caesar_bank_to: cbFrom,
                                    }))
                                  }}
                                  // defaultValue={
                                  //   formValues.caesar_bank_to || loanData.caesar_bank_from
                                  // }
                                  //   key={resetValue}
                                />
                              </>
                            )}
                            <SwitchToCaesarBankOrCaesarToggle
                              onClick={() => {
                                setToCaesarEnabled((prev) => !prev)
                              }}
                              toggled={toCaesarEnabled}
                            />

                            <Box>
                              <Box my={1}>
                                <Chip
                                  avatar={
                                    <IconButton>
                                      <AddOutlined />
                                    </IconButton>
                                  }
                                  style={{
                                    display: specificAmount ? 'none' : undefined,
                                  }}
                                  onClick={() => {
                                    setSpecificAmount(true)
                                  }}
                                  label="Set Amount"
                                />
                              </Box>
                              {specificAmount && (
                                <>
                                  <FormLabel>Amount</FormLabel>
                                  <FormNumberField
                                    onChange={(value) => {
                                      setFormValues((prev) => ({
                                        ...prev,
                                        amount: value,
                                      }))
                                    }}
                                    value={formValues.amount as number}
                                  ></FormNumberField>
                                </>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mt={2}>
                <Button color="primary" variant="contained" onClick={handleSubmit}>
                  Mark as Paid
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </ModalWrapper>
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
const formatFormValues = (params: {
  id?: CashTransferResponse['id']
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
