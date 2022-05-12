/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Grow,
  IconButton,
  Link,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { Cancel, CloseOutlined, Edit, MonetizationOn, MoreVert } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import AsyncButton from '@src/components/AsyncButton'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CashTransferList from '@src/components/pages/cash-transfer/CashTransferList'
import LoanPaymentTypeTransaction from '@src/components/pages/cash-transfer/CreateLoanPaymentTypeTransaction'
import EditLoanDetailsModal from '@src/components/pages/cash-transfer/EditLoanDetailsModal'
import { PopUpMenu } from '@src/components/PopUpMenu'
import RoleBadge from '@src/components/RoleBadge'
import { formatIntoCurrency, formatIntoReadableDate } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useSWR from 'swr'

export default function ViewLoanPage() {
  const theme: Theme = useTheme()
  const { query } = useRouter()
  const { id } = query

  const [editMode, setEditMode] = useState<boolean>(false)

  const {
    data: cashTransferData,
    isValidating: cashTransferLoading,
    error: cashTransferError,
  } = useSWR(id ? `/cash-transfer/${id}` : undefined, (url) =>
    axios
      .get(url)
      .then((res) => res.data as CashTransferResponse)
      .then(async (res) => fetchCashTransferWithCompleteCaesar(res))
  )

  const {
    data: caesar,
    isValidating: caesarLoading,
    error: caesarError,
  } = useSWR(
    cashTransferData?.caesar_bank_to?.caesar?.id
      ? `/caesar/${cashTransferData.caesar_bank_to.caesar.id}`
      : undefined,
    (url) => axios.get(url).then((res) => res.data as CaesarWalletResponse)
  )

  const {
    data: loanPayments,
    isValidating: loanPaymentsLoading,
    error: loanPaymentsError,
  } = useSWR(
    cashTransferData?.id && id ? `/cash-transfer?loan=${cashTransferData?.id}` : undefined,
    (url) => axios.get(url).then((res) => res.data as Paginated<CashTransferResponse>)
  )

  useEffect(() => {
    if (cashTransferError) {
      console.log(cashTransferError)
    }
    if (loanPaymentsError) {
      console.log(loanPaymentsError)
    }
  }, [cashTransferError, loanPaymentsError])

  const paidAmount = useMemo(
    () =>
      loanPayments && loanPayments?.data.length > 0
        ? loanPayments?.data.reduce((acc, ea) => acc + ea.total_amount, 0)
        : 0,
    [loanPayments]
  )
  const [openRecordPayment, setOpenRecordPayment] = useState<boolean>(false)
  if (cashTransferError || loanPaymentsError || caesarError) {
    return <ErrorLoading />
  }
  // if (caesarLoading || cashTransferLoading || loanPaymentsLoading) {
  //   return (
  //     <LoadingScreen2
  //       containerProps={{
  //         style: {
  //           minHeight: 400,
  //         },
  //       }}
  //     />
  //   )
  // }

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper>
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  style={{
                    padding: 16,
                  }}
                  variant="outlined"
                >
                  <Box display="flex" justifyContent="space-between" position="relative">
                    <Box flexGrow={1} mr={2}>
                      <Box display="flex" width="100%" justifyContent="space-between" mb={2}>
                        <Typography
                          style={{
                            display: 'block',
                            alignSelf: 'flex-end',
                          }}
                          color="textSecondary"
                          variant="body2"
                        >
                          {cashTransferData?.id.split('-')[0]}
                        </Typography>
                        <Typography
                          style={{
                            display: 'block',
                            alignSelf: 'flex-end',
                            marginRight: 50,
                          }}
                          color="textSecondary"
                          variant="body2"
                        >
                          {formatIntoReadableDate(cashTransferData?.created_at || Date.now())}
                          {/* {console.log(cashTransferData?.created_at)} */}
                        </Typography>
                      </Box>
                      <RoleBadge disablePopUp variant="body1" color="primary">
                        {caesar?.account_type.toUpperCase()}
                      </RoleBadge>
                      <Typography variant="h4">Loan Details</Typography>
                      <Typography variant="body2">{caesar?.description.toUpperCase()}</Typography>

                      <Typography variant="caption"></Typography>

                      <Typography
                        style={{
                          marginTop: 16,
                          marginBottom: -8,
                          display: 'block',
                        }}
                        variant="caption"
                        color="primary"
                      >
                        Amount:{' '}
                      </Typography>
                      <Typography variant="h6">
                        {formatIntoCurrency(cashTransferData?.amount || 0)}
                      </Typography>
                      {!!cashTransferData?.bank_charge && (
                        <>
                          <Typography
                            style={{
                              marginBottom: -8,
                              display: 'block',
                            }}
                            variant="caption"
                            color="primary"
                          >
                            Fees:
                          </Typography>
                          <Typography variant="h6">
                            {formatIntoCurrency(cashTransferData?.bank_charge)}
                          </Typography>
                        </>
                      )}

                      <>
                        <Typography
                          style={{
                            marginBottom: -8,
                            display: 'block',
                          }}
                          variant="caption"
                          color="primary"
                        >
                          Interest:
                        </Typography>
                        <Typography variant="h6">
                          {cashTransferData?.interest || 0}%
                          {/* {formatIntoCurrency(cashTransferData?.bank_charge)} */}
                        </Typography>
                      </>
                      {cashTransferData?.interest && cashTransferData?.amount && (
                        <>
                          <Typography
                            style={{
                              marginBottom: -8,
                              display: 'block',
                            }}
                            variant="caption"
                            color="primary"
                          >
                            Interest Amount:
                          </Typography>
                          <Typography variant="h6">
                            {formatIntoCurrency(
                              (cashTransferData?.interest / 100) * cashTransferData?.amount
                            )}
                            {/* {formatIntoCurrency(cashTransferData?.bank_charge)} */}
                          </Typography>
                        </>
                      )}
                      <Box my={2} display="flex" justifyContent="flex-end" />
                      {cashTransferData?.total_amount && (
                        <Box textAlign="right">
                          <Typography
                            style={{
                              marginBottom: -8,
                              display: 'block',
                            }}
                            variant="body2"
                            color="primary"
                          >
                            Loan Payable:
                          </Typography>
                          <Typography
                            style={{
                              fontWeight: 600,
                            }}
                            variant="h4"
                          >
                            {formatIntoCurrency(cashTransferData.total_amount - paidAmount)}
                            {/* {formatIntoCurrency(cashTransferData?.bank_charge)} */}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                      }}
                      textAlign="end"
                    >
                      <>
                        <Tooltip
                          arrow
                          placement="left"
                          title={<Typography variant="body1">Edit Details</Typography>}
                        >
                          <IconButton
                            onClick={() => {
                              setEditMode(true)
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </>
                    </Box>
                  </Box>
                </Paper>

                <Box my={2} />
                <Paper variant="outlined">
                  <Box p={2}>
                    <Typography variant="h6">Payments Made</Typography>
                    <Box my={2} />
                    <FormLabel>Total: </FormLabel>
                    <Typography variant="body1">{formatIntoCurrency(paidAmount)}</Typography>
                    <Box my={2}>
                      <Divider />
                    </Box>
                    {cashTransferLoading && !id ? (
                      <LoadingScreen2 />
                    ) : (
                      <CashTransferList loanId={id as string} />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  {!openRecordPayment && (
                    <Button
                      style={{
                        padding: `8px 24px`,
                        // display: transactionModal.transactionSelected ? 'none' : undefined,
                      }}
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => {
                        setOpenRecordPayment((prev) => true)
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: 700,
                        }}
                        variant="body1"
                      >
                        RECORD PAYMENT
                      </Typography>
                      <Box ml={1} />
                      <MonetizationOn />
                    </Button>
                  )}

                  <Grow
                    style={{
                      display: openRecordPayment ? undefined : 'none',
                    }}
                    // unmountOnExit
                    in={openRecordPayment && cashTransferData && true}
                  >
                    <Paper variant="outlined">
                      <Box p={2}>
                        <Box position="relative">
                          <Box
                            style={{
                              position: 'absolute',
                              top: 0,
                              width: '100%',
                            }}
                            textAlign="end"
                          >
                            <IconButton
                              onClick={() => {
                                setOpenRecordPayment(false)
                              }}
                            >
                              <CloseOutlined />
                            </IconButton>
                          </Box>
                          {cashTransferData && openRecordPayment && (
                            <LoanPaymentTypeTransaction cash_transfer={cashTransferData!} />
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  </Grow>
                </Box>
                {/* </Paper> */}
              </Grid>
            </Grid>
          </Box>
        </Paper>
        {editMode && (
          <EditLoanDetailsModal
            open={editMode}
            onClose={() => {
              setEditMode(false)
            }}
            loanDetails={cashTransferData}
          />
        )}
      </Container>
    </>
  )
}

const fetchCashTransferWithCompleteCaesar = async (cashTransferProps: CashTransferResponse) => {
  const [from, to] = await axios.all([
    axios
      .get(`/caesar/${cashTransferProps?.from?.id || cashTransferProps.caesar_bank_from.caesar.id}`)
      .then((res) => res.data),
    axios
      .get(`/caesar/${cashTransferProps?.to?.id || cashTransferProps.caesar_bank_to}`)
      .then((res) => res.data),
  ])

  return {
    ...cashTransferProps,
    caesar_bank_from: {
      ...cashTransferProps.caesar_bank_from,
      caesar: from,
    },
    caesar_bank_to: {
      ...cashTransferProps.caesar_bank_to,
      caesar: to,
    },
    from,
    to,
  } as CashTransferResponse
}
