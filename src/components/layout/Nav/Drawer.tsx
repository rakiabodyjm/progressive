import {
  List,
  ListItem,
  SwipeableDrawer,
  Typography,
  SwipeableDrawerProps,
} from '@material-ui/core'
import { useRouter } from 'next/router'
import { Dispatch, FC, SetStateAction } from 'react'

// const useStyles = makeStyles(() => ({
// drawerContainer: {
//   width: 250,
// },
// }))

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
  // const classes = useStyles()
  return (
    <>
      <SwipeableDrawer
        anchor="top"
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          style: {
            width: '80vw',
            margin: 'auto',
          },
        }}
        {...restProps}
      >
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
          {/* <Divider />
          <ListItem style={{}} button>
            <Typography
              style={{
                backgroundImage: 'var(--primary-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
              variant="h6"
              href="/reload"
              component="a"
            >
              Reload
            </Typography>
          </ListItem> */}
        </List>
      </SwipeableDrawer>
    </>
  )
}

export default Drawer
