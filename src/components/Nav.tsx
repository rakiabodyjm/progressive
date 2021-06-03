import { Box, Button, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import useWidth, { useIsMobile } from '@src/utils/useWidth'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
const url =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // margin: 'auto',
    // height: 140,
    // background: theme.palette.secondary.main,
    // // clipPath: 'polygon(0.3% 3px, 99.68% 0.72%, 97.6% 48.35%, 19.58% 72.22%, 0.29% 39.7%)',
    // clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 21.02% 67.22%, 0% 39.7%)',
    // [theme.breakpoints.down('xs')]: {
    //   clipPath: 'polygon(0% 0%, 100% 0%, 100% 35.00%, 21.59% 50.79%, 0% 29.7%)',
    // },
    // position: 'relative',
    // display: (props: { hidden: boolean }) => (props.hidden ? 'none' : 'inherit'),
    zIndex: theme.zIndex.appBar,
    position: 'fixed',
    top: 0,
    width: '100%',
    // height: 'max-content',
    maxHeight: 60,

    background: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      '& .hide-on-sm': {
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
    // background: theme.palette.secondary.main,
    height: 60,

    [theme.breakpoints.up('sm')]: {
      height: 60,
    },
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
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 80,
      maxWidth: '100%',
    },
  },
  menuItem: {
    color: '#FFF',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.dark,
      position: 'relative',
    },
  },
  reloadButton: {
    padding: '6px 24px',
    backgroundSize: '400%',
    // background: theme.palette.primary.dark,
    background: 'transparent',
    color: theme.palette.background.paper,
    '&::before': {
      content: "''",
      position: 'absolute',
      top: -2,
      left: -2,
      right: -2,
      bottom: -2,
      filter: 'blur(4px)',
      zIndex: -1,
      transition: `opacity 0.5s ${theme.transitions.easing.easeInOut}`,
      background: `linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)`,
      backgroundSize: '400%',
      animation: `$animate 20s ${theme.transitions.easing.sharp} infinite`,
      borderRadius: 24,
    },
    '&::after': {
      borderRadius: 24,
      content: "''",
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      background: theme.palette.primary.dark,
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
    background: 'transparent',
    height: 20,
    position: 'relative',
    backdropFilter: 'blur(8px)',
    zIndex: -1,
    // clipPath: 'polygon(0% 0%, 100% 0%, 100% 40%, 21.02% 67.22%, 0% 39.7%)',
    overflow: 'hidden',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      // background: 'red',
      background: 'gray',
      opacity: 0.4,
    },
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
}))

const Nav = () => {
  const router = useRouter()

  const hidden = useMemo(() => router.pathname === '/email', [router.pathname])
  const classes = useStyles({ hidden })
  // const router = useRouter()

  return (
    <>
      <nav className={classes.root}>
        {/* {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              // background: 'lightblue',
              background: theme.palette.primary.main,
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
        )} */}
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

          <div className={classes.menuContainer}>
            {menuItems.map((menuItem) => (
              <Typography
                className={classes.menuItem}
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
            <div>
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
            </div>
          </div>
        </div>
        <div className={classes.line}></div>
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
