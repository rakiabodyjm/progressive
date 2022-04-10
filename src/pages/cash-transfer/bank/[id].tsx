/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CreateNewTransactionModal from '@src/components/pages/cash-transfer/CreateNewTransactionModal'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { CloseOutlined, ErrorOutline, MonetizationOn } from '@material-ui/icons'
import useSWR from 'swr'
import CashTransferForm from '@src/components/pages/cash-transfer/CashTransferForm'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import RoleBadge from '@src/components/RoleBadge'
import { useTheme } from '@material-ui/styles'
import CashTransferList from '@src/components/pages/cash-transfer/CashTransferList'
import { formatIntoCurrency } from '@src/utils/api/common'

/**
 *
 * Deposit to CaesarBank
 *
 * View CaesarBank Transactions
 *
 */
export default function ViewCaesarBankPage() {
  const router = useRouter()
  const { query } = router
  const id = useMemo(() => query?.id, [query])

  const {
    data: caesarBankData,
    error: caesarBankError,
    isValidating: caesarBankLoading,
  } = useSWR<CaesarBank>(id ? `/cash-transfer/caesar-bank/${id}` : null, (url) =>
    axios.get(url).then((res) => res.data)
  )

  // const {
  //   data: caesarBankTransactions,
  //   error: caesarBankTransactionsError,
  //   isValidating: caesarBankTransactionLoading,
  // } = useSWR(id ? `/cash-transfer/caesar-bank` : undefined)

  const {
    data: caesarData,
    error: ceasarError,
    isValidating: caesarValidating,
    mutate,
  } = useSWR<CaesarWalletResponse>(
    caesarBankData?.caesar?.id ? `/caesar/${caesarBankData?.caesar?.id}` : undefined,
    () => getWalletById(caesarBankData!.caesar!.id)
  )

  const caesar = useMemo(() => {
    if (caesarData) {
      return caesarData
    }

    return undefined
  }, [caesarData])

  const [transactionModal, setTransactionModal] = useState<{
    transactionModalOpen: boolean
    transactionSelected?: 'withdraw' | 'transfer' | 'deposit'
  }>({
    transactionModalOpen: false,
    transactionSelected: undefined,
  })

  const roles: string[] | undefined = useSelector(userDataSelector)?.roles

  const { transactionSelected } = transactionModal
  const theme: Theme = useTheme()

  if (ceasarError || caesarBankError) {
    return <ErrorLoading />
  }

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper variant="outlined">
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  style={{
                    padding: 16,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ErrorOutline color="error" />

                    <Typography
                      style={{
                        marginLeft: 4,
                        fontWeight: 500,
                        letterSpacing: 2,
                        alignItems: 'center',
                        display: 'inline',
                      }}
                      color="error"
                      variant="body1"
                    >
                      TIP / GUIDE:
                    </Typography>
                  </Box>

                  <Box my={1}>
                    <Divider />
                  </Box>

                  <Box display="inline">
                    <Typography color="error" variant="body2">
                      Sender's Bank Fee:{' '}
                    </Typography>
                    <Typography variant="caption">
                      - Add this on top of your Bank Fee for Loans
                    </Typography>
                  </Box>
                  {/* <Box mt={2} display="inline">
                    <Typography color="error" variant="body2">'
                      
                    </Typography>
                    <Typography variant="caption">
                      Add this on top of your Bank Fee for Loans
                    </Typography>
                  </Box> */}
                </Paper>
                <Box my={2} />

                <Paper variant="outlined">
                  <Box p={2}>
                    {caesarBankData && caesarData ? (
                      <>
                        <RoleBadge disablePopUp variant="body1" color="primary">
                          {caesarData.description}
                        </RoleBadge>
                        <Typography variant="h4">
                          <Typography color="primary" component="span" variant="h4">
                            {caesarBankData.bank.name}
                          </Typography>{' '}
                          Transactions
                        </Typography>
                        <Typography variant="body2">{caesarBankData.description}</Typography>
                        <Typography
                          style={{
                            marginTop: 16,
                            marginBottom: -8,
                            display: 'block',
                          }}
                          variant="caption"
                          color="primary"
                        >
                          Bank Balance:{' '}
                        </Typography>
                        <Typography variant="h6">
                          {formatIntoCurrency(caesarBankData?.balance)}
                        </Typography>
                        <Box my={2}></Box>

                        <Box my={2}>
                          <Divider />
                        </Box>
                        <CashTransferList caesarBankId={caesarBankData.id} />
                      </>
                    ) : (
                      <LoadingScreen2 />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  style={{
                    padding: `8px 24px`,
                    display: transactionModal.transactionSelected ? 'none' : undefined,
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: true,
                    }))
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 700,
                    }}
                    variant="body1"
                  >
                    NEW TRANSACTION
                  </Typography>
                  <Box ml={1} />
                  <MonetizationOn />
                </Button>

                {transactionModal?.transactionSelected && (
                  <Box
                    style={{
                      position: 'relative',
                    }}
                    py={0}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                      }}
                      textAlign="end"
                    >
                      <IconButton
                        style={{
                          marginRight: 16,
                          marginTop: 16,
                        }}
                        onClick={() => {
                          setTransactionModal((prev) => ({
                            ...prev,
                            transactionSelected: undefined,
                          }))
                        }}
                      >
                        <CloseOutlined />
                      </IconButton>
                    </Box>
                    {transactionSelected && (
                      <CashTransferForm
                        {...(transactionSelected === 'transfer' && {
                          caesar_bank_from: caesarBankData,
                        })}
                        {...(transactionSelected === 'withdraw' && {
                          caesar_bank_from: caesarBankData,
                        })}
                        {...(transactionSelected === 'deposit' && {
                          caesar_bank_to: caesarBankData,
                          from: caesar,
                        })}
                        transactionType={transactionSelected}
                      />
                    )}
                    {/* {transactionModal?.transactionSelected === 'transfer' && (
                      <TransferTypeTransaction caesar_bank_from={caesarBankData} />
                    )}
                    {transactionModal?.transactionSelected === 'withdraw' && (
                      <WithDrawTypeTransaction caesar_bank_from={caesarBankData} />
                    )}
                    {transactionModal?.transactionSelected === 'deposit' && (
                      <DepositTypeTransaction caesar_bank_to={caesarBankData} />
                    )} */}
                  </Box>
                )}

                <Box my={2} />

                {/**
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 * New Transaction Modal
                 */}
                <CreateNewTransactionModal
                  open={transactionModal.transactionModalOpen}
                  onClose={() => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: false,
                    }))
                  }}
                  onSelect={(selected) => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionSelected: selected,
                    }))
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: false,
                    }))
                  }}
                  disabledKeysProps={!roles?.includes('ct-operator') ? ['deposit'] : undefined}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

// type CreateTransaction = {
// caesar_bank_to:  CaesarBank

// }
