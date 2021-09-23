import { Typography, CircularProgress, useTheme } from '@material-ui/core'
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
}

export default function LoadingScreen({
  thickness,
  color,
  size,
  variant,
  style,
  textColor,
  ...restProps
}: LoadingScreenTypes) {
  const theme = useTheme()
  return (
    <div
      className="realm1000-loading-screen"
      {...restProps}
      style={{
        height:
          process.env.NODE_ENV === 'production' ? 'calc(100vh - 86px)' : 'calc(100vh - 128px)',
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
    </div>
  )
}
LoadingScreen.defaultProps = {
  color: '',
  thickness: 4,
  size: 72,
  variant: 'h3',
}
