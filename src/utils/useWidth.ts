import { useTheme, useMediaQuery } from '@material-ui/core'

export const useWidth = (): 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
  const theme = useTheme()
  const keys = [...theme.breakpoints.keys].reverse()

  return (
    keys.reduce((output, key) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const matches = useMediaQuery(theme.breakpoints.up(key))
      return !output && matches ? key : output
    }, null) || 'xs'
  )
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
