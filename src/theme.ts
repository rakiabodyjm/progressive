// import { createTheme, responsiveFontSizes } from '@material-ui/core'
// import { responsiveFontSizes, createTheme } from '@mui/material/styles'

import { createTheme, responsiveFontSizes, Theme } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

type CustomThemeProperties = {
  prefersDarkMode: boolean
}

const theme = (additionalProps: CustomThemeProperties): Theme => {
  const { prefersDarkMode } = additionalProps
  return createTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: '#ec5b2b',
      },
      secondary: {
        main: '#0F254C',
      },
      error: {
        main: red.A700,
      },
    },
    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontFamily: [`'Exo 2'`, '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Oxygen'].join(','),
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          html: {
            WebkitFontSmoothing: 'auto',
          },
        },
      },
    },
  })
}

const themeCreator = (params: CustomThemeProperties) => responsiveFontSizes(theme(params))

export default themeCreator
