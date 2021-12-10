import { Box, Button, Divider, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

export default function LoginExtensionModal({
  logout,
  close,
}: {
  logout: () => void
  close: () => void
}) {
  const Login = dynamic(() => import(`@src/components/pages/login`))
  const [loginShow, setLoginShow] = useState<boolean>(false)

  if (loginShow) {
    return (
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Login
          reloginFunction={() => {
            setLoginShow(false)
            close()
          }}
        />
      </Box>
    )
  }
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Typography variant="h6">Session is Expired</Typography>
          <Typography variant="body2" color="primary">
            Please relogin to maintain session
          </Typography>
          <Box py={1.5}>
            <Divider />
          </Box>
          <Box display="flex" flexDirection="column">
            <Button
              onClick={() => {
                setLoginShow(true)
              }}
              variant="contained"
              color="primary"
            >
              <Typography>Login</Typography>
            </Button>
            <Box p={0.5} />
            <Button
              onClick={() => {
                logout()
              }}
              variant="contained"
            >
              <Typography>Logout</Typography>
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}
