import { Box, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import LoadingScreen from '@src/components/LoadingScreen'
import EditUserAccount from '@src/components/pages/user/EditUserAccount'
import ViewUserAccount from '@src/components/pages/user/ViewUserAccount'
import { getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'

export default function AdminAccountsUserEdit() {
  const router = useRouter()
  const { id } = router.query
  const { data: user, error, mutate } = useSWR(`${id}`, (id) => getUser(id))
  const theme: Theme = useTheme()
  const [editMode, setEditMode] = useState<boolean>(false)
  if (!user) {
    return (
      <LoadingScreen
        style={{
          height: '80vh',
          borderRadius: 4,
        }}
      />
    )
  }

  return (
    <>
      <Paper variant="outlined">
        <Box p={2}>
          <Box>
            <Typography variant="h4">User Account Information</Typography>
            <Typography variant="body2" color="primary">
              View or Edit Account details and Login info
            </Typography>
          </Box>
          <Divider
            style={{
              margin: '16px 0',
            }}
          />
          <Grid container spacing={2}>
            <Grid xs={12} md={6} lg={5} item>
              <EditUserAccount
                style={{
                  padding: 16,
                }}
                user={user}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </>
  )
  // return <div>{JSON.stringify(user, null, 2)}</div>
}
