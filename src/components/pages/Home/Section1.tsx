import { Button, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Image from 'next/image'
import { useIsMobile } from '@src/utils/useWidth'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& *': {
      transition: `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.shortest}ms`,
      // filter: 'saturate(1.04)',
    },
    // '&:after': {
    //   content: "''",
    //   top: 0,
    //   left: 0,
    //   right: 0,
    //   bottom: 0,
    //   position: 'absolute',
    //   // clipPath: 'polygon(0% 0,  0% 100%, 60% 100%)',
    //   clipPath: 'polygon(0% 20%, 0% 90%, 100% 67%, 100% 51%)',
    //   // zIndex: 1000000000,
    //   zIndex: -1,
    //   background: theme.palette.primary.dark,
    // },
    marginTop: 60,
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 1200,
    margin: 'auto',
    height: 'calc(100vh - 90px)',
    maxHeight: 1080,
    '& .text': {
      fontSize: 40,
      margin: 0,
    },
    '& .subtitle': {
      // color: theme.palette.secondary.main,
      fontSize: '20px !important',
      lineHeight: 0.95,
      margin: 0,
      marginTop: 8,
      // color: theme.palette.secondary.light,
      // letterSpacing: -1,
    },

    '& .raleway': {
      fontFamily: 'Raleway, sans-serif',
      letterSpacing: 0.8,
    },
    '& .subtitle-button': {
      fontWeight: 700,
      // color: '#000',
      color: theme.palette.background.paper,
      marginTop: 0,
    },

    '& .nowrap': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  flexContainer: {
    display: 'flex',
    height: '100%',

    /**
     * Controls for textContainer and imageContainer
     */
    [theme.breakpoints.down('md')]: {
      '& $textContainer': {
        width: '42%',
      },
    },
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',

      '& $textContainer': {
        top: 0,
        margin: 'auto',
        width: '100%',
        maxWidth: 480,
        transform: 'none',
      },
      '& $imageContainer': {},
    },
  },
  textContainer: {
    height: 'max-content',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '35%',
    zIndex: 1,

    // '&:after': {
    //   content: "''",
    //   position: 'absolute',
    //   top: -64,
    //   left: -64,
    //   right: -64,
    //   bottom: -64,
    //   background: theme.palette.secondary.main,
    //   zIndex: -1000,
    //   clipPath: 'polygon(30% 0%, 0% 100%, 70% 100%, 100% 0%)',
    // },
  },
  imageContainer: {
    position: 'relative',
    flexGrow: 1,
    flexShrink: 0,
    transform: 'scale(1.15)',
    transformOrigin: '50% 0%',
  },

  title: {
    display: 'inline-flex',
    lineHeight: 1,
    letterSpacing: '-0.06em',
    '& span': {
      height: '100%',
      '& :after': {
        paddingLeft: '100%',
      },
    },
    '& .text': {
      color: theme.palette.primary.dark,
      textTransform: 'uppercase',
      lineHeight: 1,
    },
    '& .animate': {
      animation: `$animate-background 5s ${theme.transitions.easing.easeInOut} infinite`,
      backgroundImage: 'linear-gradient(148deg, var(--primary-main) 0%, var(--primary-dark) 100%)',
      backgroundSize: '300% 300%',
      textFillColor: 'transparent',
      WebkitTextFillColor: 'transparent',
      WebkitBackgroundClip: 'text',
      MozBackgroundClip: 'text',
      filter: 'saturate(2)',
      boxShadow: '2px 2px 2px 4px solid black',
    },
    [theme.breakpoints.down('xs')]: {
      '& .text': {
        fontSize: 32,
      },
      '& span': {
        // width: ` !important`,
        height: '100%',

        '& img': { filter: 'saturate(0.8)' },
      },
    },
  },
  inquireButton: {
    borderRadius: 4,
    padding: '12px 16px',
    // marginLeft: -8,
    width: '100%',
    marginTop: 16,
    background: theme.palette.secondary.main,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },

    '&:hover': {
      background: theme.palette.primary.main,

      '& .subtitle-button': {
        color: theme.palette.secondary.dark,
        transform: 'scale(1.3)',
      },
    },
  },
  '@keyframes animate-background': {
    '0%': {
      backgroundPosition: '0% 50%',
    },
    '50%': {
      backgroundPosition: '100% 50%',
    },
    '100%': {
      backgroundPosition: '0% 50%',
    },
  },
}))

const Section1 = () => {
  const isMobile = useIsMobile()
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <div className={classes.flexContainer}>
        <div className={classes.textContainer}>
          <div className={classes.title}>
            <h1 className="text animate nowrap">Wholesale</h1>

            <span
              style={{
                position: 'relative',
                marginLeft: 8,
              }}
            >
              <Image
                src="/assets/dito.svg"
                alt="DITO"
                width={isMobile ? '80' : '100'}
                height={isMobile ? '30px' : '40px'}
              />
            </span>
          </div>

          <div className={classes.title}>
            <h1 className="text animate">Sim Packages</h1>
          </div>
          <div>
            <p className="text subtitle">
              REALM 1000 Enterprise Inc., Philippines is the Territorial Subdistributor of
              Valenzuela City, Under NTC
              {/* Territorial Sub Distributor and Authorized Distributor Sales Personnel */}
            </p>
          </div>
          <Button
            className={classes.inquireButton}
            variant="contained"
            color="secondary"
            disableElevation
          >
            <p className="subtitle subtitle-button">Inquire</p>
          </Button>
        </div>

        <div className={classes.imageContainer}>
          <Image src="/assets/dito-splash.svg" layout="fill" objectFit="contain" />
        </div>
      </div>
    </div>
  )
}

export default Section1
