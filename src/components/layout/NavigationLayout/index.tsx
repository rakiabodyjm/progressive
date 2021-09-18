import { makeStyles, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import Drawer from '@src/components/layout/NavigationLayout/Drawer'
import Nav from '@src/components/layout/NavigationLayout/Nav'
import LoadingScreen from '@src/components/screens/LoadingScreen'
import { getUser, User, UserState } from '@src/redux/data/userSlice'
import { RootState } from '@src/redux/store'
import useWidth from '@src/utils/hooks/useWidth'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'

import { useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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

export default function NavigationLayout({ children }) {
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
      }}
    >
      <Drawer
        userName={user?.first_name || 'Loading...'}
        roles={user?.roles || []}
        handleDrawerClose={handleDrawerClose}
        open={open}
      />
      <Nav open={open} handleDrawerOpen={handleDrawerOpen} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  )
}
