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
} from '@material-ui/core'
import companyLogo from '@public/assets/realm1000-logo.png'
import { loginUserThunk, User } from '@src/redux/data/userSlice'
import type { LoginUserParams } from '@src/utils/api/userApi'
import userApi from '@src/utils/api/userApi'
import Image from 'next/image'
import { ChangeEvent, useState, FormEvent, useEffect, ChangeEventHandler } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Link from 'next/link'
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

  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault()
    dispatch(loginUserThunk(formValues))
      .unwrap()
      .then((res) => {
        dispatch(
          setNotification({
            message: `Welcome ${res.first_name}`,
            type: NotificationTypes.SUCCESS,
          })
        )
      })
      .then(() => {
        router.push('/')
      })
      .catch((err) => {
        dispatch(
          setNotification({
            message: err.response?.data?.message || err.message,
            type: NotificationTypes.ERROR,
          })
        )
      })
  }
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e?.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const user: User = useSelector((state: RootState) => state?.user?.data || null)

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
          <Typography variant="h3">Login</Typography>
          <Box py={2}>
            <Divider />
          </Box>
          <Box>
            <div className={classes.inputContainer}>
              <Typography variant="body1">Email: </Typography>
              <TextInput
                autoCapitalize="off"
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
                autoCapitalize="off"
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
          </Box>
          {/* <Box py={3}>
          <Divider />
        </Box> */}
          <Box pt={3} />
          <Box display="flex" justifyContent="center">
            <Button
              type="submit"
              style={{
                justifySelf: 'flex-end',
                padding: `2px 24px`,
                borderRadius: 4,
                color: theme.palette.primary.contrastText,
                background: theme.palette.primary.main,
              }}
              variant="contained"
              disableElevation
              focusRipple
              onClick={() => {}}
            >
              <Typography variant="h6" component="p">
                Login
              </Typography>
            </Button>
          </Box>
        </Paper>
      </div>
    </form>
  )
}

const TextInput = ({ ...restProps }: TextFieldProps) => <TextField {...restProps}></TextField>
