import { Box, CircularProgress, Paper, PaperProps, Typography, useTheme } from '@material-ui/core'
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
    <Paper {...restProps} variant="outlined" style={{ height: 134 }}>
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
            <div
              style={{
                marginBottom: 6,
              }}
            />
            <Typography variant="h6">Subdistributor</Typography>
            <Typography color="primary" variant="subtitle2">
              {data?.subdistributor?.name || 'NONE'}
            </Typography>

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
