import { Box, Button, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Image from 'next/image'
import DitoSVG from '@public/assets/dito.svg'
import { useEffect, useState } from 'react'
import { CardTravelOutlined, OutlinedFlag } from '@material-ui/icons'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    '& *': {
      //   transition: 'all ease-in-out 0.2s',
      transition: `all ${theme.transitions.easing.easeInOut} ${theme.transitions.duration.shortest}`,
    },
    maxWidth: 1200,
    margin: 'auto',
    // height: 'calc(100vh - 80px)',
    // minHeight: 720,
    height: 720,
    '& .text': {
      fontSize: 40,
      margin: 0,
    },
    '& .subtitle': {
      fontSize: '24px !important',
      lineHeight: 1,
      margin: 0,
    },
    '& .nowrap': {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    [theme.breakpoints.down(1200)]: {
      padding: '0 16px',
    },
    // [theme.breakpoints.down('xs')]: {
    //   padding: '0 16px',
    // },
  },
  textContainer: {
    zIndex: 1,
    maxWidth: '33.33%',
    minWidth: 400,
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    // transformOrigin: 'left center',
    [theme.breakpoints.down('sm')]: {
      top: '90%',
      margin: 'auto',
      maxWidth: 480,
    },
  },

  title: {
    display: 'inline-flex',
    lineHeight: 1,
    letterSpacing: -1.4,
  },
  subtitle: {
    marginTop: 8,
    maxWidth: 640,
  },

  imageContainer: {
    position: 'absolute',
    height: '100%',
    width: '60%',
    maxWidth: 720,
    right: 0,
    top: '50%',
    transform: 'translateY(-40%)',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '70%',
      top: '40%',
    },
  },
}))

const Section1 = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.textContainer}>
        <Box color="secondary" width="max-content" display="flex">
          <div className={classes.title}>
            <h1 className="text nowrap">GET YOUR</h1>

            <span
              style={{
                position: 'relative',
                height: '100%',
                width: 100,
                marginLeft: 8,
              }}
            >
              <Image src="/assets/dito.svg" alt="DITO" layout="fill" />
            </span>
          </div>
        </Box>
        <div className={classes.title}>
          <h1 className="text nowrap">SIM PACKAGES</h1>
        </div>
        <div className={classes.subtitle}>
          <p className="text subtitle">
            Territorial Sub Distributor and Authorized Distributor Sales Personnel
          </p>
        </div>
        <Button
          style={{
            borderRadius: 24,
            padding: '8px 16px',
            // marginLeft: -8,
            margin: '16px auto 0px',
            width: '90%',
          }}
          variant="contained"
          color="primary"
          disableElevation
        >
          <p className="subtitle">ORDER NOW</p>
        </Button>
      </div>

      <div className={classes.imageContainer}>
        <Image src="/assets/dito-splash.svg" layout="fill" objectFit="contain" />
      </div>
    </div>
  )
}

export default Section1
