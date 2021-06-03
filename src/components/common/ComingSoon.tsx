import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
// import ComingSoonSVG from '@public/components/ComingSoon/ComingSoon.svg'
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    top: 80,
    marginTop: 32,
  },
  imageContainer: {
    position: 'relative',
    height: '32em',
    background: 'url(/components/ComingSoon.svg)',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center center',
  },
  comingSoon: {
    fontWeight: 700,
    textAlign: 'center',
  },
  comingSoonSub: {
    textAlign: 'center',
  },
}))

const ComingSoon = () => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <div className={classes.imageContainer}>
        {/* <Image src="/assets/components/ComingSoon/ComingSoon.svg" layout="fill" /> */}
        {/* <ComingSoon /> */}
      </div>
      <Typography className={classes.comingSoon} variant="h3">
        COMING SOON
      </Typography>
      <Typography className={classes.comingSoonSub} variant="h6">
        This feature is in development, subscribe to our newsletter for updates
      </Typography>
    </div>
  )
}

export default ComingSoon
