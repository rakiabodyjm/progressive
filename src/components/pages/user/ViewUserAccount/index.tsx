import { Box, Divider, Paper, PaperProps, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ObjectRenderer from '@src/components/common/ObjectRenderer'
import { UserResponse } from '@src/utils/api/userApi'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))
export default function ViewUserAccount({ user, ...restProps }: { user: Partial<UserResponse> }) {
  const classes = useStyles()
  return (
    <Paper {...restProps} className={classes.root}>
      <Typography
        style={{
          fontWeight: 600,
        }}
        color="primary"
        variant="h4"
      >
        User Account
      </Typography>
      <Divider
        style={{
          margin: `16px 0`,
          marginBottom: 24,
        }}
      />
      <ObjectRenderer<Partial<UserResponse>> fields={user} />
    </Paper>
  )
}
