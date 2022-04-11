import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Grow,
  IconButton,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { CloseOutlined, MonetizationOn } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import RoleBadge from '@src/components/RoleBadge'
import { formatIntoCurrency, formatIntoReadableDate } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

export default function ViewLoanPage() {
  const theme: Theme = useTheme()
  const { query } = useRouter()
  const { id } = query

  const {
    data: cashTransferData,
    isValidating: cashTransferLoading,
    error: cashTransferError,
  } = useSWR(id ? `/cash-transfer/${id}` : undefined, (url) =>
    axios.get(url).then((res) => res.data as CashTransferResponse)
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
  } = useSWR<CashTransferResponse[]>(
    cashTransferData?.id && id ? `/cash-transfer/${id}?loan=${cashTransferData?.id}` : undefined,
    (url) => axios.get(url).then((res) => res.data)
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
      loanPayments && loanPayments.length > 0
        ? loanPayments.reduce((acc, ea) => acc + ea.total_amount, 0)
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
                <Paper variant="outlined">
                  <Box p={2}>
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
                        }}
                        color="textSecondary"
                        variant="body2"
                      >
                        {formatIntoReadableDate(cashTransferData?.created_at || Date.now())}
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
                    {cashTransferData?.bank_charge && (
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
                    {cashTransferData?.total_amount && (
                      <>
                        <Typography
                          style={{
                            marginBottom: -8,
                            display: 'block',
                          }}
                          variant="caption"
                          color="primary"
                        >
                          Loan Payable:
                        </Typography>
                        <Typography variant="h6">
                          {formatIntoCurrency(cashTransferData.total_amount)}
                          {/* {formatIntoCurrency(cashTransferData?.bank_charge)} */}
                        </Typography>
                      </>
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper>
                  <Box p={2}>
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

                    {openRecordPayment}
                    <Grow
                      style={{
                        display: openRecordPayment ? undefined : 'none',
                      }}
                      // unmountOnExit
                      in={openRecordPayment && cashTransferData && true}
                    >
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
                        <CreateLoanPayment cash_transfer={cashTransferData!} />
                      </Box>
                    </Grow>
                  </Box>
                </Paper>

                <pre>{JSON.stringify(cashTransferData, null, 2)}</pre>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

const CreateLoanPayment = ({
  cash_transfer,
}: {
  // /**
  //  *caeasr account of the debtor
  //  */
  // caesar: CaesarWalletResponse['id']
  cash_transfer: CashTransferResponse
}) => {
  const [formValues, setFormValues] = useState({
    caesar_bank_from: undefined,
  })
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
        <FormLabel>From Caesar's Bank Account</FormLabel>
      </Box>
    </>
  )
}
