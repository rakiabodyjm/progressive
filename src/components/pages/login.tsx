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
} from '@material-ui/core'
import companyLogo from '@public/assets/realm1000-logo.png'
import { loginUserThunk, User } from '@src/redux/data/userSlice'
import type { LoginUserParams } from '@src/utils/api/userApi'
import Image from 'next/image'
import { ChangeEvent, useState, FormEvent, useEffect, ChangeEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { AppDispatch, RootState } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 720,
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
    top: '50%',
    transform: 'translateY(-75%)',
    maxWidth: 512,
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  paper: {
    padding: 16,
    borderRadius: 8,
  },
  inputContainer: {
    '& input': {
      fontSize: 16,
    },
  },
}))

export default function AdminLogin() {
  const classes = useStyles()
  const dispatch = useDispatch<AppDispatch>()

  const router = useRouter()
  const [formValues, setFormValues] = useState<LoginUserParams>({
    email: '',
    password: '',
    remember_me: true,
  })

  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault()
    setButtonLoading(true)
    dispatch(loginUserThunk(formValues))
      .unwrap()
      .then((res) => {
        if (res) {
          dispatch(
            setNotification({
              message: `Welcome ${res.first_name}`,
              type: NotificationTypes.SUCCESS,
            })
          )
        }
      })

      // .then(() => {
      //   router.push('/')
      // })
      .catch((err) => {
        dispatch(
          setNotification({
            message: err.response?.data?.message || err.message,
            type: NotificationTypes.ERROR,
          })
        )
      })
      .finally(() => {
        setButtonLoading(false)
      })
  }
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e?.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // const user: User = useSelector((state: RootState) => state?.user?.data || null)

  // const { push } = router
  // useEffect(() => {
  //   if (user.user_id) {
  //     push('/')
  //     // router.push('/')
  //   }
  // }, [user, push])
  // useEffect(() => {
  //   if (user.user_id) {
  //     router.push('/')
  //   } else {
  //     dispatch(
  //       setNotification({
  //         message: `User must be logged In`,
  //         type: NotificationTypes.ERROR,
  //       })
  //     )
  //   }
  // }, [user, router])
  const theme: Theme = useTheme()
  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div
        style={{
          height: 64,
          background: theme.palette.secondary.main,
          // background: 'var(--secondary-main)',
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
              router.push('/')
            }}
          >
            <Image src={companyLogo} alt="REALM1000 DITO" layout="fill" objectFit="contain" />
          </a>
        </div>
      </div>
      <div className={classes.paperContainer}>
        <Paper className={classes.paper} variant="outlined">
          <Typography variant="h4" style={{ fontWeight: 700 }}>
            Login
          </Typography>
          <Box py={2}>
            <Divider />
          </Box>
          <Box>
            <div className={classes.inputContainer}>
              <Typography variant="body1">Email: </Typography>
              <TextInput
                // autoCapitalize="off"
                // inputProps={{
                //   autoCapitalize: 'off',
                // }}
                autoCorrect="none"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Email or Username"
                name="email"
                onChange={handleChange}
              ></TextInput>
            </div>
            <Box py={0.5}></Box>
            <div className={classes.inputContainer}>
              <Typography variant="body1">Password: </Typography>
              <TextInput
                // inputProps={{
                //   autoCapitalize: 'off',
                // }}
                autoCorrect="none"
                type="password"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              ></TextInput>
            </div>
            <Box pt={2} textAlign="center">
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                className={classes.inputContainer}
              >
                <Typography variant="body1">Remember Me: </Typography>

                <Checkbox
                  name="remember_me"
                  color="primary"
                  checked={formValues.remember_me}
                  onChange={(e, checked) => {
                    setFormValues((prev) => ({
                      ...prev,
                      [e.target.name]: checked,
                    }))
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Box pt={2} />
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              style={{
                justifySelf: 'flex-end',
                padding: `2px 24px`,
                borderRadius: 4,
                color: theme.palette.primary.contrastText,
                overflow: 'hidden',
                // background: theme.palette.primary.main,
              }}
              variant="contained"
              disableElevation
              focusRipple
              disabled={buttonLoading}
              color="primary"
            >
              <Typography variant="h6">Login</Typography>
              <div
                style={{
                  position: 'absolute',
                  display: buttonLoading ? 'flex' : 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.26)',
                }}
              >
                <CircularProgress color="primary" thickness={4} size={24} />
              </div>
            </Button>
          </Box>
        </Paper>
      </div>
    </form>
  )
}

const TextInput = ({ ...restProps }: TextFieldProps) => <TextField {...restProps}></TextField>
