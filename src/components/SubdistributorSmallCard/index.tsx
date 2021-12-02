import {
  getRetailerCount,
  getDspCount,
  getSubdistributor,
  SubdistributorResponseType,
} from '@src/utils/api/subdistributorApi'
import { useEffect } from 'react'
import useSWR from 'swr'
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  PaperProps,
  Typography,
  useTheme,
} from '@material-ui/core'

export default function SubdistributorSmallCard({
  subdistributorId,
  ...restProps
}: { subdistributorId: string } & PaperProps) {
  const { data, error, isValidating, mutate } = useSWR<SubdistributorResponseType>(
    subdistributorId,
    getSubdistributor,
    {
      revalidateOnFocus: false,
    }
  )

  const { data: retailerCount, error: retailerCountError } = useSWR<number>(
    [subdistributorId, 'subdistributor-retailer-count'],
    getRetailerCount
  )
  const { data: dspCount, error: dspCountError } = useSWR(
    [subdistributorId, 'subdistributor-dsp-count'],
    getDspCount
  )
  const theme = useTheme()
  // TODO
  return (
    <Paper {...restProps} variant="outlined" style={{ height: 153 }}>
      <Box {...(isValidating && { textAlign: 'center' })} p={2} pt={1}>
        {isValidating ? (
          <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
        ) : (
          <>
            <Typography noWrap variant="h5" style={{}}>
              Subdistributor
            </Typography>
            <Typography color="primary" variant="subtitle2">
              {data?.name}
            </Typography>
            <div
              style={{
                marginBottom: 16,
              }}
            />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">Retailers: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="body1"
                >
                  {retailerCount || 0}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Personnel: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="body1"
                >
                  {dspCount || 0}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Paper>
  )
}
