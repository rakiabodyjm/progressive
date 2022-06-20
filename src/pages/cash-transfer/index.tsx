/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  TablePagination,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CaesarBankLinking from '@src/components/pages/bank/CaesarBankLinking'
import { CashTransferBalancesTable } from '@src/components/pages/cash-transfer/CashTransferBalancesTable'
import CashTransferDSP from '@src/components/pages/cash-transfer/CashTransferDSP'
import RetailerCashTransferView from '@src/components/RetailerCashTransferView'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { formatIntoCurrency } from '@src/utils/api/common'
import {
  CaesarWalletResponse,
  getAllWallet,
  getWallet,
  searchWalletV2,
} from '@src/utils/api/walletApi'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import useNotification from '@src/utils/hooks/useNotification'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import Inventory from '../inventory'

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
            message: `Unauthorized to access`,
          })
        } else {
          setIsDSP(true)
        }
        // } else if (
        //   [...user.roles].some((ea) => ['retailer'].includes(ea)) &&
        //   ![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))
        // ) {
        //   if (caesarEmpty) {
        //     router.push('/')
        //     dispatchNotif({
        //       type: NotificationTypes.WARNING,
        //       message: `Unauthorized to access`,
        //     })
        //   } else {
        //     setIsRetailer(true)
        //   }
      } else if (![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))) {
        router.push('/')
        dispatchNotif({
          type: NotificationTypes.WARNING,
          message: `Unauthorized to access`,
        })
      }

      // console.log('user.roles', user.roles)
    }
  }, [user])
  const theme = useTheme()

  if (!isDSP && !isRetailer) {
    return (
      <Container maxWidth="lg" disableGutters>
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
      </Container>
    )
  }
  // if (isRetailer) {
  //   return (
  //     <>
  //       <RetailerCashTransferView />
  //     </>
  //   )
  // }
  if (isDSP) {
    return (
      <>
        <CashTransferDSP />
      </>
    )
  }
}
