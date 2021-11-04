import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  Typography,
  Grid,
  Theme,
  TextField,
} from '@material-ui/core'
import { Close, Create } from '@material-ui/icons'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse } from '@src/utils/api/common'
import { createUser, CreateUser, UserResponse, CheckUsername } from '@src/utils/api/userApi'
import React, { useState, useEffect, StrictMode } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import validator from 'validator'
import useSWR from 'swr'
import axios from 'axios'

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
  const classes = useStyles()
  const dispatch = useDispatch()
  const [errors, setErrors] = useState<Record<keyof CreateUser, string | null>>({
    first_name: null,
    last_name: null,
    address1: null,
    address2: null,
    email: null,
    phone_number: null,
    username: null,
    password: null,
  })
  const { data } = useSWR<CheckUsername | undefined>('/user/', (url: string) =>
    axios(url).then((r) => r.data)
  )

  const handleSubmit = () => {
    const schemaChecker = {
      email: (value: string) => !validator.isEmail(value) && '*Email Address is not valid',
      phone_number: (value: string) => validator.isEmpty(value) && '*Phone number Required',
      first_name: (value: string) => validator.isEmpty(value) && '*First Name Required',
      last_name: (value: string) => validator.isEmpty(value) && '*Last Name Required',
      address1: (value: string) => validator.isEmpty(value) && '*Current Address Required',
      username: (value: string) => validator.isEmpty(value) && '*Username Required',
      password: (value: string) =>
        !validator.isLength(value, { min: 8, max: 16 }) &&
        '*Password must be (8-16 characters only)',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = user[key as keyof CreateUser]
      const validateResult = validator(valuesToValidate)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })

    if (validator.isEmpty(user.password)) {
      // dispatch(
      //   setNotification({
      //     type: NotificationTypes.ERROR,
      //     message: `Password Required`,
      //   })
      // )
    } else if (user.password !== user.confirm_password) {
      dispatch(
        setNotification({
          type: NotificationTypes.ERROR,
          message: `Passwords do not match`,
        })
      )
    } else {
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
            setUser({
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
            setErrors({
              first_name: '',
              last_name: '',
              address1: '',
              address2: '',
              email: '',
              phone_number: '',
              username: '',
              password: '',
            })
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
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  useEffect(() => {}, [errors])

  return (
    <Paper variant="outlined" className={classes.paperPadding}>
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

        <Grid spacing={1} container>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              First Name
            </Typography>

            <TextField
              placeholder="Juan"
              variant="outlined"
              name="first_name"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.first_name}
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
                  display: validator.isEmpty(user.first_name) ? undefined : 'none',
                }}
              >
                {errors.first_name}
              </Typography>
            </div>
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Last Name
            </Typography>

            <TextField
              placeholder="Dela Cruz"
              variant="outlined"
              name="last_name"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.last_name}
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
                  display: validator.isEmpty(user.last_name) ? undefined : 'none',
                }}
              >
                {errors.last_name}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Current Address
            </Typography>

            <TextField
              placeholder="Home # / Street / Municipality / City / Province"
              variant="outlined"
              name="address1"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.address1}
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
                  display: validator.isEmpty(user.address1) ? undefined : 'none',
                }}
              >
                {errors.address1}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Home Address
            </Typography>

            <TextField
              placeholder="Home # / Street / Municipality / City / Province"
              variant="outlined"
              name="address2"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.address2}
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
                  display: validator.isEmpty(user.address2) ? undefined : 'none',
                }}
              >
                {errors.address2}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Email Address
            </Typography>

            <TextField
              placeholder="juandelacruz@example.com"
              variant="outlined"
              name="email"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.email}
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
                  display: validator.isEmail(user.email) ? 'none' : undefined,
                }}
              >
                {errors.email}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Contact Number
            </Typography>

            <TextField
              placeholder="e.g 09491272606"
              variant="outlined"
              name="phone_number"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.phone_number}
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
                  display: validator.isEmpty(user.phone_number) ? undefined : 'none',
                }}
              >
                {errors.phone_number}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Username
            </Typography>

            <TextField
              placeholder="e.g juandelacruz123"
              variant="outlined"
              name="username"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.username}
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
                  display: validator.isEmpty(user.username) ? undefined : 'none',
                }}
              >
                {errors.username}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Password
            </Typography>

            <TextField
              type="password"
              variant="outlined"
              name="password"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.password}
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
                  display: validator.isLength(user.password, { min: 8, max: 16 })
                    ? 'none'
                    : undefined,
                }}
              >
                {errors.password}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Confirm Password
            </Typography>

            <TextField
              type="password"
              variant="outlined"
              name="confirm_password"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.confirm_password}
            />
          </Grid>
        </Grid>
        <Box display="flex" gridGap={8} justifyContent="flex-end" className={classes.buttonMargin}>
          <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
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
