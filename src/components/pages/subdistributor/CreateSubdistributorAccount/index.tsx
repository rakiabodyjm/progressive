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
import {
  createSubdistributor,
  CreateSubdistributor,
  ValidateFields,
} from '@src/utils/api/subdistributorApi'
import { UserResponse } from '@src/utils/api/userApi'
import useNotification from '@src/utils/hooks/useNotification'
import { useState } from 'react'
import validator from 'validator'
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
    name: '',
  })
  const dispatchNotification = useNotification()

  const [loading, setLoading] = useState<boolean>(false)
  const [areaId, setAreaId] = useState<MapIdResponseType | undefined>()

  const [errors, setErrors] = useState<Record<keyof ValidateFields, string | null>>({
    e_bind_number: null,
    // area_id: '',
    id_number: null,
    id_type: null,
    zip_code: null,
    name: null,
  })
  const handleSubmit = () => {
    const schemaChecker = {
      e_bind_number: (value: string) => validator.isEmpty(value) && 'E Bind Number Required*',
      id_number: (value: string) => validator.isEmpty(value) && 'Id Number Required*',
      zip_code: (value: string) => validator.isEmpty(value) && 'Zip Code Required*',
      id_type: (value: string) => validator.isEmpty(value) && 'Id Type Required*',
      name: (value: string) => validator.isEmpty(value) && 'Must be 3-5 characters required*',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate =
        subdistributorFields[key as keyof Omit<CreateSubdistributor, 'user' | 'area_id'>]
      const validateResult = validator(valuesToValidate)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })

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
          // eslint-disable-next-line no-unused-expressions
          Array.isArray(err)
            ? err.forEach((ea: string) => {
                dispatchNotification({
                  message: ea,
                  type: NotificationTypes.ERROR,
                })
              })
            : dispatchNotification({
                message: err.message,
                type: NotificationTypes.ERROR,
              })
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      if (!areaId) {
        dispatchNotification({
          message: `Map Id is required`,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdistributorFields((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
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
        <Grid spacing={2} container>
          <Grid item xs={6}>
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
          <Grid item xs={6}>
            <Typography
              className={classes.formLabel}
              component="label"
              style={{
                marginBottom: 16,
              }}
              variant="body2"
            >
              Map ID
            </Typography>
            <MapIdAutoComplete
              onChange={(arg) => {
                setAreaId(arg)
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Subdistributor Name
            </Typography>
            <TextField
              placeholder="eg. Juan Dela Cruz"
              variant="outlined"
              name="name"
              fullWidth
              size="small"
              onChange={handleChange}
              value={subdistributorFields.name}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className={classes.errorLabel}
                variant="caption"
                style={{
                  display: subdistributorFields.name.length < 3 ? undefined : 'none',
                }}
              >
                {errors.name}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              E Bind Number
            </Typography>
            <TextField
              placeholder="eg. 555-5555-5555"
              variant="outlined"
              name="e_bind_number"
              fullWidth
              size="small"
              onChange={handleChange}
              value={subdistributorFields.e_bind_number}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className={classes.errorLabel}
                variant="caption"
                style={{
                  display: validator.isEmpty(subdistributorFields.e_bind_number)
                    ? undefined
                    : 'none',
                }}
              >
                {errors.e_bind_number}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              ID Type
            </Typography>
            <TextField
              placeholder="eg. DRIVERS LICENSE"
              variant="outlined"
              name="id_type"
              fullWidth
              size="small"
              onChange={handleChange}
              value={subdistributorFields.id_type}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className={classes.errorLabel}
                variant="caption"
                style={{
                  display: validator.isEmpty(subdistributorFields.id_type) ? undefined : 'none',
                }}
              >
                {errors.id_type}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={5}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              ID Number
            </Typography>
            <TextField
              placeholder="eg. 5555-5555-5555"
              variant="outlined"
              name="id_number"
              fullWidth
              size="small"
              onChange={handleChange}
              value={subdistributorFields.id_number}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className={classes.errorLabel}
                variant="caption"
                style={{
                  display: validator.isEmpty(subdistributorFields.id_number) ? undefined : 'none',
                }}
              >
                {errors.id_number}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Zip Code
            </Typography>
            <TextField
              placeholder="eg. 2211"
              variant="outlined"
              name="zip_code"
              fullWidth
              size="small"
              onChange={handleChange}
              value={subdistributorFields.zip_code}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                className={classes.errorLabel}
                variant="caption"
                style={{
                  display: validator.isEmpty(subdistributorFields.zip_code) ? undefined : 'none',
                }}
              >
                {errors.zip_code}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Box
          display="grid"
          style={{
            gap: 16,
          }}
        ></Box>

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
