import { Theme, Tooltip, Typography, TypographyProps, useTheme } from '@material-ui/core'

export default function RoleBadge({
  children,
  style,
  uppercase,
  disablePopUp,
  ...props
}: { uppercase?: boolean; disablePopUp?: true } & TypographyProps) {
  const theme: Theme = useTheme()
  return (
    <Tooltip
      title={
        <Typography variant="caption">
          Viewing as {uppercase ? (children as string)?.toUpperCase() : children}
        </Typography>
      }
      arrow
      placement="right"
      style={{
        cursor: 'pointer',
      }}
      {...(disablePopUp && {
        open: false,
      })}
    >
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
    </Tooltip>
  )
}
