import { Box, ButtonBase, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { useEffect, useState } from 'react'

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
  const [isExpanded, setIsExpanded] = useState<boolean>()

  useEffect(() => {
    setIsExpanded(false)
  }, [setIsExpanded])
  const theme: Theme = useTheme()
  const classes = useStyles()
  return (
    <Paper
      style={{
        background: theme.palette.background.paper,
        height: 'max-content',
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
          {isExpanded &&
            subdistributor &&
            subdistributorFieldsFull(subdistributor).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
          {!isExpanded &&
            subdistributor &&
            subdistributorFieldsSimple(subdistributor).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
        </Box>
        {isExpanded && (
          <ButtonBase
            style={{
              display: 'flex',
              width: '100%',
              padding: 4,
            }}
            onClick={() => setIsExpanded(false)}
          >
            <KeyboardArrowUp />
          </ButtonBase>
        )}
        {!isExpanded && (
          <ButtonBase
            style={{
              display: 'flex',
              width: '100%',
              padding: 4,
            }}
            onClick={() => setIsExpanded(true)}
          >
            <KeyboardArrowDown />
          </ButtonBase>
        )}
      </Grid>
    </Paper>
  )
}

const subdistributorFieldsFull = (subdistributor: SubdistributorResponseType) => [
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
  {
    key: 'Area ID',
    value: subdistributor.area_id?.area_id,
  },
]
const subdistributorFieldsSimple = (subdistributor: SubdistributorResponseType) => [
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
    key: 'Area',
    value: subdistributor.area_id?.area_name || '',
  },
]
