import { Box, Divider, Paper, PaperProps, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import ObjectRenderer from '@src/components/common/ObjectRenderer'
import { AdminResponseType } from '@src/utils/api/adminApi'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))
export default function ViewAdminAccount({
  admin,
  ...restProps
}: {
  admin: AdminResponseType
} & PaperProps) {
  const classes = useStyles()
  return (
    <Paper className={classes.root} {...restProps} variant="outlined">
      <Typography
        style={{
          fontWeight: 600,
        }}
        color="primary"
        variant="h4"
      >
        Admin Account
      </Typography>
      <Divider
        style={{
          margin: `16px 0`,
          marginBottom: 24,
        }}
      />
      <ObjectRenderer<AdminResponseType> fields={admin} />
    </Paper>
  )
}
