import ViewRetailerAccount from '@components/pages/retailer/ViewRetailerAccount'
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DSPSmallCard from '@src/components/DSPSmallCard'
import RetailerSmallCard from '@src/components/RetailerSmallCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import ViewDspAccount from '@src/components/pages/dsp/ViewDSPAccount'
import ViewSubdistributorAccount from '@src/components/pages/subdistributor/ViewSubdistributorAccount'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import userApi, { UserResponse, getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { InfoOutlined } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
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

export default function AdminAccountView() {
  const router = useRouter()
  const { query } = router
  const { id } = query
  const theme: Theme = useTheme()
  const [account, setAccount] = useState<UserResponse>()
  const dispatch = useDispatch()

  useEffect(() => {
    if (id) {
      getUser(id as string, {
        cached: false,
      })
        .then((res) => {
          setAccount(res)
        })
        .catch((err) => {
          const error = userApi.extractError(err)
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: error.toString(),
            })
          )
        })
    }
  }, [id])

  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Box
        style={{
          position: 'sticky',
          top: theme.spacing(9),
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
                  pathname: '/admin/accounts/user/[id]',
                  query: {
                    id: account?.id,
                  },
                })
              }}
              variant="outlined"
              color="primary"
            >
              Edit User Account
            </Button>
            {account?.subdistributor && (
              <Button
                onClick={() => {
                  router.push({
                    pathname: '/admin/accounts/subdistributor/[id]',
                    query: {
                      id: account?.subdistributor?.id,
                    },
                  })
                }}
                variant="outlined"
                color="primary"
              >
                Manage Subdistibributor Account
              </Button>
            )}
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
            <Typography display="inline" variant="h4">
              Account Management
            </Typography>

            <Box display="flex" flexWrap="wrap" width="100%" mt={1}>
              {account &&
                account.roles.map((ea) => (
                  <Typography
                    key={ea}
                    style={{
                      padding: '2px 8px',
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: 4,
                      marginRight: 8,
                      marginBottom: 8,
                    }}
                    color="primary"
                    display="inline"
                    variant="body2"
                  >
                    {ea.toUpperCase()}
                  </Typography>
                ))}
            </Box>
          </Grid>
          {/* <Grid
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
            }}
            item
            xs={2}
          >
            <Tooltip
              arrow
              placement="left"
              title={<Typography variant="subtitle2">More Info</Typography>}
            >
              <IconButton
                onClick={() => {
                  router.push({
                    pathname: '/admin/accounts/user/[id]',
                    query: {
                      id: account?.id,
                    },
                  })
                }}
              >
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </Grid> */}
        </Grid>

        <Divider
          style={{
            margin: '16px 0px',
          }}
        />
        <Grid spacing={2} container>
          <Grid item xs={12} md={6}>
            {account && <UserAccountSummaryCard account={account} />}
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              {account?.id && (
                <Grid item xs={12} lg={6}>
                  <WalletSmallCard userId={account?.id} />
                </Grid>
              )}
              {account?.dsp && (
                <Grid item xs={12} lg={6}>
                  <DSPSmallCard dspId={account.dsp.id} />
                </Grid>
              )}
              {account?.subdistributor && (
                <Grid item xs={12} lg={6}>
                  <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                </Grid>
              )}
              {account?.retailer && (
                <Grid item xs={12} lg={6}>
                  <RetailerSmallCard retailerId={account.retailer.id} />
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      <Box mt={8} />
      {account?.subdistributor && (
        <ViewSubdistributorAccount subdistributorId={account.subdistributor.id} />
      )}
      <Box mt={8} />
      {account?.dsp && <ViewDspAccount dspId={account.dsp.id} />}

      <Box mt={8} />
      {account?.retailer && <ViewRetailerAccount retailerId={account.retailer.id} />}
    </div>
  )
}
