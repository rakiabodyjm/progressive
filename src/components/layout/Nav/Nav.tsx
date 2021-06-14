import { Button, ButtonBase, hexToRgb, Theme, Typography, useTheme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo, useState, useCallback } from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@src/components/layout/Nav/Drawer'
import useWidth from '@src/utils/useWidth'
const url =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL

const useStyles = makeStyles((theme: Theme) => ({
  rootWrapper: {
    width: '100%',
    background: theme.palette.secondary.main,
    height: 80,
    position: 'fixed',
    top: 0,
    zIndex: theme.zIndex.appBar,
  },
  root: {
    // clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 45% 60%, 24.63% 79%, 0.00% 81%)',
    // clipPath: `polygon(
    //   0% 0%,
    //   100% 0%,
    //   100% 60px,
    //   calc(80px + 80px) 60px,
    //   80px 100%,
    //   0.00% 100%)`,
    maxWidth: 1200,
    margin: 'auto',
    position: 'relative',
    // marginLeft: '50%',
    // transform: 'translateX(-50%)',
    width: '100%',
    height: 80,

    '&:before': {
      content: "''",
      position: 'absolute',
      background: theme.palette.secondary.main,
      clipPath: `polygon(
        0% 0%, 
        100% 0%,
        100% 80px,
        calc(80px + 80px) 60px,
        80px 100%, 
        0.00% 100%)`,
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    [theme.breakpoints.down('sm')]: {
      '& .hide-on-sm': {
        '& > :not(.exception)': {
          display: 'none',
        },
      },
    },

    [theme.breakpoints.up('md')]: {
      '& .hamburger-icon': {
        display: 'none',
      },
    },

    '& *': {
      transition: `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.shortest}ms`,
    },
  },
  flexContainer: {
    position: 'relative',
    maxWidth: 1200,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',

    height: 60,
  },
  logoContainer: {
    background: theme.palette.secondary.main,
    borderRadius: 4,
    padding: 4,
    height: 80,
    width: 80,
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    // [theme.breakpoints.up('md')]: {
    //   left: '18%',
    // },
  },
  menuContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-around',
    maxWidth: '50%',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '70%',

      justifyContent: 'flex-end',
      paddingRight: 8,
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 80,
      maxWidth: '100%',
    },
  },
  menuItem: {
    // color: theme.palette.secondary.main,
    color: theme.palette.background.paper,
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&.active': {
      color: theme.palette.primary.dark,
    },
    '&:hover': {
      color: theme.palette.primary.dark,
      position: 'relative',
    },
  },
  reloadButton: {
    '& .MuiTouchRipple-root': {
      borderRadius: 24,
    },
    padding: '6px 24px',
    backgroundSize: '400%',
    // background: theme.palette.primary.dark,
    background: 'transparent',
    color: theme.palette.background.paper,
    zIndex: theme.zIndex.appBar + 1,
    position: 'relative',
    '&::before': {
      // content: "''",
      // position: 'absolute',
      // top: -2,
      // left: -2,
      // right: -2,
      // bottom: -2,
      // borderRadius: 24,
      // zIndex: -1,
      // transition: `opacity 0.5s ${theme.transitions.easing.easeInOut}`,
      // background: `linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)`,
      // backgroundSize: '400%',
      // animation: `$animate 20s ${theme.transitions.easing.sharp} infinite`,

      position: 'absolute',
      content: "''",
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      background: 'transparent',
      zIndex: -1,
      borderRadius: 24,
      backdropFilter: 'blur(24px)',
    },
    '&::after': {
      borderRadius: 24,
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      // background: theme.palette.primary.dark,
      background: 'var(--primary-gradient)',
      zIndex: -1,
      opacity: 1,
      transition: `opacity 0.5s ${theme.transitions.easing.easeInOut}`,
    },

    '&:hover': {
      // transform: 'scale(1.2)',
      background: 'transparent',
      '&::before': {
        // zIndex: 2,
      },
      '&::after': {
        opacity: 0,
      },
      '& a': {
        transform: 'scale(1.2)',
      },
    },
    '& a': {
      fontWeight: 700,
      color: 'inherit',
    },
  },
  line: {
    position: 'absolute',
    zIndex: -1,
    width: '100%',
    height: 20,
    '@supports (backdrop-filter: blur(8px))': {
      backdropFilter: 'blur(8px)',
      background: hexToRgb(theme.palette.primary.dark)
        .replace('rgb', 'rgba')
        .replace(')', ', 0.8)'),
    },
    '@supports not (backdrop-filter: blur(8px))': {
      background: hexToRgb(theme.palette.primary.dark)
        .replace('rgb', 'rgba')
        .replace(')', ', 0.8)'),
    },
    overflow: 'hidden',
    // background: `linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)`,
    // '&:after': {
    //   content: "''",
    //   position: 'absolute',

    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
    // },
  },
  '@keyframes animate': {
    '0%': {
      backgroundPosition: '50% 50%',
      // color: theme.palette.secondary.main,
    },
    '50%': {
      backgroundPosition: '400% 0%',
      // color: theme.palette.primary.dark,
    },
    '100%': {
      backgroundPosition: '50% 50%',
      // color: theme.palette.secondary.main,
    },
  },
  animatedRainbow: {
    content: "''",
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 24,
    zIndex: theme.zIndex.appBar - 2,
    transition: `opacity 0.5s ${theme.transitions.easing.easeInOut}`,
    background: `linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)`,
    backgroundSize: '400%',
    animation: `$animate 20s ${theme.transitions.easing.sharp} infinite`,
    // filter: 'blur(5px)',
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}))

const Nav = () => {
  const router = useRouter()
  const { asPath } = router
  const hidden = useMemo(() => router.pathname === '/email', [router.pathname])
  const classes = useStyles({ hidden })
  const isActive = useCallback((link) => new RegExp(`${asPath}$`).test(`/${link}`), [asPath])

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const theme = useTheme()
  const width = useWidth()
  // const idLink = useMemo(() => {
  //   /#[A-Za-z]/.test(asPath)
  // }, [asPath])
  // const router = useRouter()
  return (
    <>
      <nav className={classes.rootWrapper}>
        <div className={classes.root}>
          {process.env.NODE_ENV === 'development' && (
            <div
              style={{
                // background: 'lightblue',
                background: theme.palette.primary.main,
                position: 'absolute',
                zIndex: theme.zIndex.appBar + 1,
                width: '100%',
              }}
            >
              <Typography
                style={{
                  width: 'max-content',
                  margin: 'auto',
                  fontWeight: 600,
                }}
                variant="body1"
              >
                {width}
              </Typography>
            </div>
          )}
          <div className={classes.flexContainer}>
            <div>
              <a
                href={url}
                onClick={(e) => {
                  e.preventDefault()
                  // router.push(url)
                  router.push(url)
                }}
                className={classes.logoContainer}
              >
                <div
                  style={{
                    position: 'relative',
                    height: '100%',
                  }}
                >
                  <Image
                    src="/assets/realm1000-logo.png"
                    alt="REALM1000 Logo"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </a>
            </div>

            <div className={`${classes.menuContainer} hide-on-sm`}>
              {menuItems.map((menuItem) => (
                <Typography
                  className={classes.menuItem}
                  style={{
                    color: isActive(menuItem.href) && 'var(--primary-dark)',
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    router.push(`/${menuItem.href}`)
                  }}
                  key={menuItem.name}
                  variant="body1"
                  component="a"
                  href={`/${menuItem.href}`}
                >
                  {menuItem.name}
                </Typography>
              ))}
              <ButtonBase
                onClick={() => {
                  setDrawerOpen((prevState) => !prevState)
                }}
                className="exception hamburger-icon"
                style={{
                  padding: 4,
                  borderRadius: 4,
                  marginRight: 8,
                }}
              >
                <MenuIcon
                  style={{
                    color: 'var(--primary-dark)',
                    fontSize: '2em',
                  }}
                />
              </ButtonBase>
              <div
                className="exception"
                style={{
                  position: 'relative',
                }}
              >
                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/reload')
                  }}
                  href="/reload"
                  disableElevation
                  className={`${classes.reloadButton}`}
                  variant="contained"
                >
                  <Typography variant="body1">RELOAD</Typography>
                </Button>
                <div className={classes.animatedRainbow}></div>
              </div>
            </div>
          </div>
          <div className={classes.line}></div>
        </div>

        <Drawer
          onClose={() => {
            setDrawerOpen(false)
          }}
          onOpen={() => {
            setDrawerOpen(true)
          }}
          menuItems={menuItems}
          open={drawerOpen}
          setOpen={setDrawerOpen}
          className={classes.drawer}
          disableDiscovery
        />
      </nav>
    </>
  )
}

const menuItems = [
  { name: 'Order', href: '#sim-packages' },
  { name: 'Contact', href: '#contact' },
  { name: 'About', href: '#details' },
  { name: 'FAQ', href: '#faq' },
  // { name: 'RELOAD', href: '/reload' },
]
export default Nav
