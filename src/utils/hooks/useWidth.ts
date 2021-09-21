import { useTheme, useMediaQuery } from '@material-ui/core'
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints'
import { useCallback, useMemo } from 'react'

export const useWidth = (): Breakpoint => {
  const theme = useTheme()
  const keys: Breakpoint[] = [...theme.breakpoints.keys].reverse()
  const mediaQueryFn = useMediaQuery
  const matches = useCallback(
    (key) => {
      mediaQueryFn(theme.breakpoints.up(key))
    },
    [mediaQueryFn, theme.breakpoints]
  )
  return keys.reduce((output: Breakpoint, key) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const matches = mediaQueryFn(theme.breakpoints.up(key))
    // const matches = useMediaQuery(theme.breakpoints.up(key))
    return !output && matches ? key : output
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
