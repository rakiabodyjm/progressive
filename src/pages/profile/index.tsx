import {
  Box,
  BoxProps,
  Divider,
  Paper,
  Theme,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@material-ui/core'
import { Cancel, Edit, FiberManualRecord, Info, InfoOutlined, MoreVert } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { PopUpMenu } from '@src/components/PopUpMenu'
import ObjectRenderer from '@src/components/ObjectRenderer'
import ObjectFormRenderer from '@src/components/ObjectFormRenderer'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { userDataSelector, getUser as getUserThunk } from '@src/redux/data/userSlice'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import validator from 'validator'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import LoadingScreen from '@src/components/LoadingScreen'

const reduceIntoSorted: (arg: UserResponse) => UserResponse = ({
  id,
  username,
  first_name,
  last_name,
  phone_number,
  email,
  admin,
  subdistributor,
  dsp,
  roles,
  created_at,
  updated_at,
  ...restArgs
}) => ({
  id,
  username,
  first_name,
  last_name,
  phone_number,
  email,
  roles,
  admin,
  subdistributor,
  dsp,
  created_at,
  updated_at,
  ...restArgs,
})

const editableFields = ({
  username,
  last_name,
  first_name,
  email,
  phone_number,
  address1,
  address2,
}: UserResponse) => ({
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

  const [userInfo, setUserInfo] = useState<UserResponse | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  // const [accountInfoMode, setObjectRenderer] = useState<boolean>(true)
  const [editPopUpMenuOpen, setEditPopUpMenuOpen] = useState<boolean>(false)
  const editFormValuesRef = useRef<Partial<UserResponse> | null>(
    userInfo ? editableFields(userInfo) : null
  )
  const [editFormValues, setEditFormValues] = useState<Partial<UserResponse> | null>(
    editFormValuesRef.current
  )

  const editPopUpMenuRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (user?.user_id) {
      getUser(user?.user_id)
        .then((res) => {
          setUserInfo(reduceIntoSorted(res))
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

  // if (user?.user_id !== queries.id) {
  //   return <ErrorLoading message="You might be an Unauthorized User " />
  // }
  return user?.user_id ? (
    <Box>
      <Paper
        style={{
          padding: 16,
          maxWidth: 720,
          margin: 'auto',
        }}
        variant="outlined"
      >
        <Box display="flex" justifyContent="space-between" mb={4}>
          <div>
            <Typography
              style={{
                fontWeight: 700,
                color: theme.palette.primary.main,
              }}
              variant="h3"
            >
              User Account Information
            </Typography>
            <Typography variant="h6">
              {!editMode ? 'Show' : 'Edit'} current user account information
            </Typography>
          </div>

          <div>
            {!editMode ? (
              <>
                <IconButton
                  onClick={() => {
                    setEditPopUpMenuOpen((prevState) => !prevState)
                  }}
                  innerRef={editPopUpMenuRef}
                >
                  <MoreVert />
                </IconButton>
                <PopUpMenu
                  menuItems={[
                    {
                      text: 'Edit',
                      Component: <Edit />,
                      action: () => {
                        setEditMode((prevState) => !prevState)
                        setEditPopUpMenuOpen(false)
                        // setObjectRenderer(false)
                      },
                    },
                    // {
                    //   text: 'Information',
                    //   Component: <InfoOutlined />,
                    //   action: () => {
                    //     setEditMode(false)
                    //   },
                    // },
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
                  <Cancel color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Box>
        {userInfo && !editMode && <ObjectRenderer<UserResponse> fields={userInfo} />}
        {userInfo && editMode && (
          <ObjectFormRenderer
            renderState
            schema={editableFields(userInfo)}
            onChange={(arg) => {
              setEditFormValues(arg)
            }}
            renderKey={(key) => userApi.formatKeyIntoReadables(key)}
          />
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

          <Button
            onClick={() => {
              if (user?.user_id && editFormValues) {
                userApi
                  .updateUser(user.user_id, editFormValues)
                  .then((res) => {
                    dispatch(getUserThunk())
                    dispatch(
                      setNotification({
                        type: NotificationTypes.SUCCESS,
                        message: `User Updated`,
                      })
                    )
                    setEditMode(false)
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
            }}
            variant="contained"
            color="primary"
          >
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
