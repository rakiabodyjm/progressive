import React from 'react'
import clsx from 'clsx'
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles'
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  ClickAwayListener,
} from '@material-ui/core'
// import CssBaseline from '@material-ui/core/CssBaseline'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import MailIcon from '@material-ui/icons/Mail'
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications'
import ComputerIcon from '@material-ui/icons/Computer'
import ReceiptIcon from '@material-ui/icons/Receipt'
import AccountBoxIcon from '@material-ui/icons/AccountBox'
import ContactMailIcon from '@material-ui/icons/ContactMail'
const drawerWidth = 320

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
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
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
)

export default function MiniDrawer({ children }) {
  const classes = useStyles()
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        color="secondary"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            style={{
              fontWeight: 600,
            }}
            noWrap
          >
            REALM1000 Admin Site
          </Typography>
        </Toolbar>
      </AppBar>
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>

        <Divider />
        <List>
          {links.map((ea) => (
            <ListItem button key={ea.url}>
              <ListItemIcon>{ea.icon}</ListItemIcon>
              <ListItemText primary={ea.name} {...(ea.secondary && { secondary: ea.secondary })} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {operationLinks.map((ea) => (
            <ListItem button key={ea.url}>
              <ListItemIcon>{ea.icon}</ListItemIcon>
              <ListItemText primary={ea.name} {...(ea.secondary && { secondary: ea.secondary })} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div
          style={{
            marginTop: theme.spacing(6),
          }}
        />

        {children}
      </main>
    </div>
  )
}

const links = [
  {
    name: 'Accounts',
    url: '/accounts',
    secondary: 'Account Management',
    icon: <AccountBoxIcon />,
  },
  {
    name: 'Configurations',
    url: '/configurations',
    secondary: 'PC Configurations and Discounts',
    icon: <SettingsApplicationsIcon />,
  },
  {
    name: 'Components',
    secondary: 'PC Components and Prices',
    url: '/components',
    icon: <ComputerIcon />,
  },
]

const operationLinks = [
  {
    name: 'Transactions',
    url: '/transactions',
    secondary: 'All Transactions',
    icon: <ReceiptIcon />,
  },
  {
    name: 'Contacts',
    secondary: 'Customer Messages',
    url: '/contact',
    icon: <ContactMailIcon />,
  },
]
