import { Paper, Box, Typography, Divider, Grid, Theme, useTheme } from '@material-ui/core'
import AccountInventoryManagement from '@src/components/AccountInventoryManagement'
import CaesarTabs from '@src/components/CaesarTabs'
import { userDataSelector } from '@src/redux/data/userSlice'

import { getWallet } from '@src/utils/api/walletApi'
import { grey } from '@material-ui/core/colors'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

export interface AccountIdTypes {
  role: string | undefined
  role_id: string | undefined
}

export default function Inventory() {
  const [accountId, setAccountId] = useState<AccountIdTypes>({
    role: undefined,
    role_id: undefined,
  })
  const theme: Theme = useTheme()
  return (
    <div>
      <Paper>
        <Box p={2}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4">Inventory Table</Typography>
              <Typography variant="body1" color="primary">
                Inventory table through Caesar Account Types
              </Typography>

              <Box my={2}>
                <Divider />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <CaesarTabs
                onActiveCaesarChange={(caesarActive, accountActive) => {
                  if (accountActive) {
                    const [role, accountId] = accountActive
                    setAccountId({ role, role_id: accountId })
                  }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box my={2} />
              {accountId.role_id ? (
                <AccountInventoryManagement accountId={accountId.role_id} />
              ) : (
                <>
                  <Paper
                    style={{
                      background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                    }}
                  >
                    <Box p={1}>
                      <Typography
                        style={{
                          fontWeight: 700,
                        }}
                        color="textSecondary"
                        align="center"
                        variant="body2"
                      >
                        No Caesar Account Found
                      </Typography>
                    </Box>
                  </Paper>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
