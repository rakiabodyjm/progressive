import { Box, Divider, makeStyles, Typography, useTheme } from '@material-ui/core'
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

const ErrorLoading = ({ message }: { message?: string }) => {
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
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
              >
                <ErrorIcon
                  style={{
                    color: theme.palette.primary.main,
                    fontSize: 64,
                  }}
                />
                <Typography
                  style={{
                    fontWeight: 700,
                    display: 'inline',
                    marginLeft: 8,
                  }}
                  variant="h3"
                >
                  {/* Transaction {type.charAt(0).toUpperCase() + type.slice(1)} */}
                  An Error has Occured
                </Typography>
                <Divider
                  variant="fullWidth"
                  style={{
                    margin: theme.spacing(2),
                    width: '100%',
                  }}
                />
                <Typography variant="body1">{message}</Typography>
              </Box>
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
