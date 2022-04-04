import { Box, Button, Container, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CreateNewTransactionModal from '@src/components/pages/cash-transfer/CreateNewTransactionModal'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { MonetizationOn } from '@material-ui/icons'
import useSWR from 'swr'

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

  const caesar = useMemo(() => {
    if (caesarBankData) {
      return caesarBankData?.caesar
    }

    return undefined
  }, [caesarBankData])

  const {
    data: caesarData,
    error: ceasarError,
    isValidating: caesarValidating,
  } = useSWR<CaesarWalletResponse>(caesar ? `caesar/${caesar}` : undefined, () =>
    getWalletById(caesar!.id)
  )

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
                <Paper variant="outlined">
                  <Box p={2}>
                    {caesarBankData && caesarData ? (
                      <>
                        <Typography variant="h4">
                          <Typography
                            color="primary"
                            component="span"
                            variant="h4"
                            style={{
                              fontWeight: 700,
                            }}
                          >
                            {caesarBankData.bank.name}
                          </Typography>{' '}
                          Transactions
                        </Typography>
                        <Typography variant="body2">{caesarBankData.description}</Typography>
                        <Box my={2}></Box>
                        <Typography variant="body1" color="primary">
                          {caesarData.description}
                        </Typography>

                        <Box my={2}>
                          <Divider />
                        </Box>
                        <Box>
                          <Paper
                            style={{
                              textAlign: 'center',
                              background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                              paddingTop: 32,
                              paddingBottom: 32,
                            }}
                          >
                            <Typography>Not Available</Typography>
                          </Paper>
                        </Box>
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
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    console.log('hello world')
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
                  {/* </Typography> */}
                </Button>
                {/* <CreateNewTransactionModal /> */}
                {/* {caesarBankData && caesar && caesarData ? (
                  <>
                    <CashTransferForm caesar={caesarData} caesarBankData={caesarBankData} />
                  </>
                ) : (
                  <LoadingScreen2 />
                )} */}
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
