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
} from '@material-ui/icons'
import { logoutUser, User } from '@src/redux/data/userSlice'
import { MouseEvent, MouseEventHandler } from 'react'
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
    title: 'dashboard',
    icon: <Dashboard />,
    url: '/',
  },
  {
    title: 'DSP',
    icon: <PersonPinCircle />,
    url: '/dsp',
  },
  {
    title: 'retailers',
    icon: <ContactPhone />,
    url: '/retailers',
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
export default function DrawerComponent({
  open,
  handleDrawerClose,
  userName,
  roles,
}: {
  open: boolean
  handleDrawerClose: () => void
  roles: User['roles']
  userName: User['first_name']
  // userName: Pick<User, 'first_name'>
}) {
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
            display: !open && 'none',
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
          opacity: !open && 0,
          display: !open && 'none',
          padding: 16,
        }}
      >
        <Typography
          style={{
            marginBottom: 8,
          }}
          variant="h6"
          noWrap
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

      <List
        style={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
          whiteSpace: 'nowrap',
        }}
      >
        <ListItem
          className={clsx(classes.drawerItem, classes.logoutButton)}
          button
          onClick={() => {
            dispatch(logoutUser()).then(() => {
              dispatch(
                setNotification({
                  message: `User logged out`,
                  type: NotificationTypes.DEFAULT,
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
      </List>
    </Drawer>
  )
}
