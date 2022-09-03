import { Box, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import AestheticObjectRenderer from '@src/components/ObjectRendererV2'
import { UserResponse } from '@src/utils/api/userApi'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))
export default function ViewUserAccount({ user, ...restProps }: { user: UserResponse }) {
  const classes = useStyles()

  return (
    <Paper {...restProps} className={classes.root}>
      <Typography
        style={{
          fontWeight: 600,
        }}
        // color="primary"
        variant="h4"
      >
        User Account Information
      </Typography>
      <Typography color="primary" variant="body1">
        View or Edit User Account information
      </Typography>
      <Divider
        style={{
          margin: '16px 0',
          marginBottom: 24,
        }}
      />
      <Grid spacing={2} container>
        <Grid item xs={12} md={6}>
          {/* <UserAccountSummaryCard account={user} /> */}
          <Paper variant="outlined">
            <Box p={2}>
              <AestheticObjectRenderer
                // renderObject
                highlight="key"
                spacing={1}
                fields={formatUsers(user)}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  )
}

/**
 * Just in case we need to format displaying UserResponse
 * @param param
 */
const formatUsers = (param: UserResponse) => ({
  ...param,
})
