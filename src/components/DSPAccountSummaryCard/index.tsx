import { Box, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { DspResponseType } from '@src/utils/api/dspApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function DSPAccountSummaryCard({ dsp }: { dsp: DspResponseType }) {
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
          {dsp &&
            dspFields(dsp).map(({ key, value }) => (
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

const dspFields = ({
  id,
  user,
  dsp_code,
  e_bind_number,
  area_id,
  subdistributor,
}: DspResponseType) => [
  {
    key: 'DSP ID',
    value: id,
  },
  {
    key: 'E-Bind Number',
    value: e_bind_number,
  },
  {
    key: 'DSP Code',
    value: dsp_code,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
  {
    key: 'Area ID',
    value: area_id?.length > 0 ? area_id.map((ea) => ea.area_name).join(', ') : '',
    // value: subdistributor.area_id?.area_name || '',
  },
  {
    key: 'User',
    value: user ? `${user?.last_name}, ${user?.first_name}` : '',
  },
]
