import {
  Divider,
  hexToRgb,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  Typography,
  Box,
  ClickAwayListener,
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
} from '@material-ui/icons'
import { logoutUser, User, UserTypes } from '@src/redux/data/userSlice'
import { MouseEvent, MouseEventHandler, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
// import { makeStyles, useTheme } from '@mui/styles'
// import { Theme } from '@mui/material'

const mainMenuItems = [
  {
    title: 'Dashboard',
    icon: <Dashboard />,
    url: '/',
  },
  {
    title: 'Subdistributors',
    // icon: <Typography>SUBd</Typography>,
    icon: <AccountTree />,
    url: '/subdistributor',
  },
  {
    title: 'DSPs',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
  {
    title: 'Retailers',
    icon: <ContactPhone />,
    url: '/retailer',
  },
]

const adminMenuItems = [
  {
    title: 'Users Management',
    icon: <PeopleAlt />,
    url: '/admin/accounts',
  },
  {
    title: 'Asset Management',
    icon: <CardGiftcard />,
    url: '/admin/assets',
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
        {mainMenuItems.map((menuItem) => (
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
        ))}
      </List>

      <Divider></Divider>
      <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
        <List
          style={{
            flexGrow: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {adminMenuItems.map((menuItem) => (
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
          ))}
        </List>

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
      </Box>
    </Drawer>
  )
}
