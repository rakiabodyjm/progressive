// import { createTheme, responsiveFontSizes } from '@material-ui/core'
// import { responsiveFontSizes, createTheme } from '@mui/material/styles'

import { createTheme, responsiveFontSizes } from '@material-ui/core'

type CustomThemeProperties = {
  prefersDarkMode: boolean
}
const theme = (additionalProps: CustomThemeProperties) => {
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
    },
    typography: {
      htmlFontSize: 16,
      fontSize: 14,
      fontFamily: [`'Exo 2'`, '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'Oxygen'].join(','),
    },
  })
}

const themeCreator = (params: CustomThemeProperties) => responsiveFontSizes(theme(params))

export default themeCreator
