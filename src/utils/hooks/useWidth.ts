import { useTheme, useMediaQuery } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'

export const useWidth = (): Breakpoint => {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys]

  return keys.reduce((output: Breakpoint, key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const match = useMediaQuery(theme.breakpoints.up(key))
    if (match) {
      return key
    }
    return output
  }, 'xs')
}

interface IsMobileTypes {
  tabletIncluded?: boolean
  tabletOnly?: boolean
}

export const useIsMobile = (params?: IsMobileTypes): boolean => {
  const tabletIncluded = params?.tabletIncluded || false
  const smallScreenSizes = tabletIncluded && tabletIncluded === true ? ['xs', 'sm'] : ['xs']
  const width = useWidth()

  if (params?.tabletOnly) {
    return ['sm'].includes(width)
  }
  return smallScreenSizes.includes(width)
}

export default useWidth
