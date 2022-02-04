import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  PaperProps,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import RetailerAccountSummaryCard from '@src/components/RetailerAccountSummaryCard'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import useSWR from 'swr'
import { getDsp } from '@api/dspApi'
import { useEffect, useState } from 'react'

const injectDsp = async (params: RetailerResponseType) => {
  const dsp = params?.dsp?.id ? await getDsp(params.dsp.id) : undefined
  return {
    ...params,
    dsp,
  }
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))
export default function ViewRetailerAccount({
  retailerId,
  ...restProps
}: {
  retailerId: string
} & PaperProps) {
  const theme: Theme = useTheme()
  const classes = useStyles()
  const [retailer, setRetailer] = useState<RetailerResponseType | null>()
  const { data: retailerFetch, error } = useSWR(retailerId, (id) => getRetailer(id))

  // injectDSp
  useEffect(() => {
    if (retailerFetch) {
      injectDsp(retailerFetch).then(setRetailer)
    }
  }, [retailerFetch])

  return (
    <Paper className={classes.root} {...restProps} variant="outlined">
      <Typography variant="h4">Retailer Account Management</Typography>
      <Typography color="primary" variant="subtitle2">
        Manage Retailer Account
      </Typography>
      <Divider
        style={{
          margin: `16px 0`,
          marginBottom: 24,
        }}
      />
      {retailer ? (
        <Box>
          <Grid spacing={2} container>
            <Grid xs={12} md={6} item>
              <RetailerAccountSummaryCard retailer={retailer} />
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box
          style={{
            textAlign: 'center',
            ...restProps.style,
          }}
        >
          <CircularProgress size={theme.typography.h1.fontSize} thickness={4} color="primary" />
        </Box>
      )}
      {/* <ObjectRenderer<RetailerResponseType> fields={retailer} /> */}
    </Paper>
  )
}
