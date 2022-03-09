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
  SvgIconTypeMap,
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
} from '@material-ui/icons'
import { logoutUser, User, userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useRouter } from 'next/router'
import { makeStyles, useTheme } from '@material-ui/styles'
import { MouseEvent, useCallback, useMemo, useState } from 'react'
import RoleBadge from '@src/components/RoleBadge'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { nanoid } from '@reduxjs/toolkit'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'
import MainMenuItems from '@src/components/NavigationLayout/Drawer/MainMenuItems'
import AdminMenuItems from '@src/components/NavigationLayout/Drawer/AdminMenuItems'
import SubMenuItems from './SubMenuItems'

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
  const user = useSelector(userDataSelector)
  const [isToggle, setIsToggle] = useState<boolean>(false)

  const handleClick = useCallback(() => {
    setIsToggle((prev) => !prev)
  }, [setIsToggle])

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
      {/**
       * Main Menu items
       */}
      <MainMenuItems open={open} />

      <Divider />
      {/**
       * Sub Menu items (Inventory and Transactions)
       */}
      {user?.roles.length !== 1 && <SubMenuItems open={open} />}

      <Divider />
      {/**
       * Admin menuItems
       */}
      {user?.admin_id && <AdminMenuItems open={open} />}

      <Box display="flex" height="100%" justifyContent="flex-end" flexDirection="column">
        <LogoutListItem open={open} />
      </Box>
    </Drawer>
  )
}

const LogoutListItem = ({ open }: { open: boolean }) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useRouter()
  return (
    <Tooltip
      disableHoverListener={open}
      disableTouchListener={open}
      title={<Typography variant="body1">Log Out</Typography>}
      placement="right"
      arrow
    >
      <ListItem
        className={clsx(classes.logoutButton)}
        button
        onClick={() => {
          dispatch(logoutUser())
          router.push('/')
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
  )
}
