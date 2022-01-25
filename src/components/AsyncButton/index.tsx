import { Button, ButtonProps, CircularProgress, useTheme } from '@material-ui/core'

const AsyncButton = ({ loading, disabled, ...restProps }: { loading?: boolean } & ButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      color="primary"
      variant="contained"
      {...(loading && {
        endIcon: (
          <CircularProgress
            style={{
              height: 16,
              width: 16,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            }}
            thickness={5}
          />
        ),
      })}
      disabled={loading || disabled}
      {...restProps}
    >
      {restProps.children}
    </Button>
  )
}

export default AsyncButton
