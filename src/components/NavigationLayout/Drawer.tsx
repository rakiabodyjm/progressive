import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
  Box,
  Collapse,
  Tooltip,
} from '@material-ui/core'
import clsx from 'clsx'
import Drawer from '@material-ui/core/Drawer'
import {
  AccountCircle,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  PersonPinCircle,
  ContactPhone,
  ExitToApp,
  AccountTree,
  PeopleAlt,
  CardGiftcard,
  ExpandLess,
  ExpandMore,
  ListAlt,
  AllInbox,
  AccountBalanceWallet,
} from '@material-ui/icons'
import { logoutUser, User, userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/styles'
import { MouseEvent, useMemo, useState } from 'react'
import RoleBadge from '@src/components/RoleBadge'

const menuItems = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    url: '/',
    id: 'dash',
  },
]

const collapseSubdDspRetailers = [
  {
    title: 'Subdistributor',
    icon: <AccountTree style={{ fontSize: 18 }} />,
    url: '/subdistributor/retailer',
    id: 'collapseSubdRetailers',
  },
  {
    title: 'DSP',
    icon: <PersonPinCircle style={{ fontSize: 18 }} />,
    url: '/dsp/retailer',
    id: 'collapseDspRetailers',
  },
]

const subdDspRetailerItem = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
    id: 'subdDsp',
  },
]

const subdMenuItems = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
    id: 'subdDsp',
  },
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/subdistributor/retailer',
    id: 'subdRetailer',
  },
]
const dspOnlyMenuItems = [
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/dsp/retailer',
    id: 'dspRetailer',
  },
]

const adminUpperMenuItems = [
  {
    title: 'Subdistributors',
    // icon: <Typography>SUBd</Typography>,
    icon: <AccountTree />,
    url: '/subdistributor',
  },
]

const adminLowerMenuItems = [
  {
    title: 'Users',
    icon: <PeopleAlt />,
    url: '/admin/accounts',
  },
  {
    title: 'Asset',
    icon: <CardGiftcard />,
    url: '/admin/assets',
  },

  {
    title: 'Inventory',
    icon: <AllInbox />,
    url: '/admin/inventory',
  },
  {
    title: 'Transactions',
    icon: <ListAlt />,
    url: '/admin/transactions',
  },
  {
    title: 'Caesar Reload',
    icon: <AccountBalanceWallet />,
    url: '/admin/topup',
  },
  /**
   * caesar reload
   * HERE
   */
]

const drawerWidth = 240
const useStyles = makeStyles((theme: Theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    /**
     * Destroys welcome sign
     */
    // whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    /**
     * Remove scrollbar on x axis on open
     */
    overflowX: 'hidden',
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  accountCircle: {},
  logoutButton: {
    color: theme.palette.error.main,
    '&:hover': {
      '& svg': {
        color: `${theme.palette.error.main} !important`,
      },
      // color: 'red !important',
      color: `${theme.palette.error.main} !important`,
    },
    '& svg': {
      color: `${theme.palette.error.main} !important`,
    },
  },
  drawerItem: {
    '&:hover': {
      // color: theme.palette.primary.main,
      '& svg': {
        // color: theme.palette.primary.main,
        // color: 'var(--primary-contrastText)',
        // color: theme.palette.primary.contrastText,
      },

      '& .logoutButton': {},
    },
    '& svg': {
      color: theme.palette.primary.main,
      // color: theme.palette.primary.contrastText,
      // color: 'var(--primary-dark)',
    },
  },
  nested: {
    paddingLeft: theme.spacing(2.5),
    '& svg': {
      color: theme.palette.primary.main,
      // color: theme.palette.primary.contrastText,
      // color: 'var(--primary-dark)',
    },
  },
  iconSize: {},
}))
type DrawerComponentProps = {
  open: boolean
  handleDrawerClose: () => void
  roles: UserTypes[]
  userName: User['first_name']
}
export default function DrawerComponent({
  open,
  handleDrawerClose,
  userName,
  roles,
}: DrawerComponentProps) {
  const classes = useStyles()
  const theme: Theme = useTheme()
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const user = useSelector(userDataSelector)
  const [isToggle, setIsToggle] = useState<boolean>(false)
  const mainMenuItems = useMemo(() => {
    if (user) {
      let returnMenuItems = [...menuItems]

      if (user.admin_id) {
        // returnMenuItems = [...returnMenuItems, ...adminUpperMenuItems]
      }
      if (user.subdistributor_id && !user.dsp_id) {
        returnMenuItems = [...returnMenuItems, ...subdMenuItems]
      }
      if (user.dsp_id && !user.subdistributor_id) {
        returnMenuItems = [...returnMenuItems, ...dspOnlyMenuItems]
      }
      if (user.dsp_id && user.subdistributor_id) {
        returnMenuItems = [...returnMenuItems, ...subdDspRetailerItem]
      }
      if (user.retailer_id) {
        returnMenuItems = [...returnMenuItems]
      }

      return returnMenuItems.filter(
        (filter, index, array) => array.map((ea) => ea.url).indexOf(filter.url) === index
      )
    }
    return []
  }, [user])
  const lowerMenuItems = useMemo(
    () => (user?.admin_id ? adminLowerMenuItems : []),
    [user?.admin_id]
  )

  const handleClick = () => setIsToggle(!isToggle)

  const subdiDspWithRetailer = useMemo(
    () =>
      collapseSubdDspRetailers.map((items) => (
        <Tooltip
          disableHoverListener={open}
          disableTouchListener={open}
          title={<Typography variant="body1">{items.title}</Typography>}
          placement="right"
          arrow
          key={items.id}
        >
          <ListItem
            style={{
              paddingTop: 5,
              paddingBottom: 5,
            }}
            className={classes.nested}
            button
            key={items.id}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()

              router.push(items.url)
            }}
            href={items.url}
            component="a"
          >
            <ListItemIcon>{items.icon}</ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                style={{
                  // fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {items.title}
              </Typography>
            </ListItemText>
          </ListItem>
        </Tooltip>
      )),
    [classes.nested, open, router]
  )

  const mainMenu = useMemo(
    () =>
      mainMenuItems.map((menuItem) => (
        <Tooltip
          disableHoverListener={open}
          disableTouchListener={open}
          title={<Typography variant="body1">{menuItem.title}</Typography>}
          placement="right"
          arrow
          key={menuItem.id}
        >
          <ListItem
            style={{
              paddingTop: 16,
              paddingBottom: 16,
            }}
            className={classes.drawerItem}
            button
            key={menuItem.id}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault()
              router.push(menuItem.url)
            }}
            component="a"
            href={menuItem.url}
          >
            <ListItemIcon>{menuItem.icon}</ListItemIcon>
            <ListItemText>
              <Typography
                variant="body1"
                style={{
                  fontWeight: 600,
                  textTransform: 'capitalize',
                }}
              >
                {menuItem.title}
              </Typography>
            </ListItemText>
          </ListItem>
        </Tooltip>
      )),
    [classes.drawerItem, mainMenuItems, open, router]
  )

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <AccountCircle
          className={classes.accountCircle}
          style={{
            fontSize: 60,
            position: 'absolute',
            left: 0,
            top: 8,
            marginLeft: 16,
            display: !open ? 'none' : undefined,
          }}
        />
        <IconButton
          style={{
            display: open ? 'inherit' : 'none',
          }}
          onClick={handleDrawerClose}
        >
          {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>

      <div
        style={{
          opacity: !open ? 0 : undefined,
          display: !open ? 'none' : undefined,
          padding: 16,
        }}
      >
        <Typography
          style={{
            marginBottom: 8,
          }}
          variant="h6"
        >
          Welcome{' '}
          <span
            style={{
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            {userName}
          </span>
        </Typography>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {roles.map((role) => (
            <Box key={role} p={0.5}>
              <RoleBadge uppercase>{role}</RoleBadge>
            </Box>
          ))}
        </div>
      </div>
      <Divider />
      <List
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {mainMenu}
        {user?.subdistributor_id && user.dsp_id ? (
          <>
            <Tooltip
              disableHoverListener={open}
              disableTouchListener={open}
              title={<Typography variant="body1">Retailers</Typography>}
              placement="right"
              arrow
            >
              <ListItem
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                }}
                className={classes.drawerItem}
                button
                onClick={handleClick}
              >
                <ListItemIcon>
                  <ContactPhone />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    Retailers
                  </Typography>
                </ListItemText>

                {isToggle ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </Tooltip>
            <Collapse in={isToggle} timeout="auto" unmountOnExit>
              <List
                style={{
                  borderRadius: 8,
                  // background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
                component="div"
                disablePadding
              >
                {subdiDspWithRetailer}
              </List>
            </Collapse>
          </>
        ) : null}
      </List>

      <Divider></Divider>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <List
          style={{
            flexGrow: 1,
            // whiteSpace: 'nowrap',
          }}
        >
          {lowerMenuItems.map((menuItem) => (
            <Tooltip
              disableHoverListener={open}
              disableTouchListener={open}
              title={<Typography variant="body1">{menuItem.title}</Typography>}
              placement="right"
              arrow
              key={menuItem.title}
            >
              <ListItem
                style={{
                  paddingTop: 16,
                  paddingBottom: 16,
                }}
                className={classes.drawerItem}
                button
                key={menuItem.title}
                onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                  e.preventDefault()
                  router.push(menuItem.url)
                }}
                href={menuItem.url}
                component="a"
              >
                <ListItemIcon>{menuItem.icon}</ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body1"
                    style={{
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {menuItem.title}
                  </Typography>
                </ListItemText>
              </ListItem>
            </Tooltip>
          ))}
        </List>
        <Tooltip
          disableHoverListener={open}
          disableTouchListener={open}
          title={<Typography variant="body1">Log Out</Typography>}
          placement="right"
          arrow
        >
          <ListItem
            className={clsx(classes.drawerItem, classes.logoutButton)}
            button
            onClick={() => {
              dispatch(logoutUser()).then(() => {
                dispatch(
                  setNotification({
                    message: `User logged out`,
                    type: NotificationTypes.INFO,
                  })
                )
                router.push('/')
              })
            }}
          >
            <ListItemIcon
              style={{
                color: 'currentcolor',
              }}
            >
              <ExitToApp />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body1"
                style={{
                  textTransform: 'uppercase',
                  fontWeight: 700,
                }}
              >
                Log Out
              </Typography>
            </ListItemText>
          </ListItem>
        </Tooltip>
      </Box>
    </Drawer>
  )
}
