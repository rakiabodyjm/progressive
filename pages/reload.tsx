import { Box, makeStyles, Typography } from '@material-ui/core'
import { useRef, useState } from 'react'
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet'
import ComingSoon from '@components/common/ComingSoon'
const useStyles = makeStyles((theme) => ({
  root: {
    // marginTop: '50%',
    position: 'relative',
    top: 80,
    margin: 'auto',
    maxWidth: 1200,
    marginTop: 48,
  },
  titleContainer: {
    '& .title': {
      fontWeight: 600,
      textTransform: 'uppercase',
    },
    '& .sub-title': {},
    '& .dito': {},
  },
}))

const ReloadPage = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography className="title" variant="h3" component="p">
          Reload
        </Typography>
        <Typography className="sub-title" variant="h6">
          Reloading allows you to reload or top up your{' '}
          <span
            style={{
              display: 'inline-block',
              backgroundImage: 'url(/assets/dito.svg)',
              backgroundSize: 'contain',
              width: '3.6em',
              height: '1em',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
          ></span>{' '}
          SIM with these available payment methods
        </Typography>
      </div>
      {/* <MicOutlined /> */}
    </div>
  )
}

// const DITOSVG = ({ ...props }) => {
//   //   const [DITOSVGState, setDITOSVGState] = useState(<DitoSVG />)
//   //   console.log('DITOSVG', DITOSVGState)
//   const DITOSVGRef = useRef()
//   return <DITOSVG ref={DITOSVGRef} />
// }

export default process.env.NODE_ENV === 'production' ? ComingSoon : ReloadPage
