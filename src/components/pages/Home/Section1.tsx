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
    '&::after': {
      content: "''",
      position: 'absolute',
    },
    position: 'relative',
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
      fontSize: '20px !important',
      lineHeight: 0.95,
      margin: 0,
      marginTop: 8,
      // color: theme.palette.secondary.light,
      opacity: 0.8,
      letterSpacing: -1,
    },
    '& .subtitle-button': {
      fontWeight: 700,
      color: '#000',
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
    // letterSpacing: -1.4,
    '& span': {
      height: '100%',
      '& :after': {
        paddingLeft: '100%',
      },
    },
    '& .text': {
      textTransform: 'uppercase',
    },
    [theme.breakpoints.down('xs')]: {
      '& .text': {
        fontSize: 32,
      },
      '& span': {
        // width: ` !important`,
        height: '100%',

        '& img': { verticalAlign: 'center' },
      },
    },
  },
  inquireButton: {
    borderRadius: 4,
    padding: '8px 16px',
    // marginLeft: -8,
    width: '100%',
    marginTop: 16,
    background: theme.palette.primary.main,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
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
            <h1 className="text nowrap">Wholesale</h1>

            <span
              style={{
                position: 'relative',
                // width: 100,
                marginLeft: 8,
                // height: 40,
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
            <h1 className="text">Sim Packages</h1>
          </div>
          <div>
            <p className="text subtitle">
              Territorial Sub Distributor and Authorized Distributor Sales Personnel
            </p>
          </div>
          <Button
            className={classes.inquireButton}
            variant="contained"
            color="primary"
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
