import { Box, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function SubdistributorAccountSummaryCard({
  subdistributor,
}: {
  subdistributor: SubdistributorResponseType
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
            Subdistributor Account Summary
          </Typography>
          {subdistributor &&
            subdistributorFields(subdistributor).map(({ key, value }) => (
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

const subdistributorFields = (subdistributor: SubdistributorResponseType) => [
  {
    key: 'Subdistributor ID',
    value: subdistributor.id,
  },
  {
    key: 'Subdistributor',
    value: subdistributor.name,
  },

  {
    key: 'E-Bind Number',
    value: subdistributor.e_bind_number,
  },
  {
    key: 'User',
    value: subdistributor.user?.first_name
      ? `${subdistributor.user.last_name}, ${subdistributor.user.first_name}`
      : '',
  },
  { key: 'ZIP Code', value: subdistributor?.zip_code },
  {
    key: 'Area',
    value: subdistributor.area_id?.area_name || '',
  },
]
