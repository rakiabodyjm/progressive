/* eslint-disable no-redeclare */

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import { useRouter } from 'next/router'
import { useState } from 'react'
import RetailerAccountSummaryCard from '@src/components/RetailerAccountSummaryCard'
import { getRetailer } from '@src/utils/api/retailerApi'
import RoleBadge from '@src/components/RoleBadge'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import LoadingScreen from '@src/components/LoadingScreen'

const EditRetailerAccount = dynamic(
  () => import(`@src/components/pages/retailer/EditRetailerAccount`)
)

const ModalWrapper = dynamic(() => import(`@components/ModalWrapper`))

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

export default function SubdistributorRetailerAccountView() {
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
  const { data: retailer, error } = useSWR([id], getRetailer)

  const classes = useStyles()
  return retailer ? (
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
                  pathname: '/subdistributor/retailer/user/[id]',
                  query: {
                    id: retailer?.user.id,
                  },
                })
              }}
              variant="outlined"
              color="primary"
            >
              Edit User Account
            </Button>
            {retailer && (
              <Button onClick={handleModalOpen} variant="outlined" color="primary">
                Edit Retailer Account
              </Button>
            )}
            <Button
              onClick={() => {
                router.push({
                  pathname: '/transfer/subdistributor/retailer/[id]',
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
          <ModalWrapper
            open={modalOpen}
            onClose={() => {
              setModalOpen(false)
            }}
            containerSize="sm"
          >
            {retailer ? (
              <EditRetailerAccount retailer={retailer} />
            ) : (
              <Paper
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: 16,
                }}
                variant="outlined"
              >
                <CircularProgress />
              </Paper>
            )}
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
            <RoleBadge>SUBDSITRIBUTOR</RoleBadge>
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
        <Grid item xs={12}>
          <Grid container spacing={1}>
            <Grid item xs={12} lg={6}>
              <UserAccountSummaryCard account={retailer?.user} />
            </Grid>
            <Grid item xs={12} lg={6}>
              {retailer ? (
                <RetailerAccountSummaryCard retailer={retailer} />
              ) : (
                <Paper
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 16,
                  }}
                  variant="outlined"
                >
                  <CircularProgress />
                </Paper>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  ) : (
    <LoadingScreen hiddenText />
  )
}
