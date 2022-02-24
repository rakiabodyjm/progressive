import {
  Box,
  Grid,
  ListItem,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { LocalOffer } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { Inventory } from '@src/utils/api/inventoryApi'
import Image from 'next/image'
import RoleBadge from '../RoleBadge'

export type InventoryNumbers = {
  [P in keyof Inventory]: Inventory[P] extends number ? Inventory[P] : never
}

export default function GridView({
  inventory,
  srpKey,
  onInventoryItemClick,
}: //   account_type,
{
  inventory: Inventory[]
  srpKey: keyof InventoryNumbers
  onInventoryItemClick?: (inventoryClicked: Inventory) => void
}) {
  const theme: Theme = useTheme()
  return (
    <Box style={{ maxHeight: 600, overflowY: 'auto', overflowX: 'hidden' }}>
      <Grid container spacing={2}>
        {inventory?.length > 0 &&
          inventory
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
                xs={6}
                md={4}
                lg={3}
              >
                <InventoryRow inventory={inventory} />
              </Grid>
            ))}
        {inventory?.length === 0 && (
          <Grid item xs={12}>
            <Paper
              variant="outlined"
              style={{
                padding: 32,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              <Typography
                variant="h6"
                align="center"
                style={{
                  fontWeight: 600,
                }}
                color="primary"
              >
                No Inventory Found
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Box>
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
    filter: 'grayscale(40%) !important',
    maxWidth: `200px !important`,
  },
  rowGap: {
    alignItems: 'center',

    '& > *': {
      marginBottom: 8,
    },
  },
  imageContentContainer: {
    alignItems: 'center',
    padding: theme.spacing(3),
  },
  imageContainer: {
    height: 100,
  },
  paperContainer: {
    width: '100%',
    overflow: 'auto',
    [theme.breakpoints.down('xs')]: {
      maxWidth: 240,
    },
  },
  flexStart: {
    paddingTop: 20,
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
          <Grid xs={12} item className={classes.imageContainer}>
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
          <Grid className={`${classes.rowGap} ${classes.flexStart}`} item xs={12}>
            <RoleBadge>{inventory.caesar.account_type.toUpperCase()} </RoleBadge>
          </Grid>
          <Grid className={classes.rowGap} item xs={12}>
            <Typography variant="body1" style={{ paddingTop: 10 }}>
              {inventory.name}
            </Typography>
          </Grid>
          <Grid className={classes.rowGap} item xs={12}>
            <Typography variant="body2">{inventory.caesar.description}</Typography>
          </Grid>
          <Grid className={classes.rowGap} item xs={6}>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">
                  <span
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {inventory.srp}
                  </span>
                  &nbsp;CCoins
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.rowGap} item xs={6}>
            <Grid container justifyContent="flex-end" alignItems="flex-end">
              <Grid item xs={6}>
                <Typography variant="body1">
                  <span style={{ fontWeight: 700 }}>{inventory.quantity}</span>&nbsp;left
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.rowGap} item xs={12}>
            <Typography variant="body1" style={{ paddingTop: 10 }}>
              {inventory.name}
            </Typography>
          </Grid>
        </Grid>
      </ListItem>
    </Paper>
  )
}
