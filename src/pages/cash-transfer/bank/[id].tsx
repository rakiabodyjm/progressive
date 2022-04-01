import { Box, Container, Divider, Grid, Paper, Typography } from '@material-ui/core'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWR from 'swr'
import CashTransferForm from '../../../components/pages/cash-transfer/CashTransferForm'

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

  if (ceasarError || caesarBankError) {
    return <ErrorLoading />
  }
  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper variant="outlined">
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
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
                      </>
                    ) : (
                      <LoadingScreen2 />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper variant="outlined">
                  <Box p={2}>
                    {caesarBankData && caesar && caesarData ? (
                      <>
                        <CashTransferForm caesar={caesar} caesarBankData={caesarBankData} />
                      </>
                    ) : (
                      <LoadingScreen2 />
                    )}
                  </Box>
                </Paper>
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
