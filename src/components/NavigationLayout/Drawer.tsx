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
} from '@material-ui/icons'
import { logoutUser, User, userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/styles'
import { useMemo, useState } from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    url: '/',
  },
]

const subdDspRetailers = [
  {
    title: 'Subdistributor',
    icon: <AccountTree style={{ fontSize: 18 }} />,
    url: '/subdistributor/retailer',
  },
  {
    title: 'DSP',
    icon: <PersonPinCircle style={{ fontSize: 18 }} />,
    url: '/dsp/retailer',
  },
]

const subdDspRetailerItem = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
]

const subdMenuItems = [
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/subdistributor/retailer',
  },
]
const dspOnlyMenuItems = [
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/dsp/retailer',
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
    icon: <ListAlt />,
    url: '/admin/inventory',
  },
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

  const subdiDspWithRetailer = () =>
    subdDspRetailers.map((items) => (
      <Tooltip
        disableHoverListener={open}
        disableTouchListener={open}
        title={<Typography variant="body1">{items.title}</Typography>}
        placement="right"
        arrow
      >
        <ListItem
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
          className={classes.nested}
          button
          key={items.title}
          onClick={() => {
            router.push(items.url)
          }}
        >
          <ListItemIcon>{items.icon}</ListItemIcon>
          <ListItemText>
            <Typography
              variant="body1"
              style={{
                fontWeight: 600,
                textTransform: 'capitalize',
              }}
            >
              {items.title}
            </Typography>
          </ListItemText>
        </ListItem>
      </Tooltip>
    ))

  const mainMenu = () =>
    mainMenuItems.map((menuItem) => (
      <Tooltip
        disableHoverListener={open}
        disableTouchListener={open}
        title={<Typography variant="body1">{menuItem.title}</Typography>}
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
          key={menuItem.title}
          onClick={() => {
            router.push(menuItem.url)
          }}
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
    ))

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
            <Typography
              key={role}
              style={{
                border: `2px solid ${theme.palette.primary.main}`,
                borderRadius: 4,
                fontWeight: 500,
                display: 'inline',
                padding: '2px 8px',
                marginRight: 8,
                marginBottom: 8,
              }}
              variant="body2"
            >
              {role.toUpperCase()}
            </Typography>
          ))}
        </div>
      </div>
      <Divider />
      <List
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {mainMenu()}
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
                    retailers
                  </Typography>
                </ListItemText>

                {isToggle ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
            </Tooltip>
            <Collapse in={isToggle} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {subdiDspWithRetailer()}
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
            whiteSpace: 'nowrap',
          }}
        >
          {lowerMenuItems.map((menuItem) => (
            <Tooltip
              disableHoverListener={open}
              disableTouchListener={open}
              title={<Typography variant="body1">{menuItem.title}</Typography>}
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
                key={menuItem.title}
                onClick={() => {
                  router.push(menuItem.url)
                }}
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
