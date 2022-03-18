import { Paper, Box, Grid, Typography, Divider } from '@material-ui/core'
import CaesarTabs from '@src/components/CaesarTabs'
import ECommerce from '@src/components/ECommerce'
import { UserTypes } from '@src/redux/data/userSlice'
import { useState } from 'react'

export default function ECommercePage() {
  const [caesar, setCaesar] = useState<[UserTypes, string] | undefined>()
  return (
    <div>
      <Paper>
        <Box p={2}>
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h4">E-Commerce</Typography>
              <Typography variant="body1" color="primary">
                Buy Inventory Items using your Caesar Account
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
            {console.log(caesar)}
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
