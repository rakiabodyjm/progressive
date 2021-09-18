import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import clsx from 'clsx'
import { useState } from 'react'
import Image from 'next/image'
import companyLogo from '@public/assets/realm1000-logo.png'
import { Settings, Menu as MenuIcon } from '@material-ui/icons'
import { useRouter } from 'next/router'
import IOSSwitch from '@src/components/common/Switch/iOSSwitch'

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: theme.palette.secondary.main,
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
    marginRight: 16,
  },
  hide: {
    display: 'none',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
}))
export default function Nav({ open, handleDrawerOpen }) {
  const theme: Theme = useTheme()
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null)
  return (
    <AppBar
      position="fixed"
      className={clsx(classes.appBar, {
        [classes.appBarShift]: open,
      })}
    >
      <NavSettingsMenu
        handleClose={() => {
          console.log('handlign close')
          setAnchorEl(null)
        }}
        anchorEl={anchorEl}
      />
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
        <div className={classes.navContainer}>
          <div
            style={{
              position: 'relative',
              height: theme.spacing(7),
              width: theme.spacing(7),
            }}
          >
            <Image src={companyLogo} alt="REALM1000 DITO" layout="fill" objectFit="contain" />
          </div>
          <Box color="primary.main" display="flex">
            <IconButton
              onClick={(e) => {
                setAnchorEl(e.currentTarget)
              }}
              color="inherit"
            >
              <Settings />
            </IconButton>
          </Box>
        </div>
      </Toolbar>
    </AppBar>
  )
}

const NavSettingsMenu = ({ anchorEl, handleClose }) => (
  <Menu
    PaperProps={{
      style: {
        minWidth: 240,
      },
    }}
    id="nav-settings-menu"
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
  >
    <MenuItem
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Typography variant="body2">Dark Mode</Typography>
      <IOSSwitch />
    </MenuItem>
  </Menu>
)
