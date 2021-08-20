import { Box, makeStyles, Typography, useTheme } from '@material-ui/core'
import Head from 'next/head'
import ErrorIcon from '@material-ui/icons/Error'
const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: 'calc(90vh - 86px)',
  },
  container: {
    margin: 'auto',
    width: '100%',
    maxWidth: 640,
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',

    // height: 720,
  },
  paper: {
    height: '100%',
  },
  header: {
    padding: 16,
    margin: 'auto',
    width: 'max-content',
  },
  content: {
    padding: 16,
  },
}))

const ErrorLoading = () => {
  const classes = useStyles()
  const theme = useTheme()
  return (
    <>
      <Head>
        <meta name="description" content="REALM1000 | Error Has Occured" />
      </Head>
      <div className={classes.root}>
        <Box className={classes.container}>
          <div className={classes.paper}>
            <Box className={classes.header}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon
                  style={{
                    color: theme.palette.secondary.main,
                  }}
                  fontSize="large"
                />
                <Typography
                  style={{
                    fontWeight: 700,
                    color: theme.palette.secondary.main,
                    display: 'inline',
                    marginLeft: 8,
                  }}
                  variant="h3"
                >
                  {/* Transaction {type.charAt(0).toUpperCase() + type.slice(1)} */}
                  An Error has Occured
                </Typography>
              </div>
            </Box>
            {/* <Divider variant="middle" /> */}
            {/* <Box className={classes.content}></Box> */}
          </div>
        </Box>
      </div>
    </>
  )
}

export default ErrorLoading
