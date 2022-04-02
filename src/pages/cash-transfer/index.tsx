import { Box, Container, Divider, Grid, Paper, Typography } from '@material-ui/core'
import CaesarBankLinking from '@src/components/pages/bank/CaesarBankLinking'
import SearchCaesarTable from '@src/components/SearchCaesarTable'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function CaesarIndexPage() {
  const { account, data, loading } = useGetCaesarOfUser()
  // useEffect(() => {
  //   console.log('usegetcaesarofuser', loading, account, data)
  // }, [account, data, loading])

  const [caesarButtonTrigger, setCaesarButtonTrigger] = useState(Date.now())
  const router = useRouter()

  return (
    <Container maxWidth="lg" disableGutters>
      <Paper>
        <Box p={2}>
          <Box>
            <Typography variant="h4">Caesar Accounts</Typography>
            <Typography color="primary" variant="body2">
              Caesar Accounts
            </Typography>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>

          <SearchCaesarTable
            buttonTrigger={caesarButtonTrigger}
            customWalletFormat={(param: Partial<CaesarWalletResponse>[]) =>
              param.map(({ id, description, account_type, ceasar_id, data }) => ({
                id,
                description,
                account_type,
                caesar_coin: data?.caesar_coin,
              }))
            }
            onRowClick={(e, data) => {
              const id = (data as { id: string })?.id
              router.push({
                pathname: '/cash-transfer/[id]',
                query: {
                  id,
                },
              })
            }}
          />
        </Box>
      </Paper>

      <Box my={2} />

      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2}>
              <Box>
                <Typography variant="h4">Banks</Typography>
                <Typography color="primary" variant="body2">
                  Banks that can be linked to Caesar Account Cash transfers
                </Typography>
              </Box>
              <Box my={2}>
                <Divider />
              </Box>
              <CaesarBankLinking />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
