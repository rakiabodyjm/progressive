/* eslint-disable camelcase */
import { Box, Divider, Paper, Typography } from '@material-ui/core'
import { ServerStyleSheets, Theme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import theme from '@src/theme'
import ReactDOMServer from 'react-dom/server'
import Image from 'next/image'
import Head from 'next/head'
// import realmLogo from '@public/assets/realm1000-logo.png'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 600,
    padding: 16,
    margin: 'auto',
  },
  primary: {
    color: theme.palette.secondary.main,
  },
  logoContainer: {
    position: 'relative',
    height: 80,
    width: 70,
    '& img': {},
  },

  paper: {
    padding: 16,
    border: `2px solid ${theme.palette.primary.main}`,
    boxShadow: `0px 0px 4px 4px ${theme.palette.primary.main}`,
    animation: `$hello 2s ${theme.transitions.easing.easeInOut} infinite`,
  },

  '@keyframes hello': {
    '0%': {
      boxShadow: 'none',
    },
    '50%': {
      boxShadow: `0px 0px 4px 4px ${theme.palette.primary.main}`,
    },
    '100%': {
      boxShadow: 'none',
    },
  },
}))
const EmailTemplate = ({ name, contact_number, message, email }) => {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Head>
        <title>REALM1000 | DITO Site Inquiry</title>
        <meta name="description" content={`Email from ${name}`} />
      </Head>
      <Paper className={classes.paper} variant="outlined">
        <div className={classes.logoContainer}>
          <Image
            layout="fill"
            // src="/assets/realm1000-logo.png"
            alt="REALM1000"
            loader={({ src }) => `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/${src}`}
            src="/assets/realm1000-logo.png"
            objectFit="contain"
          />
          {/* <img
            src={`${
              process.env.NODE_ENV === 'production'
                ? process.env.NEXT_PUBLIC_PRODUCTION_URL
                : process.env.NEXT_PUBLIC_DEVELOPMENT_URL
            }/assets/realm1000-logo.png`}
            alt="REALM1000"
            height="40"
            width="40"
          /> */}
        </div>
        <Box flexDirection="column" display="flex">
          <Typography
            className={classes.primary}
            style={{
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
            variant="h4"
          >
            DITO Site Inquiry
          </Typography>
          <Typography variant="h6">
            <span
              style={{
                fontWeight: 600,
              }}
            >
              From:{' '}
            </span>{' '}
            {name}
          </Typography>
          <Typography variant="body1">Phone: {contact_number}</Typography>
          <Typography variant="body1">Email: {email}</Typography>
        </Box>
        <Divider
          style={{
            margin: '16px 0px',
          }}
        />
        <Paper
          style={{
            padding: 16,
          }}
          variant="outlined"
        >
          <Typography variant="body1">{message}</Typography>
        </Paper>
      </Paper>
    </div>
  )
}
export default EmailTemplate

export const generateHTML = ({ name, contact_number, message, email }) => {
  const sheets = new ServerStyleSheets()

  const html = ReactDOMServer.renderToString(
    sheets.collect(
      <ThemeProvider theme={theme}>
        <EmailTemplate
          name={name}
          contact_number={contact_number}
          message={message}
          email={email}
        />
      </ThemeProvider>
    )
  )
  const css = sheets.toString()

  return `${html}<style>
  ${css}
  </style>`
}

// export { html }
