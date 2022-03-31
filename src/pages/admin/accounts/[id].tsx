/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import DSPSmallCard from '@src/components/DSPSmallCard'
import RetailerSmallCard from '@src/components/RetailerSmallCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import { UserResponse, getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { getRetailer, RetailerResponseType } from '@src/utils/api/retailerApi'
import { getSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import AdminAccountSummaryCard from '@src/components/AdminAccountSummaryCard'
import AccountSummaryCard from '@src/components/AccountSummaryCard'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { GetServerSideProps, GetStaticProps } from 'next'
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
}))

export default function AdminAccountManage({ id }: { id: string }) {
  const router = useRouter()
  const theme: Theme = useTheme()
  const [account, setAccount] = useState<UserResponse | undefined>()
  const dispatch = useDispatch()

  const { entity: dspFetch, loading: dspLoading } = useFetchEntity('dsp', id)
  const { entity: subdistributorFetch, loading: subdistributorLoading } = useFetchEntity(
    'subdistributor',
    id
  )
  const { entity: retailerFetch, loading: retailerLoading } = useFetchEntity('retailer', id)

  useEffect(() => {
    if (id) {
      getUser(id)
        .then(async (res) => {
          setAccount({
            ...res,
            ...(res?.subdistributor && {
              subdistributor: await getSubdistributor(res.subdistributor.id),
            }),
            ...(res?.retailer && {
              retailer: await getRetailer(res.retailer.id),
            }),
            ...(res?.dsp && {
              dsp: await getDsp(res.dsp.id).then(async (dsp) => ({
                ...dsp,
              })),
            }),
          })
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((message) => {
            dispatch(
              setNotification({
                type: NotificationTypes.ERROR,
                message,
              })
            )
          })
        })
    }
  }, [dspFetch, subdistributorFetch, retailerFetch, dispatch, id])

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
                Manage Subdistributor Account
              </Button>
            )}
            {account?.dsp && (
              <Button
                onClick={() => {
                  router.push({
                    pathname: '/admin/accounts/dsp/[id]',
                    query: {
                      id: account?.dsp?.id,
                    },
                  })
                }}
                variant="outlined"
                color="primary"
              >
                Manage DSP Account
              </Button>
            )}
            {account?.retailer && (
              <Button
                onClick={() => {
                  router.push({
                    pathname: '/admin/accounts/retailer/[id]',
                    query: {
                      id: account?.retailer?.id,
                    },
                  })
                }}
                variant="outlined"
                color="primary"
              >
                Manage Retailer Account
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
        </Grid>

        <Divider
          style={{
            margin: '16px 0px',
          }}
        />

        {account ? (
          <>
            <Grid spacing={2} container>
              <Grid item xs={12} md={6}>
                {account && <AccountSummaryCard account={account} role={account.id} />}
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  {account?.id && (
                    <Grid item xs={12} lg={6}>
                      <WalletSmallCard accountType="user" accountId={account?.id} />
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {account?.admin && (
              <>
                <Box my={2}>
                  <Divider />
                </Box>

                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <AdminAccountSummaryCard admin={{ ...account.admin, user: account }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <WalletSmallCard accountId={account.admin.id} accountType="admin" />
                  </Grid>
                </Grid>
              </>
            )}
            {account?.subdistributor && (
              <>
                <Box my={2}>
                  <Divider />
                </Box>

                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <AccountSummaryCard account={account} role={account.subdistributor.id} />
                  </Grid>
                  <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} lg={6}>
                      <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <WalletSmallCard
                        accountId={account.subdistributor.id}
                        accountType="subdistributor"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {account?.dsp && (
              <>
                <Box my={2}>
                  <Divider />
                </Box>

                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <AccountSummaryCard account={account} role={account.dsp.id} />
                  </Grid>

                  <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} lg={6}>
                      <DSPSmallCard dspId={account.dsp.id} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <WalletSmallCard accountId={account.dsp.id} accountType="dsp" />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}

            {account?.retailer && (
              <>
                <Box my={2}>
                  <Divider />
                </Box>

                <Grid spacing={2} container>
                  <Grid item xs={12} md={6}>
                    <AccountSummaryCard account={account} role={account.retailer.id} />
                  </Grid>
                  <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} lg={6}>
                      <RetailerSmallCard retailerId={account.retailer.id} />
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <WalletSmallCard accountId={account.retailer.id} accountType="retailer" />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ) : (
          <LoadingScreen2
            containerProps={{
              minHeight: 480,
            }}
            textProps={{
              variant: 'h4',
            }}
          />
        )}
      </Paper>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => ({
  props: {
    id: context.query.id,
  },
})

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
  entity: RetailerResponseType
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

  const fetcher = useCallback((argType: typeof type) => {
    switch (argType) {
      case 'dsp': {
        return getDsp
      }
      case 'subdistributor': {
        return getSubdistributor
      }
      case 'retailer': {
        return getRetailer
      }
      default: {
        return getRetailer
      }
    }
  }, [])
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
  }, [type, id, fetcher])

  return {
    loading,
    entity,
  }
}
