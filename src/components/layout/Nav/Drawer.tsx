import {
  List,
  ListItem,
  makeStyles,
  SwipeableDrawer,
  Typography,
  Divider,
  SwipeableDrawerProps,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'

const useStyles = makeStyles((theme) => ({
  drawerContainer: {
    width: 250,
  },
}))

const Drawer: FC<
  {
    menuItems: { name: string; href: string }[]
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
  } & SwipeableDrawerProps
> = ({ menuItems, open, setOpen, ...restProps }) => {
  const toggleDrawer =
    (open: boolean) =>
    /**
     * @param event
     */
    () => // event
    {
      // if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      // }
      setOpen(open)
    }
  const router = useRouter()
  const classes = useStyles()
  return (
    <>
      <SwipeableDrawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        {...restProps}
      >
        <div className={classes.drawerContainer}>
          <List>
            {menuItems.map((ea) => (
              <ListItem
                button
                key={ea.href}
                onClick={() => {
                  router.push(`/${ea.href}`)
                }}
              >
                <Typography variant="h6" href={ea.href} component="a">
                  {ea.name}
                </Typography>
              </ListItem>
            ))}
            <Divider />
            {/* <ListItem style={{}} button>
              <Button>
                <Typography variant="h6" href="/reload" component="a">
                  Reload
                </Typography>
              </Button>
            </ListItem> */}
          </List>
        </div>
      </SwipeableDrawer>
    </>
  )
}

export default Drawer
