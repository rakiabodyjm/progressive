import { Box, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function RetailerAccountSummaryCard({
  retailer,
}: {
  retailer: RetailerResponseType
}) {
  const theme: Theme = useTheme()
  const classes = useStyles()
  return (
    <Paper
      style={{
        background: theme.palette.background.paper,
      }}
      variant="outlined"
    >
      <Grid container>
        <Box className={classes.accountInfo} p={2}>
          <Typography
            style={{
              marginBottom: theme.spacing(2),
            }}
            variant="h5"
          >
            DSP Account Summary
          </Typography>
          {retailer &&
            retailerFields(retailer).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
        </Box>
      </Grid>
    </Paper>
  )
}

const retailerFields = ({
  id,
  e_bind_number,
  store_name,
  user,
  dsp,
  subdistributor,
}: RetailerResponseType) => [
  {
    key: 'Retailer ID',
    value: id,
  },
  {
    key: 'E Bind Number',
    value: e_bind_number,
  },
  {
    key: `Store Name`,
    value: store_name,
  },

  {
    key: 'User',
    value: user ? `${user?.last_name}, ${user?.first_name}` : '',
  },
  {
    key: 'Attending DSP',
    value: dsp?.user?.first_name || '     ',
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
]
