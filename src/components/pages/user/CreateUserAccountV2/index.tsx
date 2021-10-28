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
import { Close } from '@material-ui/icons'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse } from '@src/utils/api/common'
import { createUser, CreateUser, UserResponse } from '@src/utils/api/userApi'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/styles'
import validator from 'validator'

const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
  valid: {
    color: theme.palette.success.main,
  },
  paperPadding: {
    padding: 15,
  },
  buttonMargin: {
    marginTop: 10,
  },
}))

export default function CreateUserAccountV2({ modal }: { modal?: () => void }) {
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

  const [status, setStatus] = useState<boolean>()

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

  const [valid, setValid] = useState<Record<keyof CreateUser, string | null>>({
    first_name: null,
    last_name: null,
    address1: null,
    address2: null,
    email: null,
    phone_number: null,
    username: null,
    password: null,
  })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const handleSubmit = () => {
    const schemaChecker = {
      email: (value: string) => !validator.isEmail(value) && 'Email Address is not valid',
      phone_number: (value: string) => !validator.isMobilePhone(value) && 'Invalid phone number',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = user[key as keyof CreateUser]
      const validateResult = validator(valuesToValidate)
      console.log(validateResult)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })

    if (user.username === '') {
      dispatch(
        setNotification({
          type: NotificationTypes.ERROR,
          message: `Username Required`,
        })
      )
    } else if (user.password === '') {
      dispatch(
        setNotification({
          type: NotificationTypes.ERROR,
          message: `Password Required`,
        })
      )
    } else if (user.password !== user.confirm_password) {
      dispatch(
        setNotification({
          type: NotificationTypes.ERROR,
          message: `Passwords do not match`,
        })
      )
    } else {
      console.log(user)
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
  // THIS IS FOR ERRORS
  // useEffect(() => {
  //   const schemaChecker = {
  //     email: (value: string) => !validator.isEmail(value) && 'Email Address is not valid',
  //     phone_number: (value: string) => !validator.isMobilePhone(value) && 'Invalid phone number',
  //   }
  //   Object.keys(schemaChecker).forEach((key) => {
  //     const validator = schemaChecker[key as keyof typeof schemaChecker]
  //     const valuesToValidate = user[key as keyof CreateUser]
  //     const validateResult = validator(valuesToValidate)
  //     console.log(validateResult)
  //     if (validateResult) {
  //       setErrors((prevState) => ({
  //         ...prevState,
  //         [key]: validateResult,
  //       }))
  //     }
  //   })
  // }, [user])

  // useEffect(() => {
  //   const schemaChecker = {
  //     email: (value: string) => validator.isEmail(value) && 'valid',
  //     phone_number: (value: string) => !validator.isMobilePhone(value) && '',
  //   }
  //   Object.keys(schemaChecker).forEach((key) => {
  //     const validator = schemaChecker[key as keyof typeof schemaChecker]
  //     const valuesToValidate = user[key as keyof CreateUser]
  //     const validateResult = validator(valuesToValidate)
  //     if (validateResult) {
  //       setValid((prevState) => ({
  //         ...prevState,
  //         [key]: validateResult,
  //       }))
  //       setIsSubmitted(true)
  //     }
  //   })
  // }, [user])

  useEffect(() => {
    console.log(errors)
  }, [errors])

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
              Name
            </Typography>

            <TextField
              variant="outlined"
              name="first_name"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.first_name}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Last Name
            </Typography>

            <TextField
              variant="outlined"
              name="last_name"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.last_name}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Current Address
            </Typography>

            <TextField
              variant="outlined"
              name="address1"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.address1}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Home Address
            </Typography>

            <TextField
              variant="outlined"
              name="address2"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.address2}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Email Address
            </Typography>

            <TextField
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
              variant="outlined"
              name="phone_number"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.phone_number}
            />
          </Grid>
          <Grid item xs={4}>
            <Typography className={classes.formLabel} component="label" variant="body2">
              Username
            </Typography>

            <TextField
              variant="outlined"
              name="username"
              fullWidth
              size="small"
              onChange={handleChange}
              value={user.username}
            />
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
        {/* <Box>
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
        </Box> */}
        <Box display="flex" gridGap={8} justifyContent="flex-end" className={classes.buttonMargin}>
          <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
              // console.log(user)

              e.preventDefault()
              handleSubmit()
              setIsSubmitted(true)
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
