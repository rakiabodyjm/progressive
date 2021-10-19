import { Box, Button, Divider, IconButton, Paper, Typography } from '@material-ui/core'
import { Close } from '@material-ui/icons'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse } from '@src/utils/api/common'
import { createUser, CreateUser, UserResponse } from '@src/utils/api/userApi'
import { useState } from 'react'
import { useDispatch } from 'react-redux'

export default function CreateUserAccount({ modal }: { modal?: () => void }) {
  const [user, setUser] = useState<
    CreateUser & {
      confirm_password: string
    }
  >({
    first_name: '',
    last_name: '',
    address1: '',
    address2: '',
    email: '',
    phone_number: '',
    username: '',
    password: '',
    confirm_password: '',
  })

  const dispatch = useDispatch()
  const handleSubmit = () => {
    if (user.password !== user.confirm_password) {
      dispatch(
        setNotification({
          type: NotificationTypes.ERROR,
          message: `Passwords do not match`,
        })
      )
    }
    createUser(user)
      .then((res) => {
        // const { message, user, error } = res
        if ('user' in res) {
          const { user, message } = res
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message,
            })
          )
        }
      })
      .catch((err) => {
        if (Array.isArray(err)) {
          err.forEach((ea) => {
            dispatch(
              setNotification({
                type: NotificationTypes.ERROR,
                message: ea,
              })
            )
          })
        } else {
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: extractErrorFromResponse(err),
            })
          )
        }
      })
  }
  return (
    <Paper variant="outlined">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        p={2}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Add User Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create a new user account
            </Typography>
          </Box>
          <Box>
            {modal && (
              <IconButton
                onClick={() => {
                  modal()
                }}
                style={{
                  padding: 4,
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <Box>
          <AestheticObjectFormRenderer
            fields={user}
            spacing={1}
            highlight="key"
            onChange={(e) => {
              setUser((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }))
            }}
            customProps={{
              password: {
                textFieldProps: {
                  type: 'password',
                },
              },
              confirm_password: {
                textFieldProps: {
                  type: 'password',
                },
              },
            }}
          />
        </Box>
        <Box display="flex" gridGap={8} justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
              // console.log(user)

              e.preventDefault()
              handleSubmit()
            }}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
