import { Box, Button, CircularProgress, Theme, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'
import MapIdAutoComplete from '@src/components/MapIdAutoComplete'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import UserAutoComplete from '@src/components/UserAutoComplete'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { MapIdResponseType } from '@src/utils/api/mapIdApi'
import { createSubdistributor, CreateSubdistributor } from '@src/utils/api/subdistributorApi'
import { UserResponse } from '@src/utils/api/userApi'
import useNotification from '@src/utils/hooks/useNotification'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginBottom: 16,
    },
  },
}))

export default function LinkToUserAccount() {
  const theme: Theme = useTheme()
  const classes = useStyles()
  const [accountToLink, setAccountToLink] = useState<UserResponse | undefined>()
  const [subdistributorFields, setSubdistributorFields] = useState<
    Omit<CreateSubdistributor, 'user' | 'area_id'>
  >({
    e_bind_number: '',
    // area_id: '',
    id_number: '',
    id_type: '',
    zip_code: '',
  })
  const dispatchNotification = useNotification()
  // const dispatch = useDispatch()
  // const dispatchNotification = (payload: { message: string; type: NotificationTypes }) => {
  //   dispatch(setNotification(payload))
  // }
  const [loading, setLoading] = useState<boolean>(false)
  const [areaId, setAreaId] = useState<MapIdResponseType | undefined>()
  const handleSubmit = () => {
    setLoading(true)
    if (accountToLink && areaId) {
      createSubdistributor({
        ...subdistributorFields,
        user: accountToLink.id,
        area_id: areaId.area_id,
      })
        .then((res) => {
          dispatchNotification({
            message: `Subdistributor Account ${res.name} created`,
            type: NotificationTypes.SUCCESS,
          })
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((ea) => {
            dispatchNotification({
              message: ea,
              type: NotificationTypes.ERROR,
            })
          })
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      if (!areaId) {
        dispatchNotification({
          message: `Area Id is required`,
          type: NotificationTypes.ERROR,
        })
      } else {
        dispatchNotification({
          message: `You must link a User Account first`,
          type: NotificationTypes.ERROR,
        })
      }
      setLoading(false)
    }
  }

  return (
    <Box className={classes.root} p={2}>
      <Box>
        <Typography
          component="label"
          style={{
            marginBottom: 16,
          }}
          variant="body1"
          color="primary"
        >
          Select User Account to Link
        </Typography>
        <UserAutoComplete
          onChange={(arg) => {
            setAccountToLink(arg)
          }}
          mutateOptions={(users) => users.filter((ea) => !ea.subdistributor)}
        />
      </Box>
      <Box>
        <Typography
          component="label"
          style={{
            marginBottom: 16,
          }}
          variant="subtitle1"
          color="primary"
        >
          Map ID of Subdistributor Account
        </Typography>
        {/* <UserAutoComplete
          onChange={(arg) => {
            setAccountToLink(arg)
          }}
          mutateOptions={(users) => users.filter((ea) => !ea.subdistributor)}
        /> */}
        <MapIdAutoComplete
          onChange={(arg) => {
            setAreaId(arg)
          }}
        />
      </Box>

      <AestheticObjectFormRenderer
        highlight="key"
        fields={subdistributorFields}
        onChange={(e) => {
          setSubdistributorFields((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
          }))
        }}
      />
      <Box mt={2} textAlign="center">
        <Button
          disabled={!accountToLink || loading}
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          style={{
            overflow: 'hidden',
          }}
        >
          Confirm
          {loading && (
            <Box
              style={{
                background: theme.palette.primary.main,
                position: 'absolute',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress color="inherit" style={{}} size={20} />
            </Box>
          )}
        </Button>
      </Box>
    </Box>
  )
}
