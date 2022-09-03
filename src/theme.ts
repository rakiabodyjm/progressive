// import { createTheme, responsiveFontSizes } from '@material-ui/core'
// import { responsiveFontSizes, createTheme } from '@mui/material/styles'

import { createTheme, responsiveFontSizes, Theme, ThemeOptions } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

type CustomThemeProperties = {
  prefersDarkMode: boolean
}

const theme = (additionalProps: CustomThemeProperties): Theme => {
  const { prefersDarkMode } = additionalProps
  const customTheme: ThemeOptions = {
    props: {
      MuiButton: {
        disableElevation: true,
      },
      MuiContainer: {
        style: {
          padding: 0,
          width: '100%',
        },
      },
      MuiPaper: {
        variant: 'outlined',
      },
    },
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#ec5b2b',
      },
      secondary: {
        main: '#0F254C',
      },
      error: {
        main: red.A400,
      },
    },
    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontFamily: ['\'Exo 2\'', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Oxygen'].join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            WebkitFontSmoothing: 'auto',
          },
        },
      },
      MuiButton: {
        root: {
          padding: '4px 24px',
        },
        outlined: {
          padding: '4px 24px',
        },
      },
      MuiIconButton: {
        root: {
          padding: 8,
        },
      },
    },
  }
  return createTheme({
    ...customTheme,
  })
}

const themeCreator = (params: CustomThemeProperties) => responsiveFontSizes(theme(params))

export default themeCreator
