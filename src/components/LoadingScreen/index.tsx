import {
  Typography,
  CircularProgress,
  useTheme,
  Box,
  BoxProps,
  CircularProgressProps,
  TypographyProps,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { Variant } from '@material-ui/core/styles/createTypography'
import { CSSProperties } from 'react'

interface LoadingScreenTypes {
  thickness?: number
  color?: string
  size?: number
  // variant?:
  //   | 'inherit'
  //   | 'h1'
  //   | 'h2'
  //   | 'h3'
  //   | 'h4'
  //   | 'h5'
  //   | 'h6'
  //   | 'subtitle1'
  //   | 'subtitle2'
  //   | 'body1'
  //   | 'body2'
  //   | 'caption'
  //   | 'button'
  //   | 'overline'
  //   | 'srOnly'
  variant?: Variant
  style?: CSSProperties
  textColor?: string
  loadedBy?: string
  hiddenText?: true
}
/**
 * OLD
 * Full Screen Loading Screen
 */
export default function LoadingScreen({
  thickness,
  color,
  size,
  variant,
  style,
  textColor,
  hiddenText,
  ...restProps
}: LoadingScreenTypes & BoxProps) {
  const theme = useTheme()
  return (
    <Box
      className="realm1000-loading-screen"
      {...restProps}
      style={{
        // height:
        //   process.env.NODE_ENV === 'production' ? 'calc(100vh - 86px)' : 'calc(100vh - 128px)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
    >
      <Typography
        style={{
          width: 'max-content',
          fontWeight: 600,
          color: textColor || 'currentColor',
          display: hiddenText && 'none',
        }}
        variant={variant}
      >
        Loading
      </Typography>
      <div
        style={{
          marginTop: 16,
        }}
      >
        <CircularProgress
          style={{
            color: color && color.length > 0 ? color : theme.palette.primary.main,
          }}
          size={size}
          thickness={thickness}
        />
      </div>
    </Box>
  )
}
LoadingScreen.defaultProps = {
  color: '',
  thickness: 4,
  size: 32,
  variant: 'h3',
}

export function LoadingScreen2({
  containerProps,
  progressCircleProps,
  textProps,
}: {
  containerProps?: BoxProps
  progressCircleProps?: CircularProgressProps
  textProps?: TypographyProps
}) {
  const theme = useTheme()

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      style={{
        background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
        padding: 16,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        ...(containerProps?.style && {
          ...containerProps.style,
        }),
      }}
      {...containerProps}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        style={{
          marginBottom: 8,
          ...(textProps?.style && {
            ...textProps.style,
          }),
        }}
        {...textProps}
      >
        {textProps?.children || 'Loading'}
      </Typography>

      <CircularProgress {...progressCircleProps} />
    </Box>
  )
}
