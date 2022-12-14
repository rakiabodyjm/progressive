/* eslint-disable no-redeclare */

import { Box, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DSPSmallCard from '@src/components/DSPSmallCard'
import RetailerSmallCard from '@src/components/RetailerSmallCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import userApi, { UserResponse, getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import { getSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import WalletSummaryCard from '@src/components/WalletSummaryCard'
import AccountSummaryCard from '@src/components/AccountSummaryCard'
import { LoadingScreen2 } from '@src/components/LoadingScreen'

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
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
}))

export default function AccountDashboard() {
  const router = useRouter()
  // const { query } = router
  // const { id } = query

  const user = useSelector(userDataSelector)
  const theme: Theme = useTheme()
  const [account, setAccount] = useState<UserResponse>()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    if (user) {
      setLoading(true)
      getUser(user.user_id as string, {
        cached: false,
      })
        .then(async (res) => {
          if (res?.subdistributor) {
            res.subdistributor = await getSubdistributor(res.subdistributor.id)
          }
          if (res?.dsp) {
            res.dsp = await getDsp(res.dsp.id)
          }
          if (res?.retailer) {
            res.retailer = await getRetailer(res.retailer.id)
          }
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
        .finally(() => {
          setLoading(false)
        })
    }
  }, [dispatch, user])

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Paper
        style={{
          padding: 16,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography
              style={{
                fontWeight: 600,
              }}
              color="textSecondary"
              noWrap
              variant="h6"
            >
              {user?.first_name}
            </Typography>

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
        </Grid>

        <Divider
          style={{
            margin: '16px 0px',
          }}
        />

        {loading ? (
          <LoadingScreen2
            containerProps={{
              minHeight: 480,
            }}
            textProps={{
              variant: 'h4',
            }}
          />
        ) : (
          <Grid className={classes.gridContainer} spacing={2} container>
            <Grid item xs={12} md={6}>
              <Grid spacing={2} container>
                <Grid item xs={12}>
                  {account && <AccountSummaryCard account={account} role={account.id} />}
                </Grid>

                {account?.subdistributor && (
                  <Grid item xs={12}>
                    {account && (
                      <AccountSummaryCard account={account} role={account.subdistributor.id} />
                    )}
                  </Grid>
                )}
                {account?.dsp && (
                  <Grid item xs={12}>
                    {account && <AccountSummaryCard account={account} role={account.dsp.id} />}
                  </Grid>
                )}
                {account?.retailer && (
                  <Grid item xs={12}>
                    {account && <AccountSummaryCard account={account} role={account.retailer.id} />}
                  </Grid>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <Grid container spacing={2}>
                {account && (
                  <Grid item xs={12}>
                    <WalletSummaryCard
                      entities={{
                        ...(account && {
                          user: account.id,
                        }),
                        ...(account?.dsp && { dsp: account.dsp.id }),
                        ...(account?.subdistributor && {
                          subdistributor: account.subdistributor.id,
                        }),
                        ...(account?.retailer && {
                          retailer: account.retailer.id,
                        }),
                        ...(account?.admin && {
                          admin: account.admin.id,
                        }),
                      }}
                    />
                  </Grid>
                )}

                {account?.admin && (
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <WalletSmallCard accountType="admin" accountId={account.admin.id} />
                  </Grid>
                )}
                {account?.id && (
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <WalletSmallCard accountType="user" accountId={account.id} />
                  </Grid>
                )}
                {account?.subdistributor && (
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <WalletSmallCard
                      accountId={account.subdistributor.id}
                      accountType="subdistributor"
                    />
                  </Grid>
                )}
                {account?.dsp && (
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <WalletSmallCard accountId={account.dsp.id} accountType="dsp" />
                  </Grid>
                )}
                {account?.retailer && (
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <WalletSmallCard accountId={account.retailer.id} accountType="retailer" />
                  </Grid>
                )}
                {(account?.dsp || account?.subdistributor || account?.retailer) && (
                  <Grid item xs={12}>
                    <Divider
                      style={{
                        margin: '1px 0px',
                      }}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {account?.dsp && (
                      <Grid item xs={12} sm={6} md={12} lg={6}>
                        <DSPSmallCard dspId={account.dsp.id} />
                      </Grid>
                    )}
                    {account?.subdistributor && (
                      <Grid item xs={12} sm={6} md={12} lg={6}>
                        <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                      </Grid>
                    )}
                    {account?.retailer && (
                      <Grid item xs={12} sm={6} md={12} lg={6}>
                        <RetailerSmallCard retailerId={account.retailer.id} />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Paper>
    </div>
  )
}

type EntityTypes = 'subdistributor' | 'retailer' | 'dsp'
function useFetchEntity<T extends EntityTypes = 'dsp'>(
  type: T,
  id: string | undefined
): {
  loading: boolean
  entity: DspResponseType
}
function useFetchEntity<T extends EntityTypes = 'retailer'>(
  type: T,
  id: string | undefined
): {
  loading: boolean
  entity: DspResponseType
}
function useFetchEntity<T extends EntityTypes = 'subdistributor'>(
  type: T,
  id: string | undefined
): {
  loading: boolean
  entity: SubdistributorResponseType
}
function useFetchEntity(type: EntityTypes, id: any) {
  const [entity, setEntity] = useState<
    DspResponseType | SubdistributorResponseType | RetailerResponseType
  >()
  const [loading, setLoading] = useState<boolean>(false)

  const fetcher = (argType: typeof type) => {
    if (argType === 'dsp') {
      return getDsp
    }
    if (argType === 'subdistributor') {
      return getSubdistributor
    }
    if (argType === 'retailer') {
      return getRetailer
    }

    throw new Error('useFetch entity must have type DSP | Subdistributor')
  }
  useEffect(() => {
    if (type && id) {
      setLoading(true)
      fetcher(type)(id)
        .then((res) => {
          setEntity(res)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [type, id])

  return {
    loading,
    entity,
  }
}
