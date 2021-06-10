import { Theme, Typography } from '@material-ui/core'
import { CheckCircle } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import { setOrderMessage } from '@src/redux/data/orderMessage'
import { useRouter } from 'next/router'
const useStyles = makeStyles((theme: Theme) => ({
  section: {
    maxWidth: 1200,
    margin: 'auto',
    '& *': {
      transition: `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.shortest}ms`,
    },
    '& .sectionTitle': {
      //   marginBottom: 32,
      marginTop: 64,
      textTransform: 'uppercase',
      width: 'max-content',
      margin: 'auto',
      position: 'relative',
      fontWeight: 700,
    },
    '& .divider': {
      height: 2,
      //   background: 'red',
      background: theme.palette.secondary.dark,
      width: 240,
      margin: 'auto',
      marginTop: 16,
      marginBottom: 32,
    },
    // transition
  },

  sectionContent: {
    // overflowY: 'auto',
    maxWidth: '100%',
    overflowX: 'auto',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    // width: 'max-content',
    // display: 'grid',
    margin: 'auto',
    // gridTemplateColumns: 'repeat(3, minmax(24em, 1fr))',
    // gridTemplateColumns: 'repeat(3, minmax(200px, 300px))',
    paddingBottom: 8,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      alignItems: 'center',
      '& > *': {
        marginTop: `16px !important`,
        maxWidth: '24em !important',
      },
    },
  },
  card: {
    maxWidth: '26em',
    // margin: 'auto',
    width: '100%',
    overflow: 'hidden',
    // width: '100%',
    // maxWidth: '28em',
    position: 'relative',
    '& .image-container': {
      marginTop: -32,
      position: 'relative',
      top: 32,
      width: '100%',
      '&::after': {
        content: "''",
        display: 'block',
        paddingBottom: '100%',
      },
    },
    '& .photo-triangle': {
      '&.upper': {
        transform: 'rotate(180deg)',
        height: 40,
        zIndex: 1,
      },
      position: 'absolute',
      height: 32,
      width: '100%',
      background: theme.palette.secondary.main,
      clipPath: 'polygon(100% 0%, 0% 102%, 102% 102%)',
      // '&:after': {
      //   position: 'relative',
      //   content: "''",
      //   marginBottom: 16,
      // },
    },

    '& .content-container': {
      background: theme.palette.secondary.main,
      color: theme.palette.background.paper,
      padding: 16,
      // paddingBottom: 32,
      paddingTop: 32,
      '& > *': {
        marginTop: 16,
      },
      '& .content-header': {
        '& .title': {
          fontWeight: 600,
          lineHeight: '0.8em',
          //   letterSpacing: -1.8,
          opacity: 0.9,
          color: theme.palette.background.paper,
          //   textTransform: 'uppercase',
        },
        '& .subtitle': {
          color: theme.palette.primary.dark,
          fontWeight: 600,
          //   fontFamily: 'Roboto, sans-serif',
          //   letterSpacing: 1.4,
        },
      },
      '& .content-details': {
        '& > span': {
          display: 'flex',
          alignItems: 'center',
          marginTop: 8,
        },
        '& .text': {
          lineHeight: 1,
        },
        '& .icon': {
          //   color: theme.palette.success.main,
          color: theme.palette.primary.dark,
          fontSize: theme.typography.h4.fontSize,
          marginRight: 8,
        },
      },
      '& .content-promo': {
        '& > span': {
          display: 'flex',
          marginTop: 8,
        },
        '& .MuiTypography-root': {
          lineHeight: 1,
          fontFamily: 'Raleway, sans-serif',
        },
        '& .key': {
          marginRight: 8,
          color: theme.palette.primary.dark,
        },
        '& .value': {},
      },
    },
    '& .content-button': {
      display: 'flex',
      justifyContent: 'flex-end',
      position: 'relative',
      height: 'max-content',
      background: theme.palette.secondary.main,
      overflow: 'hidden',
      // '&::before': {
      //   content: "''",
      //   position: 'absolute',
      //   left: 0,
      //   right: 0,
      //   top: 0,
      //   bottom: 0,
      //   background: theme.palette.secondary.main,
      //   zIndex: 2,
      //   clipPath: 'polygon(0% 0%, 0% 100%, 100% 0%)',
      // },
      '&::after': {
        content: "''",
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        background: theme.palette.primary.dark,
        clipPath: 'polygon(0% 101%, 101% 0%, 101% 101%)',
      },
      '& .text': {
        zIndex: 2,
        marginRight: 16,
        marginBottom: 12,
        marginTop: 16,
        position: 'relative',
        width: 'max-content',
        cursor: 'pointer',
        '&::after': {
          content: "''",
          position: 'absolute',
          background: theme.palette.secondary.main,
          height: 2,
          right: 0,
          left: 0,
          bottom: 0,
        },
        '&:hover': {
          color: theme.palette.background.paper,
          '&::after': {
            background: theme.palette.background.paper,
          },
        },
      },
    },
  },
}))

const PromoPackages = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const router = useRouter()
  const generateMarginTopOffset = (index: number) => {
    if (index === 0) {
      return 72
    }
    if (index === 1) {
      return 0
    }
    return 48
  }
  return (
    <>
      <a href="/#sim-packages" id="sim-packages" className="anchor">
        SIM Package
      </a>
      <div className={classes.section}>
        <Typography className="sectionTitle" variant="h3" component="p">
          Promo Packages
        </Typography>
        {/* <Divider variant="middle" /> */}
        <div className="divider" />

        <div className={classes.sectionContent}>
          <div className={classes.flexContainer}>
            {promoPackages.map((sim, index) => (
              <div
                style={{
                  marginTop: generateMarginTopOffset(index),
                }}
                className={classes.card}
                key={sim.title}
              >
                <div className="photo-triangle upper" />
                <div className="image-container">
                  <Image
                    src={sim.image}
                    objectFit="cover"
                    layout="fill"
                    alt="Dito Sim Package"
                    // width={300}
                    //  height={300}
                  />
                </div>
                <div className="photo-triangle" />
                <div className="content-container">
                  <div className="content-header">
                    <Typography className="title" color="secondary" variant="h4" component="p">
                      {sim.title}
                    </Typography>
                    <Typography className="subtitle">{sim.subtitle}</Typography>
                    {/* <Typography className="sub-title" variant="h5">
                    {sim.price}
                  </Typography> */}
                  </div>
                  <div className="content-details">
                    {sim.contents.map((content) => (
                      <span key={content}>
                        <CheckCircle className="icon" />
                        <Typography className="text" variant="h6">
                          {content}
                        </Typography>
                      </span>
                    ))}
                  </div>
                  <div className="content-promo">
                    {sim.others.map((promo) => (
                      <span key={promo.name}>
                        <Typography className="key" variant="body1">
                          {promo.name}:
                        </Typography>
                        <Typography className="value" variant="body1">
                          {promo.value}
                        </Typography>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="content-button">
                  <Typography
                    onClick={() => {
                      dispatch(
                        setOrderMessage(`Inquiry: ${sim.title} with ${sim.contents.toString()}
                          -- Insert message below --

                        `)
                      )
                      router.push('/#contact')
                    }}
                    className="text"
                    variant="h6"
                    color="secondary"
                  >
                    ORDER
                  </Typography>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

const promoPackages = [
  {
    // title: 'Loader / Retailer Starting Kit A',
    title: 'Starter Kit',
    subtitle: 'Loader and Retailer',
    price: '₱500.00',
    contents: ['1 Retailer SIM', 'With Promo Load worth ₱400.00'],
    others: [
      // { name: 'SRP', value: '₱39.00 / SIM' },
      // { name: 'Loader Sim Price', value: 'FREE' },
      // { name: 'Welcome Promo Load Worth', value: '₱400.00' },
    ],
    image: '/assets/products/dito-sim.png',
  },
  {
    // title: 'Loader / Retailer Starting Kit B',
    title: 'Middle Kit',
    subtitle: 'Loader and Retailer',
    price: '₱780.00',

    // contents: ['10PCS SIM with ₱199.00 Load', '1PC Loader SIM with ₱199.00 Load'],
    contents: ['1 Retailer SIM', '3PCS DITO SIM', 'With Promo Load worth ₱600.00'],
    others: [
      // { name: 'SRP', value: '₱39.00 / SIM' },
      // { name: 'Loader Sim Price', value: 'FREE' },
      // { name: 'Welcome Promo Load', value: '₱199.00' },
    ],

    image: '/assets/products/dito-sim.png',
  },

  {
    // title: 'Loader / Retailer Starting Kit C',
    title: 'Intermediate Kit',
    subtitle: 'Loader and Retailer',
    price: '₱1500.00',
    contents: ['1 Retailer SIM', '5PCS DITO SIM', 'With Promo Load worth ₱1000.00'],
    others: [
      // { name: 'SRP', value: '₱39.00 / SIM' },
      // { name: 'Loader Sim Price', value: 'FREE' },
      // { name: 'Welcome Promo Load', value: '₱1000.00' },
    ],
    image: '/assets/products/dito-sim.png',
  },
]

export default PromoPackages
