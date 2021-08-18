import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Typography,
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
} from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'

const mainMenuItems = [
  {
    title: 'dashboard',
    icon: <Dashboard />,
  },
  {
    title: 'DSP',
    icon: <PersonPinCircle />,
  },
  {
    title: 'retailers',
    icon: <ContactPhone />,
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
}))
export default function DrawerComponent({ open, handleDrawerClose }) {
  const classes = useStyles()
  const theme: Theme = useTheme()
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
        <IconButton onClick={handleDrawerClose}>
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
        <Typography variant="h6">
          Welcome{' '}
          <span
            style={{
              color: 'var(--primary-dark)',
              fontWeight: 600,
            }}
          >
            Janeo Miguel
          </span>
        </Typography>
        <Typography color="secondary" variant="body1">
          Admin
        </Typography>
      </div>
      <Divider />
      <List
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
      </List>
      {mainMenuItems.map((menuItem) => (
        <ListItem
          style={{
            paddingTop: 16,
            paddingBottom: 16,
          }}
          button
          key={menuItem.title}
        >
          {/* <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon> */}
          <ListItemIcon>{menuItem.icon}</ListItemIcon>
          <ListItemText
            style={{
              textTransform: 'capitalize',
            }}
            primary={menuItem.title}
          />
        </ListItem>
      ))}
      <Divider></Divider>
    </Drawer>
  )
}
