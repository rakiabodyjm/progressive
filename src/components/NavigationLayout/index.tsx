/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { Box, Container, makeStyles } from '@material-ui/core'
import Drawer from '@src/components/NavigationLayout/Drawer'
import Nav from '@src/components/NavigationLayout/Nav'
import { RootState } from '@src/redux/store'
import useWidth from '@src/utils/hooks/useWidth'
import { useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(2),
    },
    minHeight: '90vh',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}))

export default function NavigationLayout({ children }: { children: JSX.Element }) {
  const width = useWidth()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const userSelect = useSelector((state: RootState) => state.user)
  const user = useMemo(() => userSelect?.data || null, [userSelect])

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
      }}
    >
      <Drawer
        userName={user?.first_name || 'Loading...'}
        roles={user?.roles || []}
        handleDrawerClose={handleDrawerClose}
        open={open}
      />
      <Nav open={open} handleDrawerOpen={handleDrawerOpen} />
      {open && (
        <Box
          onClick={handleDrawerClose}
          style={{
            position: 'fixed',
            content: '""',
            height: '100%',
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )}
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Container maxWidth="lg" disableGutters>
          {children}
        </Container>
      </main>
    </div>
  )
}
