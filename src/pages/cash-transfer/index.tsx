/* eslint-disable react/no-unescaped-entities */
import { Box, Divider, Grid, Paper, Typography, useTheme } from '@material-ui/core'
import CaesarBankLinking from '@src/components/pages/bank/CaesarBankLinking'
import { CashTransferBalancesTable } from '@src/components/pages/cash-transfer/CashTransferBalancesTable'
import CashTransferDSP from '@src/components/pages/cash-transfer/CashTransferDSP'
import RetailerCashTransferView from '@src/components/RetailerCashTransferView'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'

import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import useNotification from '@src/utils/hooks/useNotification'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

// const CTOperatorPage = dynamic(())
export default function CaesarIndexPage() {
  const { account, data: currentCaesar, loading } = useGetCaesarOfUser()

  const router = useRouter()

  const [isDSP, setIsDSP] = useState(false)

  const [isRetailer, setIsRetailer] = useState(false)

  const [caesarEmpty, setCaesarEmpty] = useState<boolean>(false)

  const user = useSelector(userDataSelector)

  const dispatchNotif = useNotification()

  useEffect(() => {
    if (currentCaesar) {
      currentCaesar.map((ea) => {
        if (ea[1] === null) {
          setCaesarEmpty(true)
        }
        return ea
      })
    }
  }, [currentCaesar])

  useEffect(() => {
    if (user && user?.roles) {
      if (
        [...user.roles].some((ea) => ['dsp', 'subdistributor'].includes(ea)) &&
        ![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))
      ) {
        if (caesarEmpty) {
          router.push('/')
          dispatchNotif({
            type: NotificationTypes.WARNING,
            message: 'Unauthorized to access',
          })
        } else {
          setIsDSP(true)
        }
      } else if (
        [...user.roles].some((ea) => ['retailer'].includes(ea)) &&
        ![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))
      ) {
        if (caesarEmpty) {
          router.push('/')
          dispatchNotif({
            type: NotificationTypes.WARNING,
            message: 'Unauthorized to access',
          })
        } else {
          setIsRetailer(true)
        }
      } else if (![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))) {
        router.push('/')
        dispatchNotif({
          type: NotificationTypes.WARNING,
          message: 'Unauthorized to access',
        })
      }
    }
  }, [user])
  const theme = useTheme()

  if (!isDSP && !isRetailer) {
    return (
      <Paper>
        <CashTransferBalancesTable />
        <Box my={2} />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Paper>
              <Box p={2}>
                <Box>
                  <Typography variant="h4">Banks</Typography>
                  <Typography color="primary" variant="body2">
                    Banks that can be linked to Caesar Account Cash transfers
                  </Typography>
                </Box>
                <Box my={2}>
                  <Divider />
                </Box>
                <CaesarBankLinking />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    )
  }
  if (isRetailer) {
    return (
      <>
        <RetailerCashTransferView />
      </>
    )
  }
  if (isDSP) {
    return (
      <>
        <CashTransferDSP />
      </>
    )
  }
}
