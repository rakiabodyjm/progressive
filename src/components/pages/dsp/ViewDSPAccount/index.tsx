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
import RetailerTable from '@src/components/RetailerTable'
import { getDsp, DspResponseType } from '@api/dspApi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR from 'swr'
import DSPAccountSummaryCard from '@src/components/DSPAccountSummaryCard'
import DSPSearchTable from '@src/components/DSPSearchTable'
import RetailerSearchTable from '@src/components/RetailerSearchTable'
import { userDataSelector } from '@src/redux/data/userSlice'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))

export default function ViewDspAccount({
  dspId,
  ...restProps
}: {
  dspId: string
} & PaperProps) {
  //   const [subdistributor, setSubdistributor] = useState<SubdistributorResponseType>()
  //   const [dsp, setDsp] = useState<DspResponseType>()
  const user = useSelector(userDataSelector)
  const classes = useStyles()
  const theme: Theme = useTheme()
  const dispatch = useDispatch()

  const { data: dsp, error } = useSWR([dspId], getDsp)

  return (
    <Paper className={classes.root} {...restProps} variant="outlined">
      <Typography variant="h4">DSP Account Management</Typography>
      <Typography color="primary" variant="subtitle2">
        Manage DSP Account
      </Typography>

      <Divider
        style={{
          margin: `16px 0`,
          marginBottom: 24,
        }}
      />
      {dsp ? (
        <Box>
          <Grid spacing={2} container>
            <Grid xs={12} md={6} item>
              <DSPAccountSummaryCard dsp={dsp} />
            </Grid>
            <Grid xs={12} md={6} item></Grid>
            <Grid xs={12} item>
              <Box mt={2}>
                <Paper variant="outlined">
                  <Box p={2}>
                    <Typography variant="h5">Retailer Accounts</Typography>
                    <Typography variant="subtitle2" color="primary">
                      Retailer Accounts/Stores this DSP services
                    </Typography>
                  </Box>

                  <RetailerTable dspId={dsp.id} />
                </Paper>
              </Box>
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
    </Paper>
  )
}
