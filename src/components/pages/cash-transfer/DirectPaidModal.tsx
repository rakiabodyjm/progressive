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
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import OTPModal from '@src/components/pages/cash-transfer/OTPModal'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import CashTransfer from '@src/pages/admin/topup'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  formatIntoReadableDate,
} from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import { OTPData, OtpRequestTypes, OTPTypes } from '@src/utils/types/OTPTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios, { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
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

  const user = useSelector(userDataSelector)

  const router = useRouter()
  const [visibleChip, setVisibleChip] = useState<boolean>(false)
  const [specificAmount, setSpecificAmount] = useState<boolean>(false)
  const [isRequestOtp, setIsRequestOtp] = useState<boolean>(false)
  const [paid, setPaid] = useState<boolean>(false)

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [openOtp, setOpenOtp] = useState<boolean>(false)
  const [otp, setOtp] = useState<OTPTypes>()
  const dispatch = useDispatch()

  const formattedPhoneNumber: OtpRequestTypes = {
    to: `+63${loanData?.caesar_bank_to.account_number.substring(1)}`,
    cash_transfer: loanData?.id,
  }

  const otpPassed = (isPaid: boolean) => {
    setPaid(isPaid)
  }

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
    from: loanData?.from,
    to: loanData?.to,
    amount: (loanData?.total_amount && loanData.total_amount - paidAmount) || 0,
  })

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      amount: (loanData?.total_amount as number) - paidAmount,
    }))
  }, [loanData?.total_amount, paidAmount])

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

  const requestOTP = () => {
    axios
      .post('/otp', formattedPhoneNumber)
      .then((res) => setOtp(res.data as OTPTypes))
      .catch((err) => extractMultipleErrorFromResponse(err))
  }

  useEffect(() => {
    if (isRequestOtp && otp?.otp) {
      dispatch(
        setNotification({
          type: NotificationTypes.SUCCESS,
          message: 'OTP Request Sent',
        })
      )
    }
  }, [otp?.otp, isRequestOtp])

  const handleSubmit = () => {
    setLoading(true)
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
          setLoading(false)
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
                <Typography color="textSecondary" variant="caption">
                  {loanData.ref_num}
                </Typography>
                <FormLabel>Transaction Type:</FormLabel>
                <Typography variant="h5">
                  {loanData.as === CashTransferAs.LOAN ? 'Loan' : 'Load'} Payment
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Grid spacing={1} container>
                  <Grid item xs={12}>
                    <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                  </Grid>

                  <Grid item xs={12}>
                    <FormLabel>
                      Date {loanData.as === CashTransferAs.LOAN ? 'loaned:' : 'loaded'}
                    </FormLabel>
                    <Typography color="textSecondary">
                      {formatIntoReadableDate(loanData?.created_at || Date.now())}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography
                      variant="body2"
                      style={{
                        fontWeight: 600,
                      }}
                    >
                      This will automatically generate Loan Payment Transaction as written below:
                    </Typography>
                  </Grid>
                  <Grid item container>
                    <Paper
                      style={{
                        padding: 16,
                      }}
                    >
                      <Grid item container spacing={1}>
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
                          <FormLabel>
                            Payable {loanData.as === CashTransferAs.LOAN ? 'Loan' : 'Load'}:
                          </FormLabel>
                          <Typography>
                            {formatIntoCurrency(loanData.total_amount - paidAmount)}
                          </Typography>
                        </Grid>

                        <Grid item xs={6}>
                          <FormLabel>Payment Amount:</FormLabel>
                          <Typography>
                            {formatIntoCurrency(formValues?.amount as number)}
                          </Typography>
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
                        {/* <Box my={2} /> */}
                        {visibleChip && (
                          <Grid item xs={12}>
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
                          </Grid>
                        )}
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box display="flex" mt={2} justifyContent="space-between">
              {!user?.retailer_id ? (
                <Button
                  variant="contained"
                  onClick={() => {
                    router.push({
                      pathname: '/cash-transfer/loan/[id]',
                      query: {
                        id: loanData.id,
                      },
                    })
                  }}
                >
                  Go to Page
                </Button>
              ) : (
                <Box></Box>
              )}
              {paid ? (
                <>
                  <AsyncButton
                    loading={loading}
                    disabled={loading}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      handleSubmit()
                    }}
                  >
                    Mark as Paid
                  </AsyncButton>
                </>
              ) : (
                <>
                  <AsyncButton
                    loading={loading}
                    disabled={loading}
                    color="primary"
                    variant="contained"
                    onClick={() => {
                      setOpenOtp(true)
                      setIsRequestOtp(true)
                      requestOTP()
                    }}
                  >
                    Confirm
                  </AsyncButton>
                </>
              )}
            </Box>

            {openOtp && otp?.otp ? (
              <OTPModal
                open={openOtp}
                handleClose={() => setOpenOtp(false)}
                otpData={otp?.otp as OTPData}
                otpPass={otpPassed}
              />
            ) : (
              <></>
            )}
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
