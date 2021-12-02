import { Box, CircularProgress, Paper, PaperProps, Typography, useTheme } from '@material-ui/core'
import SubdistributorsPage from '@src/pages/subdistributor'
import { DspResponseType, getDsp, getRetailerCount } from '@src/utils/api/dspApi'
import { UserResponse } from '@src/utils/api/userApi'
import useFetch from '@src/utils/hooks/useFetch'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function DSPSmallCard({ dspId, ...restProps }: { dspId: string } & PaperProps) {
  //   const { data, error, loading } = useFetch<DspResponseType>(() => getDsp(dsp?.id))
  const { data, error, isValidating, mutate } = useSWR<DspResponseType>(dspId, getDsp, {
    revalidateOnFocus: false,
  })

  const {
    data: dspRetailerCount,
    error: dspRetailerCountError,
    isValidating: dspRetailerCountValidating,
  } = useSWR<number>([dspId, 'dsp-retailer-count'], getRetailerCount, {
    revalidateOnFocus: false,
  })

  const theme = useTheme()

  return (
    <Paper {...restProps} variant="outlined" style={{ height: 153 }}>
      <Box {...(isValidating && { textAlign: 'center' })} p={2} pt={1}>
        {isValidating || dspRetailerCountValidating ? (
          <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
        ) : (
          <>
            <Typography noWrap variant="h5" style={{}}>
              DSP
            </Typography>
            <Typography color="primary" variant="subtitle2">
              {data?.subdistributor.name}
            </Typography>
            <div
              style={{
                marginBottom: 16,
              }}
            />
            <Typography variant="h6">Retailers: </Typography>
            <Typography
              color="primary"
              style={{
                fontWeight: 700,
              }}
              variant="body1"
            >
              {dspRetailerCount || 0}
            </Typography>
          </>
        )}
      </Box>
    </Paper>
  )
}
