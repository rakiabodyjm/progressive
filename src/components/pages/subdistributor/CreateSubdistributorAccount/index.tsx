import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  useTheme,
  Button,
  CircularProgress,
  Theme,
  Grid,
  TextField,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import MapIdAutoComplete from '@src/components/MapIdAutoComplete'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import UserAutoComplete from '@src/components/UserAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { MapIdResponseType } from '@src/utils/api/mapIdApi'
import { createSubdistributor, CreateSubdistributor } from '@src/utils/api/subdistributorApi'
import { UserResponse } from '@src/utils/api/userApi'
import useNotification from '@src/utils/hooks/useNotification'
import { useState } from 'react'
const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
  paperPadding: {
    padding: 2,
  },
  buttonMargin: {
    marginTop: 10,
  },
}))

type Methods = 'link' | 'create'
export default function CreateSubdistributorAccount({ modal }: { modal?: () => void }) {
  const theme: Theme = useTheme()
  const classes = useStyles()
  const [method, setMethod] = useState<Methods>('link')
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
    <Paper variant="outlined">
      <Box
        onSubmit={(e) => {
          e.preventDefault()
        }}
        component="form"
        p={2}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" color="primary">
              Create New Subdistributor Account
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {/* Create a new Subdistributor Account by <b>Linking</b> or by <b>Creating</b> */}
              Complete the form to add a new Subdistributor Account
            </Typography>
          </Box>

          <IconButton
            style={{
              padding: 8,
            }}
            onClick={modal}
          >
            <Close />
          </IconButton>
        </Box>
        <Divider
          style={{
            margin: `16px 0px`,
          }}
        />
        <Grid spacing={1} container>
          <Grid item xs={7}>
            <Typography
              className={classes.formLabel}
              component="label"
              style={{
                marginBottom: 16,
              }}
              variant="subtitle2"
            >
              Select User Account to Link
            </Typography>
            <UserAutoComplete
              onChange={(arg) => {
                setAccountToLink(arg)
              }}
              mutateOptions={(users) => users.filter((ea) => !ea.subdistributor)}
            />
          </Grid>
          <Grid item xs={5}>
            <Typography
              className={classes.formLabel}
              component="label"
              style={{
                marginBottom: 16,
              }}
              variant="body2"
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
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Id Type
            </Typography>
            <TextField
              placeholder=""
              variant="outlined"
              name="e_bind_number"
              fullWidth
              size="small"
              // onChange={handleChange}
              // value={user.first_name}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Id Number
            </Typography>
            <TextField
              placeholder=""
              variant="outlined"
              name="e_bind_number"
              fullWidth
              size="small"
              // onChange={handleChange}
              // value={user.first_name}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              E Bind Number
            </Typography>
            <TextField
              placeholder=""
              variant="outlined"
              name="e_bind_number"
              fullWidth
              size="small"
              // onChange={handleChange}
              // value={user.first_name}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Zip Code
            </Typography>
            <TextField
              placeholder=""
              variant="outlined"
              name="e_bind_number"
              fullWidth
              size="small"
              // onChange={handleChange}
              // value={user.first_name}
            />
          </Grid>
        </Grid>

        <Box
          display="grid"
          style={{
            gap: 16,
          }}
        >
          {/* <AestheticObjectFormRenderer
            highlight="key"
            fields={subdistributorFields}
            onChange={(e) => {
              setSubdistributorFields((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }))
            }}
          /> */}
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end">
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
    </Paper>
  )
}
