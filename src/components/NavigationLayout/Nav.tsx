import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Theme,
  Toolbar,
  Typography,
} from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import clsx from 'clsx'
import React, { Dispatch, MouseEventHandler, SetStateAction, useRef, useState } from 'react'
import Image from 'next/image'
import companyLogo from '@public/assets/realm1000-logo.png'
import { Settings, Menu as MenuIcon, AccountBox, SvgIconComponent } from '@material-ui/icons'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import IOSSwitch from '@src/components/Switch/iOSSwitch'
import { ColorSchemeTypes, toggleColor } from '@src/redux/data/colorSchemeSlice'
import { RootState } from '@src/redux/store'
import { userDataSelector } from '@src/redux/data/userSlice'
import useWidth from '@src/utils/hooks/useWidth'

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
export default function Nav({
  open,
  handleDrawerOpen,
}: {
  open: boolean
  handleDrawerOpen: () => void
}) {
  const theme: Theme = useTheme()
  const classes = useStyles()
  const width = useWidth()
  const menuTarget = useRef<HTMLAnchorElement | null>(null)
  const [toggleMenuOpen, setToggleMenuOpen] = useState<boolean>(false)
  return (
    <>
      {/* <Box
        position="absolute"
        zIndex={theme.zIndex.drawer + 200}
        className="dev-width-container"
        height="24px"
        width="100%"
        style={{
          background: 'red',
          textAlign: 'center',
          position: 'fixed',
          top: 0,
        }}
      >
        {width}
      </Box> */}
      <AppBar
        position="fixed"
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
                innerRef={menuTarget}
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  setToggleMenuOpen((prevState) => !prevState)
                }}
                color="inherit"
              >
                <Settings />
              </IconButton>
              {/* navigation settings menu */}
              <NavSettingsMenu
                anchorEl={menuTarget.current}
                toggleMenuOpen={() => {
                  setToggleMenuOpen((prevState) => !prevState)
                }}
                open={toggleMenuOpen}
              />
            </Box>
          </div>
        </Toolbar>
        <style jsx>{`
          .custom-menu-item {
            padding: 16px;
          }
          svg {
            color: red;
          }
        `}</style>
      </AppBar>
    </>
  )
}

const useNavStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 32,
    padding: theme.spacing(2),
    '& svg': {
      fontSize: theme.spacing(4),
    },
  },
}))

const NavSettingsMenu = ({
  anchorEl,
  toggleMenuOpen,
  open,
}: {
  anchorEl: MenuProps['anchorEl']
  toggleMenuOpen: Dispatch<SetStateAction<boolean>>
  open: boolean
}) => {
  const classes = useNavStyles()
  const dispatch = useDispatch()
  const isDarkMode = useSelector((state: RootState) => state.colorScheme === ColorSchemeTypes.DARK)
  const user = useSelector(userDataSelector)
  const router = useRouter()
  return (
    <Menu
      PaperProps={{
        style: {
          minWidth: 240,
        },
      }}
      id="nav-settings-menu"
      anchorEl={anchorEl}
      keepMounted
      open={open}
      onClose={toggleMenuOpen}
    >
      <MenuItem
        onClick={() => {
          dispatch(toggleColor())
        }}
        button
        className={classes.menuItem}
      >
        <Typography variant="body2">Dark Mode</Typography>
        <DarkModeSwitch isDarkMode={isDarkMode} />
      </MenuItem>

      <MenuItem
        onClick={(e) => {
          e.preventDefault()
          router.push(`/profile`)
        }}
        href="/profile"
        button
        className={classes.menuItem}
      >
        <Typography variant="body2">Account Information</Typography>
        <AccountBox />
      </MenuItem>
      <Divider />
      <MenuItem
        onClick={(e) => {
          e.preventDefault()
          router.push('/tutorial')
        }}
        className={classes.menuItem}
      >
        <Typography variant="body2">Tutorial</Typography>
      </MenuItem>
    </Menu>
  )
}

const DarkModeSwitch = ({ isDarkMode }: { isDarkMode: boolean }) => (
  <>
    <IOSSwitch checked={isDarkMode} />
  </>
)
