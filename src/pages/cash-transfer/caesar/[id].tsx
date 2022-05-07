import { Box, Container, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CashTransferList from '@src/components/pages/cash-transfer/CashTransferList'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { extractMultipleErrorFromResponse, formatIntoCurrency } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { CashTransferResponse } from '../../../utils/types/CashTransferTypes'

export default function ViewCashTransferCaesar() {
  const { query } = useRouter()
  const { id } = query

  const { data: caesar } = useSWR(id ? `/caesar/${id}` : undefined, () =>
    getWalletById(id as string)
  )
  const theme: Theme = useTheme()

  // if (errorCashTransfers) {
  //   return (
  //     <Paper
  //       style={{
  //         minHeight: 240,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <Typography variant="body2">Not Available</Typography>
  //       <Typography variant="caption" color="primary">
  //         No Recent Transactions
  //       </Typography>
  //     </Paper>
  //   )
  // }

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper>
          <Box p={2}>
            <Grid container>
              <Grid item xs={12} md={6}>
                <Paper>
                  <Box p={2}>
                    <RoleBadge variant="body1" color="primary">
                      {caesar?.account_type.toUpperCase()}
                    </RoleBadge>
                    <Typography variant="h4">
                      <span
                        style={{
                          color: theme.palette.primary.main,
                        }}
                      >
                        Caesar{' '}
                      </span>{' '}
                      Account
                    </Typography>
                    <Typography variant="body2">{caesar?.description.toUpperCase()}</Typography>

                    <Typography
                      style={{
                        marginTop: 16,
                        marginBottom: -8,
                        display: 'block',
                      }}
                      variant="caption"
                      color="primary"
                    >
                      Total Loan/Balance:{' '}
                    </Typography>
                    {caesar && (
                      <Typography variant="h6">
                        {formatIntoCurrency(caesar.cash_transfer_balance)}
                      </Typography>
                    )}

                    <Box my={2}></Box>

                    <Box my={2}>
                      <Divider />
                    </Box>

                    {/**
                     *
                     *
                     *
                     */}
                    <CashTransferList caesarId={caesar?.id} />
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
