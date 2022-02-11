import {
  Box,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import ECommerce from '@src/components/ECommerce'
import { setNotification, NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getDsp } from '@src/utils/api/dspApi'
import { getRetailer } from '@src/utils/api/retailerApi'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { getWallet } from '@src/utils/api/walletApi'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { UserTypesAndUser } from '../admin/accounts'

export default function ECommercePage() {
  const user = useSelector(userDataSelector)
  const theme: Theme = useTheme()
  const [account, setAccount] = useState<UserResponse>()
  const dispatch = useDispatch()
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

  return (
    <div>
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
    </div>
  )
}
