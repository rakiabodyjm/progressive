/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DSPSmallCard from '@src/components/DSPSmallCard'
import RetailerSmallCard from '@src/components/RetailerSmallCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import userApi, { UserResponse, getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SubdistributorAccountSummaryCard from '@src/components/SubdistributorAccountSummaryCard'
import DSPAccountSummaryCard from '@src/components/DSPAccountSummaryCard'
import RetailerAccountSummaryCard from '@src/components/RetailerAccountSummaryCard'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import { getSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import WalletSummaryCard from '@src/components/WalletSummaryCard'

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

export default function AccountDashboard() {
  const router = useRouter()
  // const { query } = router
  // const { id } = query

  const user = useSelector(userDataSelector)
  const theme: Theme = useTheme()
  const [account, setAccount] = useState<UserResponse>()
  const dispatch = useDispatch()

  const updateUser = (key: keyof UserResponse, value: any) => {
    setAccount((prevState) => ({
      ...(prevState as UserResponse),
      [key]: value,
    }))
  }

  useEffect(() => {
    if (user) {
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
    }
  }, [user])

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
        <Grid spacing={2} container>
          <Grid item xs={12} md={6}>
            <Grid spacing={2} container>
              <Grid item xs={12}>
                {account && <UserAccountSummaryCard account={account} />}
              </Grid>

              {account?.subdistributor && (
                <Grid item xs={12}>
                  {account && (
                    <SubdistributorAccountSummaryCard subdistributor={account.subdistributor} />
                  )}
                </Grid>
              )}
              {account?.dsp && (
                <Grid item xs={12}>
                  {account && <DSPAccountSummaryCard dsp={account.dsp} />}
                </Grid>
              )}
              {account?.retailer && (
                <Grid item xs={12}>
                  {account && <RetailerAccountSummaryCard retailer={account.retailer} />}
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <WalletSummaryCard
                  entities={{
                    ...(account && {
                      user: account.id,
                    }),
                    ...(account?.dsp && { dsp: account.dsp.id as string }),
                    ...(account?.subdistributor && {
                      subdistributor: account.subdistributor.id as string,
                    }),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {account?.id && (
                    <Grid item xs={12}>
                      <WalletSmallCard accountType="user" accountId={account.id} />
                    </Grid>
                  )}
                  {account?.subdistributor && (
                    <Grid item xs={12}>
                      <WalletSmallCard
                        accountId={account.subdistributor.id}
                        accountType="subdistributor"
                      />
                    </Grid>
                  )}
                  {account?.dsp && (
                    <Grid item xs={12}>
                      <WalletSmallCard accountId={account.dsp.id} accountType="dsp" />
                    </Grid>
                  )}
                  {account?.retailer && (
                    <Grid item xs={12}>
                      <WalletSmallCard accountId={account.retailer.id} accountType="retailer" />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {account?.dsp && (
                    <Grid item xs={12}>
                      <DSPSmallCard dspId={account.dsp.id} />
                    </Grid>
                  )}
                  {account?.subdistributor && (
                    <Grid item xs={12}>
                      <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                    </Grid>
                  )}
                  {account?.retailer && (
                    <Grid item xs={12}>
                      <RetailerSmallCard retailerId={account.retailer.id} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
              {/* {account?.id && (
                <Grid item xs={12} lg={6}>
                  <WalletSmallCard accountType="user" accountId={account.id} />
                </Grid>
              )} */}
              {/* {account?.subdistributor && (
                <Grid item xs={12} lg={6}>
                  <WalletSmallCard
                    accountId={account.subdistributor.id}
                    accountType="subdistributor"
                  />
                </Grid>
              )}
              {account?.dsp && (
                <Grid item xs={12} lg={6}>
                  <WalletSmallCard accountId={account.dsp.id} accountType="dsp" />
                </Grid>
              )}
              {account?.retailer && (
                <Grid item xs={12} lg={6}>
                  <WalletSmallCard accountId={account.retailer.id} accountType="retailer" />
                </Grid>
              )} */}
            </Grid>
          </Grid>
        </Grid>
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
