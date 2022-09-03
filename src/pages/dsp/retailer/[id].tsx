/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useRouter } from 'next/router'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import RoleBadge from '@src/components/RoleBadge'
import useSWR from 'swr'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  accountTypesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
    gap: 8,
  },
  userBox: {
    [theme.breakpoints.down('xl')]: {
      width: '50%',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
}))

export default function DSPRetailerAccountView() {
  const router = useRouter()
  const { query } = router
  const { id } = query
  const theme: Theme = useTheme()
  const { data: retailer, error } = useSWR([id], getRetailer)
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Box
        style={{
          position: 'sticky',
          top: theme.spacing(9),
          zIndex: theme.zIndex.drawer,
        }}
        mb={2}
      >
        <Paper>
          <Box
            style={{
              display: 'flex',
              gap: 16,
            }}
            p={2}
          >
            <Button
              onClick={() => {
                router.push({
                  pathname: '/transfer/dsp/retailer/[id]',
                  query: {
                    id: retailer?.id,
                  },
                })
              }}
              variant="outlined"
              color="primary"
            >
              Transfer Inventory
            </Button>
          </Box>
        </Paper>
      </Box>
      <Paper
        style={{
          padding: 16,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <RoleBadge>DSP</RoleBadge>
            <Typography
              style={{
                fontWeight: 600,
              }}
              color="textSecondary"
              noWrap
              variant="h6"
            >
              {retailer?.user.first_name}
            </Typography>
            <Typography display="inline" variant="h4">
              Retailer Management
            </Typography>
          </Grid>
        </Grid>

        <Divider
          style={{
            margin: '16px 0px',
          }}
        />
        <Grid item xs={12} md={6}>
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
                  Retailer Account Summary
                </Typography>
                {retailer &&
                  retailerFieldsFull(retailer).map(({ key, value }) => (
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
        </Grid>
      </Paper>
    </div>
  )
}
const retailerFieldsFull = ({
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
    key: 'Store Name',
    value: store_name,
  },

  {
    key: 'User',
    value: user ? `${user?.last_name}, ${user?.first_name}` : '',
  },
  {
    key: 'Attending DSP',
    // value: dsp?.user?.first_name || '     ',
    value: dsp?.dsp_code,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
]
