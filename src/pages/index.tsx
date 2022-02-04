/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Tab, Tabs, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DSPSmallCard from '@src/components/DSPSmallCard'
import RetailerSmallCard from '@src/components/RetailerSmallCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import userApi, { UserResponse, getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
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
import ECommerce from '@src/components/ECommerce'
import RoleBadge from '@src/components/RoleBadge'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { getWallet } from '@src/utils/api/walletApi'
import { TabPanel } from '@material-ui/lab'
import { getAllInventory, Inventory } from '@src/utils/api/inventoryApi'

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

  const updateUser = (key: keyof UserResponse, value: any) => {
    setAccount((prevState) => ({
      ...(prevState as UserResponse),
      [key]: value,
    }))
  }
  const [caesar, setCaesar] = useState<[UserTypesAndUser, string] | undefined>()
  const [caesarTypes, setCaesarTypes] = useState<[UserTypesAndUser, string][]>([])
  useEffect(() => {
    if (user && user.roles && user?.roles?.length > 0) {
      /**
       * verify if caeasar exists for each
       */
      const getWallets = () =>
        Promise.all(
          [...user.roles]
            /**
             * disable users for now
             */
            .filter((ea) => ea !== 'user')
            .map((role) =>
              getWallet({
                [role]: user[`${role}_id`],
              })
                .then((res) => [res.account_type, res.id] as [UserTypesAndUser, string])
                .catch((err) => [role, null])
            )
        ).then((final) => final.filter((ea) => !!ea[1]) as [UserTypesAndUser, string][])

      getWallets()
        .then((res) => {
          setCaesarTypes(res)
        })
        .catch((err) => {
          console.log('No Caesars for', err)
        })
    }
  }, [user])

  useEffect(() => {
    if (!caesar && caesarTypes.length > 0) {
      const cacheGet: string | null = window.localStorage.getItem('default_caesar')
      const cache: [UserTypesAndUser, string] | null = cacheGet ? JSON.parse(cacheGet) : null

      if (cache) {
        const [caeasrType, caesarId] = cache

        if (caesarTypes.map(([_, accountId]) => accountId).includes(caesarId)) {
          setCaesar(cache)

          window.localStorage.setItem('default_caesar', JSON.stringify(caesarTypes[0]))
        } else {
          window.localStorage.removeItem('default_caesar')
          setCaesar(caesarTypes[0])
        }
      } else {
        setCaesar(caesarTypes[0])
        window.localStorage.setItem('default_caesar', JSON.stringify(caesarTypes[0]))
      }
    } else if (caesar) {
      window.localStorage.setItem('default_caesar', JSON.stringify(caesar))
    }
  }, [caesar, caesarTypes, user])

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
      {
        /**
         * Currently being used caesar account
         * (global state)
         */
        caesar && (
          <>
            <Paper>
              <Box p={2}>
                <Grid container>
                  <Grid item xs={12}>
                    <Typography variant="h4">Acquire Inventory</Typography>
                    <Typography variant="body1" color="primary">
                      Acquire inventory through Caesar Account Types
                    </Typography>

                    <Box my={2}>
                      <Divider />
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    {caesarTypes && caesarTypes.length > 0 && caesar && (
                      <>
                        <Paper>
                          <Box mt={1}>
                            <Typography
                              style={{
                                fontWeight: 700,
                              }}
                              color="textSecondary"
                              align="center"
                              variant="body2"
                            >
                              ACQUIRE USING CAESAR ACCOUNT:
                            </Typography>
                            <Box my={1}>
                              <Divider />
                            </Box>
                          </Box>

                          <Tabs
                            value={caesar[0]}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(_, value) => {
                              const newValue = caesarTypes.find((ea) => ea[0] === value)
                              setCaesar(newValue)

                              // setCaesar(value )
                            }}
                            centered
                          >
                            {caesarTypes.map(([caesarType]) => (
                              <Tab
                                key={caesarType}
                                value={caesarType}
                                label={caesarType?.toUpperCase()}
                              />
                            ))}
                          </Tabs>
                        </Paper>
                        <Box my={2} />
                        <ECommerce caesarBuyer={caesar} />
                      </>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </Paper>
            <Box my={2} />
          </>
        )
      }

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

        <Grid className={classes.gridContainer} spacing={2} container>
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
              <Grid item xs={12}>
                <Divider
                  style={{
                    margin: '1px 0px',
                  }}
                />
              </Grid>
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
