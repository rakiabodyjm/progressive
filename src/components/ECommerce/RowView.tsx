import { Box, Grid, ListItem, makeStyles, Paper, Theme, Typography } from '@material-ui/core'
import { LocalOffer } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { Inventory } from '@src/utils/api/inventoryApi'
import Image from 'next/image'

export type InventoryNumbers = {
  [P in keyof Inventory]: Inventory[P] extends number ? Inventory[P] : never
}

export default function RowView({
  inventory,
  srpKey,
  onInventoryItemClick,
}: //   account_type,
{
  inventory: Inventory[]
  srpKey: keyof InventoryNumbers
  onInventoryItemClick?: (inventoryClicked: Inventory) => void
}) {
  return (
    <>
      <Grid container spacing={2}>
        {inventory
          ?.map((ea) => ({
            ...ea,
            srp: ea[srpKey] as number,
          }))
          .map((inventory) => (
            <Grid
              onClick={() => {
                if (onInventoryItemClick) {
                  onInventoryItemClick(inventory)
                }
              }}
              key={inventory.id}
              item
              xs={12}
            >
              <InventoryRow inventory={inventory} />
            </Grid>
          ))}
      </Grid>
    </>
  )
}
const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: 0,
    '&:hover': {
      '& $image': {
        filter: 'none !important',
      },
    },
  },
  image: {
    paddingRight: `8px !important`,
    filter: 'grayscale(40%) !important',
    maxWidth: `180px !important`,
  },
  rowGap: {
    alignItems: 'center',

    '& > *': {
      marginBottom: 8,
    },
  },
  imageContentContainer: {
    alignItems: 'center',
    padding: theme.spacing(1.5),
  },
  imageContainer: {
    height: 90,
  },
  paperContainer: {
    width: '100%',
    overflow: 'hidden',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 240,
      margin: 'auto',
    },
  },
  flexStart: {
    alignSelf: 'flex-start',
  },
}))

const InventoryRow = ({
  inventory,
}: {
  inventory: Inventory & {
    srp: number
  }
}) => {
  const classes = useStyles()
  return (
    <Paper className={classes.paperContainer}>
      <ListItem component="div" button className={classes.container}>
        <Grid container className={classes.imageContentContainer}>
          <Grid xs={12} sm={3} item className={classes.imageContainer}>
            <Box
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <Image
                objectFit="contain"
                src="/assets/realm1000-logo-symbol.png"
                layout="fill"
                className={classes.image}
              />
            </Box>
          </Grid>

          <Grid className={classes.rowGap} item xs={12} sm={5}>
            <Box>
              <FormLabel color="primary">Name:</FormLabel>
              <Typography variant="body2">{inventory.name}</Typography>
            </Box>
            <Box>
              <FormLabel>Description:</FormLabel>
              <Typography variant="body2">{inventory.description.slice(0, 250)}</Typography>
            </Box>
            <Box>
              <FormLabel>Seller:</FormLabel>
              <Typography variant="body2">{inventory.caesar.description}</Typography>
            </Box>
          </Grid>
          <Grid className={`${classes.rowGap} ${classes.flexStart}`} item xs={12} sm={4}>
            <Box>
              <FormLabel>Price:</FormLabel>
              <Typography variant="body1">
                <span
                  style={{
                    fontWeight: 700,
                  }}
                >
                  {inventory.srp}
                </span>{' '}
                CCoins
              </Typography>
            </Box>
            <Box>
              <FormLabel>Quantity Left:</FormLabel>
              <Typography variant="body1">
                <span style={{ fontWeight: 700 }}>{inventory.quantity}</span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  )
}
