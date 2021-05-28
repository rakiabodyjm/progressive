/* eslint-disable camelcase */
import { Box, Divider, Paper, Typography } from '@material-ui/core'
import { ServerStyleSheets, Theme, ThemeProvider } from '@material-ui/core/styles'
import { makeStyles } from '@material-ui/styles'
import theme from '@src/theme'
import ReactDOMServer from 'react-dom/server'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    maxWidth: 600,
    padding: 16,
  },
  primary: {
    color: theme.palette.secondary.main,
  },
  logoContainer: {},

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
      <Paper className={classes.paper} variant="outlined">
        <div className={classes.logoContainer}></div>
        <Box flexDirection="column" display="flex">
          <Typography
            className={classes.primary}
            style={{
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
            variant="h4"
          >
            DITO Site Inquiry {name}
          </Typography>
          <Typography variant="body1">Phone: {contact_number}</Typography>
          <Typography variant="body1">Email: {email}</Typography>
        </Box>
        <Divider
          style={{
            margin: '16px 0px',
          }}
        />
        <Paper variant="outlined">
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
