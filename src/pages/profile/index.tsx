import {
  Box,
  Divider,
  Paper,
  Theme,
  Typography,
  Button,
  IconButton,
  Tooltip,
  Grid,
  TextField,
} from '@material-ui/core'
import { Cancel, Edit, MoreVert } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { PopUpMenu } from '@src/components/PopUpMenu'
import { userDataSelector, getUser as getUserThunk } from '@src/redux/data/userSlice'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import LoadingScreen from '@src/components/LoadingScreen'
const editableFields = ({
  id,
  username,
  last_name,
  first_name,
  email,
  phone_number,
  address1,
  address2,
}: Partial<UserResponse>) => ({
  id,
  username,
  last_name,
  first_name,
  email,
  phone_number,
  address1,
  address2: address2 || '',
})
export default function UserProfile() {
  const dispatch = useDispatch()
  const user = useSelector(userDataSelector)
  const theme: Theme = useTheme()
  const [userInfo, setUserInfo] = useState<Partial<UserResponse> | null>(null)
  const previousInputValue = useRef<Partial<UserResponse> | null>(
    userInfo ? editableFields(userInfo) : null
  )
  const [editFormValues, setEditFormValues] = useState<Partial<UserResponse> | null>(
    previousInputValue.current
  )
  const [editMode, setEditMode] = useState<boolean>(false)
  const [editPopUpMenuOpen, setEditPopUpMenuOpen] = useState<boolean>(false)
  const editPopUpMenuRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (user?.user_id) {
      getUser(user?.user_id)
        .then((res) => {
          setUserInfo(editableFields(res))
        })
        .catch((err) => {
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: userApi.extractError(err),
            })
          )
        })
    }
  }, [user])

  const userID = String(userInfo?.id)
  const handleSubmit = () => {
    userApi
      .updateUser(userID, editFormValues)
      .then((res) => {
        dispatch(getUserThunk())
        dispatch(
          setNotification({
            type: NotificationTypes.SUCCESS,
            message: `User Updated`,
          })
        )
        setEditMode(false)
        setEditFormValues(null)
      })
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: userApi.extractError(err),
          })
        )
      })
  }
  return user?.user_id ? (
    <Box>
      <Paper
        style={{
          padding: 16,
          maxWidth: 700,
          margin: 'auto',
        }}
        variant="outlined"
      >
        <Box display="flex" justifyContent="space-between" mb={4}>
          <div>
            <Typography variant="h4">User Account Information</Typography>
            <Typography variant="body2" color="primary">
              {!editMode ? 'Show' : 'Edit'} current user account information
            </Typography>
          </div>

          <div>
            {!editMode ? (
              <>
                <Tooltip
                  arrow
                  placement="left"
                  title={<Typography variant="body1">Edit Account</Typography>}
                >
                  <IconButton
                    onClick={() => {
                      setEditPopUpMenuOpen((prevState) => !prevState)
                    }}
                    innerRef={editPopUpMenuRef}
                  >
                    <MoreVert />
                  </IconButton>
                </Tooltip>
                <PopUpMenu
                  menuItems={[
                    {
                      text: 'Edit',
                      Component: <Edit />,
                      action: () => {
                        setEditMode((prevState) => !prevState)
                        setEditPopUpMenuOpen(false)
                      },
                    },
                  ]}
                  open={editPopUpMenuOpen}
                  anchorEl={editPopUpMenuRef.current}
                  onClose={() => {
                    setEditPopUpMenuOpen((prevState) => !prevState)
                  }}
                  autoFocus
                  transformOrigin={{
                    horizontal: 180,
                    vertical: 'top',
                  }}
                />
              </>
            ) : (
              <Tooltip
                arrow
                placement="left"
                title={<Typography variant="body1">Cancel Edit</Typography>}
              >
                <IconButton
                  onClick={() => {
                    setEditMode(false)
                  }}
                >
                  <Cancel />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Box>
        <Box my={1}>
          <Divider />
        </Box>
        {userInfo && !editMode && (
          <Grid spacing={1} container>
            <Grid item xs={12}>
              <Typography variant="h6">Account Profile</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                User ID:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.id}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                First Name:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.first_name}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                Last Name:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.last_name}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                Username:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.username}</Typography>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 10 }}>
              <Divider />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 10 }}>
              <Typography variant="h6">Contact Information</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                Phone Number:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.phone_number}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                Email Address:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.email}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                Address:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.address1}</Typography>
            </Grid>
          </Grid>
        )}
        {userInfo && editMode && (
          <Grid spacing={1} container>
            <Grid item xs={12}>
              <Typography variant="h6">Account Profile</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography color="primary" variant="body2">
                User ID:
              </Typography>
            </Grid>
            <Grid item xs={9}>
              <Typography variant="body1">{userInfo.id}</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  First Name:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.first_name}
                  name="first_name"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  Last Name:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.last_name}
                  name="last_name"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  Username:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.username}
                  name="username"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 10 }}>
              <Divider />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: 10 }}>
              <Typography variant="h6">Contact Information</Typography>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  Phone Number:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.phone_number}
                  name="phone_number"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  Email Address:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.email}
                  name="email"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Grid item xs={3}>
                <Typography color="primary" variant="body2">
                  Address:
                </Typography>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={userInfo.address1}
                  name="address1"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setEditFormValues((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                    setUserInfo((prevState) => ({
                      ...prevState,
                      [e.target.name]: e.target.value,
                    }))
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        )}

        <Box display={editMode ? 'flex' : 'none'} justifyContent="flex-end" mt={2}>
          <Box display="inline" mr={1}>
            <Button
              onClick={() => {
                setEditMode(false)
              }}
              variant="contained"
              color="default"
            >
              Cancel
            </Button>
          </Box>

          <Button onClick={handleSubmit} variant="contained" color="primary">
            SAVE
          </Button>
        </Box>
      </Paper>
    </Box>
  ) : (
    <div>
      <LoadingScreen />
    </div>
  )
}
