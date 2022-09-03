/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DSPAccountSummaryCard from '@src/components/DSPAccountSummaryCard'
import { getDsp } from '@src/utils/api/dspApi'
import RoleBadge from '@src/components/RoleBadge'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import EditDSPAccount from '@src/components/pages/dsp/EditDSPAccount'
import RetailerSearchTable from '@src/components/RetailerSearchTable'
import LoadingScreen from '@src/components/LoadingScreen'

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
const ModalWrapper = dynamic(() => import('@components/ModalWrapper'))
export default function SubdistributorDSPAccountView() {
  const router = useRouter()
  const { query } = router
  const { id } = query
  const theme: Theme = useTheme()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }
  const { data: dsp, error } = useSWR([id], getDsp)

  const [userRole, setUserRole] = useState<string>()

  useEffect(() => {
    dsp?.user.roles
      .filter((role) => role === 'subdistributor')
      .map((filtered) => setUserRole(filtered))
  }, [dsp?.user.roles])

  const classes = useStyles()
  return (
    <div className={classes.root}>
      {dsp ? (
        <>
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
                      pathname: '/subdistributor/dsp/user/[id]',
                      query: {
                        id: dsp?.user.id,
                      },
                    })
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Edit User Account
                </Button>
                {dsp && (
                  <Button onClick={handleModalOpen} variant="outlined" color="primary">
                    Edit DSP Account
                  </Button>
                )}
                <Button
                  onClick={() => {
                    router.push({
                      pathname: '/transfer/subdistributor/dsp/[id]',
                      query: {
                        id: dsp?.id,
                      },
                    })
                  }}
                  variant="outlined"
                  color="primary"
                >
                  Transfer Inventory
                </Button>
              </Box>

              <ModalWrapper
                open={modalOpen}
                onClose={() => {
                  setModalOpen(false)
                }}
                containerSize="sm"
              >
                <EditDSPAccount dsp={dsp} />
              </ModalWrapper>
            </Paper>
          </Box>
          <Paper
            style={{
              padding: 16,
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                {dsp.user.roles
                  .filter((role) => role === 'subdistributor')
                  .map((filtered) => (
                    <RoleBadge key={filtered.toString()}>{filtered.toUpperCase()}</RoleBadge>
                  ))}

                <Typography
                  style={{
                    fontWeight: 600,
                  }}
                  color="textSecondary"
                  noWrap
                  variant="h6"
                >
                  {dsp?.user.first_name}
                </Typography>
                <Typography display="inline" variant="h4">
                  DSP Management
                </Typography>
              </Grid>
            </Grid>

            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
            <Grid spacing={2} container>
              <Grid item xs={12} md={6}>
                <UserAccountSummaryCard account={dsp.user} />
              </Grid>

              <Grid item xs={12} md={6}>
                <DSPAccountSummaryCard dsp={dsp} />
              </Grid>
              <Grid item xs={12}>
                <Paper variant="outlined">
                  <Box p={2}>
                    <Typography variant="h5">Retailer Accounts</Typography>
                    <Typography variant="subtitle2" color="primary">
                      Retailer Accounts this Subdistributor Services
                    </Typography>
                  </Box>
                  <RetailerSearchTable
                    dspId={dsp.id}
                    subdistributorId={dsp.subdistributor.id}
                    role={userRole}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </>
      ) : (
        <LoadingScreen hiddenText />
      )}
    </div>
  )
}
