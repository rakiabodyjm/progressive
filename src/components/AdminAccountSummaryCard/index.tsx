import { Box, ButtonBase, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function AdminAccountSummaryCard({ admin }: { admin: AdminResponseType }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

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
            Admin Account Summary
          </Typography>
          {admin && isExpanded
            ? adminFieldsExpanded(admin).map(({ key, value }) => (
                <div key={key}>
                  <Typography color="primary" variant="body2">
                    {key}:
                  </Typography>
                  <Typography variant="body1">{value}</Typography>
                </div>
              ))
            : adminFieldsNotExpanded(admin).map(({ key, value }) => (
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

const adminFieldsExpanded = (admin: AdminResponseType) => [
  {
    key: 'Admin ID',
    value: admin.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: admin.caesar_wallet?.id ? admin.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'Name',
    value: admin.name,
  },
  {
    key: 'User',
    // value: subdistributor.e_bind_number,
    value: `${admin?.user?.first_name} ${admin?.user?.last_name}`,
  },
]

const adminFieldsNotExpanded = (admin: AdminResponseType) => [
  {
    key: 'Admin ID',
    value: admin.id,
  },
  {
    key: 'User',
    // value: subdistributor.e_bind_number,
    value: `${admin?.user?.first_name} ${admin?.user?.last_name}`,
  },
]
