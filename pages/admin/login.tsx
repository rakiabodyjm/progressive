import { Box, Button, Divider, Paper, TextField, Theme, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import companyLogo from '@public/assets/realm1000-logo.png'
import { loginUserThunk } from '@src/redux/data/userSlice'
import type { LoginUserParams } from '@src/utils/api/userApi'
import userApi from '@src/utils/api/userApi'
import Image from 'next/image'
import { ChangeEvent, useState, FormEvent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
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
  const dispatch = useDispatch()
  const [formValues, setFormValues] = useState<LoginUserParams>({
    email: '',
    password: '',
    remember_me: true,
  })

  const handleSubmit = (e: FormEvent) => {
    e?.preventDefault()
    dispatch(loginUserThunk(formValues))
  }
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e?.target
    setFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div
        style={{
          height: 64,
          background: 'var(--secondary-main)',
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
          <div
            style={{
              position: 'relative',
              height: 56,
              width: 56,
            }}
          >
            <Image src={companyLogo} alt="REALM1000 DITO" layout="fill" objectFit="contain" />
          </div>
        </div>
      </div>
      <div className={classes.paperContainer}>
        <Paper className={classes.paper} variant="outlined">
          <Typography
            style={{
              fontWeight: 700,
            }}
            variant="h3"
          >
            Login
          </Typography>
          <Box py={2}>
            <Divider />
          </Box>

          <Box>
            <div className={classes.inputContainer}>
              <Typography variant="body1">Email: </Typography>
              <TextField
                autoCapitalize="off"
                autoCorrect="none"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Email or Username"
                name="email"
                onChange={handleChange}
              ></TextField>
            </div>
            <Box py={0.5}></Box>
            <div className={classes.inputContainer}>
              <Typography variant="body1">Password: </Typography>
              <TextField
                autoCapitalize="off"
                autoCorrect="none"
                type="password"
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Password"
                name="password"
                onChange={handleChange}
              ></TextField>
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
                background: 'var(--primary-dark)',
                color: 'var(--primary-contrastText)',
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
