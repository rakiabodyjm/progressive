import { Typography, TypographyProps } from '@material-ui/core'

export default function FormLabel({
  children,
  ...restProps
}: { children: TypographyProps<'label'>['children'] } & TypographyProps<'label'>) {
  return (
    <Typography
      display="block"
      color="primary"
      component="label"
      variant="body2"
      noWrap
      {...restProps}
    >
      {children}
    </Typography>
  )
}
