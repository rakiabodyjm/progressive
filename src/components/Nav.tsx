import { Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import useWidth from '@src/utils/useWidth'
import clsx from 'clsx'
import Image from 'next/image'
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
    background: theme.palette.secondary.main,
  },
  flexContainer: {
    position: 'relative',
    maxWidth: 1200,
    margin: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: theme.palette.secondary.main,
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
    [theme.breakpoints.down('xs')]: {
      maxWidth: '70%',
    },
  },
  menuItem: {
    color: '#FFF',
    textTransform: 'uppercase',
  },
}))

const Nav = () => {
  const classes = useStyles()
  const width = useWidth()
  const theme: Theme = useTheme()
  return (
    <>
      <div className={classes.root}>
        {process.env.NODE_ENV === 'development' && (
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
        )}
        <div className={classes.flexContainer}>
          <div>
            <div className={classes.logoContainer}>
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
            </div>
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
      </div>
    </>
  )
}

const menuItems = [{ name: 'Buy Now' }, { name: 'Contact' }, { name: 'About' }, { name: 'FAQ' }]
export default Nav
