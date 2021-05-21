import { createMuiTheme, responsiveFontSizes } from '@material-ui/core'
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ed8332',
      dark: '#ec5b2b',
      light: '#f3b169',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0F254C',
      dark: '#000024',
      light: '#3e4d78',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Montserrat, Raleway, Roboto, Helvetica, Arial, sans-serif',
    // fontSize: 14,

    body1: {
      fontWeight: 500,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: {
          textDecoration: 'none',
          WebkitFontSmoothing: 'auto',
          fontFamily: 'Montserrat, Raleway, Roboto, Helvetica, Arial, sans-serif',
          fontSize: 14,
          fontWeight: '600',
        },
      },
    },

    MuiButton: {
      root: {
        borderRadius: 8,
        borderWidth: '2px',
      },
      label: {
        letterSpacing: '-0.04em',
      },
      textSizeLarge: {
        padding: '8px 22px',
      },
    },

    MuiInputBase: {
      input: {
        // height: '0.7em',
        fontWeight: 600,
      },
    },
    MuiFilledInput: {
      inputMarginDense: {
        paddingTop: '14px',
      },
    },

    MuiTypography: {
      root: {
        letterSpacing: '-0.06em',
      },
      h1: {
        lineHeight: 1,
      },
    },

    MuiPaper: {
      rounded: {
        borderRadius: 8,
      },
    },

    MuiDrawer: {
      paper: {
        borderRadius: `0 0 8px 8px`,
      },
    },
    MuiSelect: {
      root: {
        padding: `8px`,
      },
    },
  },
})

export default responsiveFontSizes(theme)
