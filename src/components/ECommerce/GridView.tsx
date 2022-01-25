import { Box, Grid, Paper, Typography } from '@material-ui/core'
import { LocalOffer } from '@material-ui/icons'
import { Inventory } from '@src/utils/api/inventoryApi'
import Image from 'next/image'

export default function GridView({ inventory }: { inventory: Inventory[] }) {
  return (
    <>
      {inventory.map((inventory) => (
        <Grid item xs={4} md={3} lg={2} key={inventory.id}>
          <Paper variant="outlined">
            <Box p={2}>
              <Grid container justifyContent="center">
                <Grid item xs={10}>
                  <Image src="/apple-touch-icon.png" width={150} height={150} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" noWrap>
                    Title: {inventory.name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" noWrap>
                    Price: {inventory.unit_price}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" noWrap>
                    Qty: {inventory.quantity}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      ))}
    </>
  )
}
