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
import DSPSearchTable from '@src/components/DSPSearchTable'
import DspTable from '@src/components/DspTable'
import RetailerTable from '@src/components/RetailerTable'
import SubdistributorAccountSummaryCard from '@src/components/SubdistributorAccountSummaryCard'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))
export default function ViewSubdistributorAccount({
  subdistributorId,
  ...restProps
}: {
  subdistributorId: string
} & PaperProps) {
  // const [subdistributor, setSubdistributor] = useState<SubdistributorResponseType>()
  const classes = useStyles()
  const theme: Theme = useTheme()
  const dispatch = useDispatch()
  const { data: subdistributor, error } = useSWR(subdistributorId, (id) =>
    getSubdistributor(id)
      .then((res) => res)
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: err.message,
          })
        )
        console.error(err)
      })
  )

  return (
    <>
      <Paper className={classes.root} {...restProps} variant="outlined">
        <Typography variant="h4">Subdistributor Account Management</Typography>
        <Typography color="primary" variant="subtitle2">
          Manage Sudbistributor Account
        </Typography>

        <Divider
          style={{
            margin: `16px 0`,
            marginBottom: 24,
          }}
        />
        {subdistributor ? (
          <Box>
            <Grid spacing={2} container>
              <Grid xs={12} md={6} item>
                <SubdistributorAccountSummaryCard subdistributor={subdistributor} />
              </Grid>
              <Grid xs={12} md={6} item></Grid>
              <Grid xs={12} item>
                <Box mt={2}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Typography variant="h5">DSP Accounts</Typography>
                      <Typography variant="subtitle2" color="primary">
                        DSP Accounts this Subdistributor owns
                      </Typography>
                    </Box>
                    <DSPSearchTable subdistributorId={subdistributor.id} />
                  </Paper>
                </Box>
              </Grid>
              <Grid xs={12} item>
                <Box mt={2}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Typography variant="h5">Retailer Accounts</Typography>
                      <Typography variant="subtitle2" color="primary">
                        Retailer Accounts this Subdistributor Services
                      </Typography>
                    </Box>

                    <RetailerTable subdistributorId={subdistributor.id} />
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
    </>
  )
}
