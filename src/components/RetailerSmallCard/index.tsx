import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  PaperProps,
  Typography,
  useTheme,
} from '@material-ui/core'
import SubdistributorsPage from '@src/pages/subdistributor'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import { UserResponse } from '@src/utils/api/userApi'
import useFetch from '@src/utils/hooks/useFetch'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function RetailerSmallCard({
  retailerId,
  ...restProps
}: { retailerId: string } & PaperProps) {
  //   const { data, error, loading } = useFetch<DspResponseType>(() => getDsp(dsp?.id))
  const { data, error, isValidating, mutate } = useSWR<RetailerResponseType>(
    retailerId,
    getRetailer,
    {
      revalidateOnFocus: false,
    }
  )

  const theme = useTheme()

  return (
    <Paper {...restProps} variant="outlined">
      <Box {...(isValidating && { textAlign: 'center' })} p={2} pt={1}>
        {isValidating ? (
          <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
        ) : (
          <>
            <Typography noWrap variant="h5" style={{}}>
              Retailer
            </Typography>
            <Typography color="primary" variant="subtitle2">
              {data?.store_name}
            </Typography>
            <Box mb={1} />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body1">Subdistributor</Typography>
                <Typography color="primary" variant="caption">
                  {data?.subdistributor?.name || 'NONE'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Attending DSP</Typography>
                <Typography color="primary" variant="caption">
                  {data?.dsp?.dsp_code || 'NONE'}
                </Typography>
              </Grid>
            </Grid>

            {/* <Typography variant="h6">DSP: </Typography>
            <Typography
              color="primary"
              style={{
                fontWeight: 700,
              }}
              variant="body1"
            >
              {data?.dsp. || 0}
            </Typography> */}
          </>
        )}
      </Box>
    </Paper>
  )
}
