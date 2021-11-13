import { Theme, Typography, TypographyProps, useTheme } from '@material-ui/core'

export default function RoleBadge({
  children,
  style,
  uppercase,
  ...props
}: { uppercase?: boolean } & TypographyProps) {
  const theme: Theme = useTheme()
  return (
    <Typography
      style={{
        padding: '2px 8px',
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 4,
        display: 'inline',
        ...style,
      }}
      color="primary"
      variant="body2"
      {...props}
    >
      {uppercase ? (children as string)?.toUpperCase() : children}
    </Typography>
  )
}
