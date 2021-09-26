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
import { PopUpMenu } from '@src/components/common/PopUpMenu'
import AccountInfoMode from '@src/components/pages/profile/AccountInformation'
import FormSchemaGenerator from '@src/components/common/FormSchemaGenerator'
import ErrorLoading from '@src/components/screens/ErrorLoadingScreen'
import { userDataSelector } from '@src/redux/data/userSlice'
import userApi, { UserResponse } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import { UserInfo } from 'os'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import validator from 'validator'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'

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
  dsp,
}: UserResponse) => ({
  username,
  last_name,
  first_name,
  email,
  phone_number,
})
export default function UserProfile() {
  const dispatch = useDispatch()
  const user = useSelector(userDataSelector)
  const router = useRouter()
  const queries = router.query
  const theme: Theme = useTheme()

  const [userInfo, setUserInfo] = useState<UserResponse | null>(null)
  const [editMode, setEditMode] = useState<boolean>(false)
  // const [accountInfoMode, setAccountInfoMode] = useState<boolean>(true)
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
      userApi.getUser(user?.user_id).then((res) => {
        setUserInfo(reduceIntoSorted(res))
      })
    }
  }, [user])

  if (user?.user_id !== queries.id) {
    return <ErrorLoading message="You might be an Unauthorized User " />
  }

  return (
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
                        // setAccountInfoMode(false)
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
        {userInfo && !editMode && <AccountInfoMode<UserResponse> fields={userInfo} />}
        {userInfo && editMode && (
          <FormSchemaGenerator
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
                    dispatch(
                      setNotification({
                        type: NotificationTypes.SUCCESS,
                        message: `User Updated`,
                      })
                    )
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
  )
}
