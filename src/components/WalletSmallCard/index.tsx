import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  PaperProps,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Info, InfoOutlined } from '@material-ui/icons'
import SubdistributorsPage from '@src/pages/subdistributor'
import { UserResponse, getUser } from '@src/utils/api/userApi'
import useFetch from '@src/utils/hooks/useFetch'
import { useEffect, useState } from 'react'

import useSWR from 'swr'

export default function WalletSmallCard({ userId, ...restProps }: { userId: string } & PaperProps) {
  //   const { data, error, loading } = useFetch<DspResponseType>(() => getDsp(dsp?.id))
  const { data, error, isValidating, mutate } = useSWR<UserResponse>(userId, getUser, {
    revalidateOnFocus: false,
  })

  const theme = useTheme()

  return (
    <Paper {...restProps} variant="outlined">
      <Box {...(isValidating && { textAlign: 'center' })} p={2}>
        {isValidating ? (
          <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
        ) : (
          <>
            <Grid container>
              <Grid item xs={8}>
                <Typography noWrap variant="h5" style={{}}>
                  Wallet
                </Typography>
                <Typography
                  style={{
                    fontWeight: 700,
                  }}
                  color="primary"
                  variant="body1"
                >
                  🟡
                  <span
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    0
                  </span>
                  <Typography component="span" variant="body1" noWrap>
                    Ceasar Coins
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box display="flex" height="100%" justifyContent="flex-end" pt={0.5}>
                  <Tooltip
                    arrow
                    placement="left"
                    style={{
                      cursor: 'pointer',
                    }}
                    title={<Typography variant="subtitle2">Coming Soon</Typography>}
                  >
                    <InfoOutlined color="primary" />
                  </Tooltip>
                </Box>
              </Grid>
            </Grid>

            <div
              style={{
                marginBottom: 16,
              }}
            />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">Dollar: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="subtitle2"
                >
                  $0.00
                  {/* {data?.retailer?.length || 0} */}
                  {/* {data?} */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Peso: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="subtitle2"
                >
                  ₱0.00
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Paper>
  )
}
