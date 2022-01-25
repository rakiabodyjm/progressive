import {
  Box,
  Button,
  Divider,
  Paper,
  Theme,
  Typography,
  useTheme,
  TextField,
  TextFieldProps,
  CircularProgress,
  Checkbox,
  Grid,
} from '@material-ui/core'
import { Form, Formik, Field, ErrorMessage } from 'formik'
import companyLogo from '@public/assets/realm1000-logo.png'
import { loginUserThunk, getUser } from '@src/redux/data/userSlice'
import { createUser, CreateUser, LoginUserParams } from '@src/utils/api/userApi'
import Image from 'next/image'
import { ChangeEvent, useState, FormEvent, useEffect, ChangeEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { AppDispatch, RootState } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { makeStyles } from '@material-ui/styles'
import { object, string, ref } from 'yup'
import { red } from '@material-ui/core/colors'
import { extractErrorFromResponse } from '@src/utils/api/common'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 800,
    height: '100vh',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      top: 0,
      bottom: 0,
      //   background: 'red',
      zIndex: -1,
    },
  },
  paperContainer: {
    position: 'relative',
    margin: 'auto',
    top: '15%',
    transform: 'translateY(-14%)',
    maxWidth: 500,
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  paper: {
    // padding: 10,
    borderRadius: 8,
  },
  inputContainer: {
    '& input': {
      fontSize: 16,
    },
  },
  formLabel: {
    transform: 'translateY(45%)',
  },

  buttonMargin: {
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    paddingLeft: 5,
    fontSize: 11,
  },
}))
const initialValues: CreateUser & { confirm_password: string } = {
  first_name: '',
  last_name: '',
  address1: '',
  address2: '',
  email: '',
  phone_number: '',
  username: '',
  password: '',
  confirm_password: '',
}

export default function Registration() {
  const classes = useStyles()
  const theme: Theme = useTheme()
  const dispatch = useDispatch()
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
  return (
    <div>
      <div
        style={{
          height: 64,
          background: theme.palette.secondary.main,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <a
            href="/"
            style={{
              position: 'relative',
              height: 56,
              width: 56,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Image src={companyLogo} alt="REALM1000 DITO" layout="fill" objectFit="contain" />
          </a>
        </div>
      </div>
      <div>
        <Paper className={classes.root} variant="outlined">
          <Paper className={classes.paperContainer}>
            <Typography
              variant="h4"
              // color="primary"
              style={{
                fontWeight: 600,
              }}
              // style={{ fontWeight: 600, textAlign: 'center' }}
            >
              Sign Up
            </Typography>
            <Divider style={{ marginTop: 16, marginBottom: 16 }} />

            <Formik
              validationSchema={object({
                first_name: string().required('First Name Required').min(2).max(100),
                last_name: string().required('Last Name Required').min(2).max(100),
                address1: string().required('Address is Required').max(100),
                email: string().email('Invalid email format').required('Email Required'),
                username: string().required('Username Required'),
                phone_number: string()
                  .required('Phone number required')
                  .matches(phoneRegExp, 'Phone Number is not valid'),
                password: string()
                  .required('Please Enter your password')
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                    'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
                  ),
                confirm_password: string().oneOf([ref('password')], 'Passwords does not match'),
              })}
              initialValues={initialValues}
              onSubmit={(values) =>
                new Promise<void>((res) => {
                  setTimeout(() => {
                    createUser(values)
                      .then((res) => {
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
                    res()
                  }, 1000)
                })
              }
            >
              {({ isSubmitting }) => (
                <Form>
                  <Grid spacing={2} container className={classes.paper}>
                    <Grid item xs={3}>
                      <Typography variant="h5" color="primary">
                        Personal
                      </Typography>
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="first_name"
                        as={TextField}
                        label="First Name"
                        fullWidth
                      />
                      <ErrorMessage name="first_name">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="last_name"
                        as={TextField}
                        label="Last Name"
                        fullWidth
                      />
                      <ErrorMessage name="last_name">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="address1"
                        as={TextField}
                        label="Current Address"
                        fullWidth
                      />
                      <ErrorMessage name="address1">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="address2"
                        as={TextField}
                        label="Home Address"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider style={{ marginTop: 30, marginBottom: 16 }} />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography variant="h5" color="primary">
                        Account
                      </Typography>
                    </Grid>
                    <Grid item xs={9}></Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="username"
                        as={TextField}
                        label="User Name"
                        fullWidth
                      />
                      <ErrorMessage name="username">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="phone_number"
                        as={TextField}
                        label="Contact Number"
                        fullWidth
                      />
                      <ErrorMessage name="phone_number">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="password"
                        as={TextField}
                        label="Password"
                        type="password"
                        fullWidth
                      />
                      <ErrorMessage name="password">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="confirm_password"
                        as={TextField}
                        label="Confirm Password"
                        type="password"
                        fullWidth
                      />
                      <ErrorMessage name="confirm_password">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        size="small"
                        variant="outlined"
                        name="email"
                        as={TextField}
                        label="Email Address"
                        fullWidth
                      />
                      <ErrorMessage name="email">
                        {(msg) => (
                          <div style={{ color: 'red', paddingLeft: 5, fontSize: 11 }}>{msg}</div>
                        )}
                      </ErrorMessage>
                    </Grid>
                  </Grid>
                  <Box my={2}>
                    <Divider />
                  </Box>

                  <Box
                    display="flex"
                    gridGap={8}
                    justifyContent="flex-end"
                    className={classes.buttonMargin}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      Register
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </Paper>
        </Paper>
      </div>
    </div>
  )
}
