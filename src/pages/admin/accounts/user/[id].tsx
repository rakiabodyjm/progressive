/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Divider, Link, Paper, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import LoadingScreen from '@src/components/LoadingScreen'
import AestheticObjectRenderer from '@src/components/ObjectRendererV2'
import EditUserAccount from '@src/components/pages/user/EditUserAccount'
import { getUser } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function AdminUserManage() {
  const router = useRouter()
  const { id } = router.query
  const { data: user, error, mutate } = useSWR(`${id}`, (id) => getUser(id))
  const theme: Theme = useTheme()
  const [editMode, setEditMode] = useState<boolean>(false)

  useEffect(() => {
    if (editMode === false) {
      mutate()
    }
  }, [editMode])

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
      <Paper
        style={{
          maxWidth: 720,
          margin: 'auto',
        }}
        variant="outlined"
      >
        <Box p={2}>
          <Box>
            <Typography variant="h4">User Account Information</Typography>
            <Typography variant="body2" color="primary">
              View or Edit Account details and Login info
            </Typography>

            <Typography
              style={{
                marginTop: 16,
              }}
            >
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setEditMode((prevState) => !prevState)
                }}
                variant="body2"
              >
                {!editMode ? 'Edit' : 'Exit Edit'}
              </Link>
            </Typography>

            {/* < variant="body2">Edit</> */}
          </Box>
          <Divider
            style={{
              margin: '16px 0',
            }}
          />

          {user && editMode ? (
            <EditUserAccount
              style={{
                padding: 16,
              }}
              user={user}
            />
          ) : (
            <Paper
              style={{
                padding: 16,
              }}
              variant="outlined"
            >
              <AestheticObjectRenderer spacing={1} fields={user} highlight="key" />
            </Paper>
          )}
        </Box>
      </Paper>
    </>
  )
  // return <div>{JSON.stringify(user, null, 2)}</div>
}
