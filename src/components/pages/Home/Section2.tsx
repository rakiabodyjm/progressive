import { Divider, Theme, Typography } from '@material-ui/core'
import { CheckCircle } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Image from 'next/image'

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
    overflowY: 'auto',
    maxWidth: '100%',
  },
  flexContainer: {
    height: '100%',
    display: 'grid',
    margin: 'auto',
    gridTemplateColumns: 'repeat(3, minmax(24em, 1fr))',
    // gridTemplateColumns: 'repeat(3, minmax(200px, 300px))',
    gap: 16,
  },
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    maxWidth: '28em',
    margin: 'auto',
    width: '100%',
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
      position: 'absolute',
      height: 32,
      width: '100%',
      background: theme.palette.secondary.main,
      clipPath: 'polygon(0% 0%, 0% 100%, 100% 100%)',
      '&:after': {
        position: 'relative',
        content: "''",
        marginBottom: 16,
      },
    },

    '& .content-container': {
      background: theme.palette.secondary.main,
      color: theme.palette.background.paper,
      padding: 16,
      paddingBottom: 32,
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
        '& .sub-title': {
          marginTop: 16,
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
      '&::before': {
        content: "''",
        position: 'absolute',
        left: 0,
        right: 0,
        top: -16,
        bottom: 0,
        background: theme.palette.secondary.main,
        zIndex: 2,
        clipPath: 'polygon(0% 0%, 0% 100%, 100% 0%)',
      },
      '&::after': {
        content: "''",
        position: 'absolute',
        left: 0,
        right: 0,
        top: -16,
        bottom: 0,
        background: theme.palette.primary.dark,
        zIndex: 1,
      },
      '& .text': {
        zIndex: 2,
        marginRight: 16,
        marginBottom: 12,
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

const Section2 = () => {
  const classes = useStyles()
  return (
    <>
      <div className="anchor" id="selection" />
      <div className={classes.section}>
        <Typography className="sectionTitle" variant="h3" component="p">
          Promo Packages
        </Typography>
        {/* <Divider variant="middle" /> */}
        <div className="divider" />

        <div className={classes.sectionContent}>
          <div className={classes.flexContainer}>
            {promoPackages.map((sim) => (
              <div className={classes.card} key={sim.title}>
                <div className="image-container">
                  <Image
                    src={sim.image}
                    objectFit="cover"
                    layout="fill"
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
                  <Typography className="text" variant="h6">
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
    price: '₱ 1380.00',

    contents: ['5PCS SIM with ₱ 199.00 Load', '1PC Loader SIM with ₱ 199.00 Load'],
    others: [
      { name: 'SRP', value: '₱ 39.00 / SIM' },
      { name: 'Loader Sim Price', value: 'FREE' },
      { name: 'Welcome Promo Load', value: '₱ 199.00' },
    ],
    image: '/assets/products/dito-sim-2.png',
  },
  {
    // title: 'Loader / Retailer Starting Kit B',
    title: 'Middle Kit',

    price: '₱ 2530.00',

    contents: ['10PCS SIM with ₱ 199.00 Load', '1PC Loader SIM with ₱ 199.00 Load'],
    others: [
      { name: 'SRP', value: '₱ 39.00 / SIM' },
      { name: 'Loader Sim Price', value: 'FREE' },
      { name: 'Welcome Promo Load', value: '₱ 199.00' },
    ],

    image: '/assets/products/dito-sim-2.png',
  },

  {
    // title: 'Loader / Retailer Starting Kit C',
    title: 'Intermediate Kit',
    price: '₱ 4925.00',
    contents: ['20PCS SIM with ₱ 199.00 Load', '1PC Loader SIM with ₱ 199.00 Load'],
    others: [
      { name: 'SRP', value: '₱ 39.00 / SIM' },
      { name: 'Loader Sim Price', value: 'FREE' },
      { name: 'Welcome Promo Load', value: '₱ 199.00' },
    ],
    image: '/assets/products/dito-sim-2.png',
  },
]

export default Section2
