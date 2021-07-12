import { Box, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import RoomIcon from '@material-ui/icons/Room'
import ContactPhoneIcon from '@material-ui/icons/ContactPhone'
import { useEffect, useRef } from 'react'
import { useIntersection } from 'react-use'
import { gsap } from 'gsap'
const useStyles = makeStyles((theme: Theme) => ({
  detailsWrapper: {
    marginTop: 64,
    position: 'relative',
    maxWidth: 1200,
    margin: 'auto',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: -1,
      background: theme.palette.secondary.main,
      [theme.breakpoints.up('sm')]: {
        clipPath: 'polygon(0% 0%, 100% 2em, 100% 80%, 0% 100%)',
      },
      // clipPath: ({ isMobile }: ThemeProps) =>
      //   `polygon(0% 0%, 0% 100%, 100% calc(100% - ${isMobile ? `0px` : `64px`}), 100% ${
      //     isMobile ? `0px` : `64px`
      //   } )`,
    },
  },
  details: {
    // padding: 64,
    // padding: ({ isMobile }: ThemeProps) => `${isMobile ? `24px` : `48px`} 8px`,

    color: theme.palette.background.paper,
    // padding: '48px 8px',
    padding: '64px 16px',
    [theme.breakpoints.down('sm')]: {
      padding: '48px 8px',
    },
  },

  content: {
    '& .divider': {
      height: 2,
      width: '110%',
      background: theme.palette.primary.dark,
      // background: theme.palette.background.paper,
      // margin: 'auto',
      marginTop: 8,
      marginBottom: 16,
      // marginBottom: 32,
    },
    '& .header': {
      margin: 0,
      width: 'max-content',
      '& .title': {
        fontWeight: 600,
        position: 'relative',
        width: 'max-content',
        color: theme.palette.primary.dark,

        // textDecoration: 'underline',
        // '&:after': {
        //   content: "''",
        //   margin: '8px 0',
        //   position: 'absolute',
        //   left: 16,
        //   right: 16,
        //   bottom: 0,
        //   height: 2,
        //   background: 'red',
        // },
      },
    },
    '& > *': {
      marginTop: 8,
    },
    '& .content': {
      textTransform: 'uppercase',

      '& .key': {
        fontWeight: 700,
        lineHeight: 1.2,
      },
      '& .value': {
        fontWeight: 700,
        color: theme.palette.primary.dark,
      },
    },
    '& .details': {
      '& .icon': {
        color: theme.palette.primary.dark,
      },
      '& .key': {
        fontWeight: 700,
        textTransform: 'uppercase',
        marginLeft: 8,
        lineheight: 1,
      },
      '& .value': {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
  },
}))

const Details = () => {
  const classes = useStyles()
  // const { ref, inView, entry } = useInView({
  //   trackVisibility: true,
  //   delay: 100,
  //   threshold: 0.2,
  // })
  // if (entry) {
  //   console.log('inView', inView)
  // }

  const sectionRef = useRef(null)
  const threshold = 0.3
  const intersection = useIntersection(sectionRef, {
    root: null,
    // rootMargin: '40px',
    threshold,
  })

  useEffect(() => {
    const fadeIn = (element) => {
      gsap.to(element, 1, {
        opacity: 1,
        y: -60,
        // ease: 'power4.out',
        /**
         * stagger is going to run the frame animation and 0.3 seconds later the second element
         */
        stagger: 0.3,
      })
    }

    const fadeOut = (element) => {
      gsap.to(element, 1, {
        opacity: 0,
        y: 0,
        ease: 'power4.out',
        /**
         * stagger is going to run the frame animation and 0.3 seconds later the second element
         */

        stagger: {
          amount: 0.3,
        },
      })
    }
    if (!intersection?.isIntersecting) {
      fadeOut('.fadeIn')
    } else {
      fadeIn('.fadeIn')
    }
  }, [intersection])
  return (
    <div ref={sectionRef}>
      <a href="/#details" id="details" className="anchor">
        Details
      </a>
      <div className={`${classes.detailsWrapper} fadeIn`}>
        <div className={classes.details}>
          <div className={classes.content}>
            <div className="header">
              <Typography className="title" variant="h3">
                DETAILS
              </Typography>
              <div className="divider" />
            </div>
            <div className="content">
              {contents.map((ea) => (
                <Box display="flex" key={ea.key}>
                  <Typography variant="h6" className="key">
                    {ea.key}: <span className="value">{ea.value}</span>
                  </Typography>
                  {/* <Typography variant="h6" className="value">
                {ea.value}
              </Typography> */}
                </Box>
              ))}
            </div>
            <div className="details">
              {/* {details.map(({ icon: Icon, ...ea }) => ( */}
              <Box display="flex">
                <RoomIcon className="icon" />
                <Typography className="key">
                  Office Address:{' '}
                  <span className="value">
                    4550 Sampaloc Street., Santolan Road, Gen. T. De Leon, Valenzuela City
                  </span>
                </Typography>
              </Box>
              <Box display="flex">
                <ContactPhoneIcon className="icon" />
                <Typography className="key">
                  Contact Numbers: <span className="value">09913708684 / 09913920547</span>
                </Typography>
              </Box>

              {/* ))} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Details

const contents = [
  { key: 'Territorial Sub Distributor', value: 'Realm 1000 Enterprise Inc., Philippines' },
  { key: 'Authorized Distributor Sales Personnel', value: 'Realm 1000 Ent Inc' },
]
