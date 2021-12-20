/* eslint-disable no-redeclare */

import { Box, Button, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import UserAccountSummaryCard from '@src/components/UserAccountSummaryCard'
import { useRouter } from 'next/router'
import { useState } from 'react'
import RetailerAccountSummaryCard from '@src/components/RetailerAccountSummaryCard'
import { getRetailer } from '@src/utils/api/retailerApi'
import RoleBadge from '@src/components/RoleBadge'
import useSWR from 'swr'
import dynamic from 'next/dynamic'
import EditRetailerAccount from '@src/components/pages/retailer/EditRetailerAccount'

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
const ModalWrapper = dynamic(() => import(`@components/ModalWrapper`))
export default function RetailerAccountView() {
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
                  pathname: '/profile/[id]',
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
          </Box>
          <ModalWrapper
            open={modalOpen}
            onClose={() => {
              setModalOpen(false)
            }}
            containerSize="sm"
          >
            <EditRetailerAccount retailer={retailer} />
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
              <RetailerAccountSummaryCard retailer={retailer} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
