import { Paper, Box, Grid, Typography, Divider } from '@material-ui/core'
import CaesarTabs from '@src/components/CaesarTabs'
import ECommerce from '@src/components/ECommerce'
import { useState } from 'react'
import { UserTypesAndUser } from '../admin/accounts'

export default function ECommercePage() {
  const [caesar, setCaesar] = useState<[UserTypesAndUser, string] | undefined>()
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
                  setCaesar(caesarActive)
                }}
              />
            </Grid>
            {caesar && (
              <Grid item xs={12}>
                <Box my={2} />
                <ECommerce caesarBuyer={caesar} />
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>
    </div>
  )
}
