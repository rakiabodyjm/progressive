import { Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import useWidth from '@src/utils/useWidth'
import Image from 'next/image'
import { useRouter } from 'next/router'
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
    zIndex: theme.zIndex.appBar,
    position: 'fixed',
    top: 0,
    width: '100%',
    // height: 'max-content',
    maxHeight: 60,
    background: theme.palette.secondary.main,
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
    height: 50,

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
    [theme.breakpoints.down('xs')]: {
      maxWidth: '70%',
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
}))

const Nav = () => {
  const classes = useStyles()
  const width = useWidth()
  const theme: Theme = useTheme()
  // const router = useRouter()
  const router = useRouter()
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
                router.push({
                  href: url,
                })
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
                }}
                key={menuItem.name}
                variant="body1"
                component="a"
                href="/"
              >
                {menuItem.name}
              </Typography>
            ))}
          </div>
        </div>
        <div className={classes.line}></div>
      </nav>
    </>
  )
}

const menuItems = [{ name: 'Buy Now' }, { name: 'Contact' }, { name: 'About' }, { name: 'FAQ' }]
export default Nav
