import { makeStyles, Typography } from '@material-ui/core'
import Drawer from '@src/components/layout/NavigationLayout/Drawer'
import Nav from '@src/components/layout/NavigationLayout/Nav'
import LoadingScreen from '@src/components/screens/LoadingScreen'
import { getUser, User, UserState } from '@src/redux/data/userSlice'
import { RootState } from '@src/redux/store'
import useWidth from '@src/utils/hooks/useWidth'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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
  const user: User = useSelector((state: RootState) => state.user?.data)
  const handleDrawerClose = () => {
    setOpen(false)
  }
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
    /**
     * if user exists
     */
    if (user) {
      dispatch(getUser(user.user_id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!user) {
    return <>{children}</>
  }
  if (!user && !children) {
    return <LoadingScreen textColor="var(--secondary-main)" color="var(--primary-dark)" />
  }
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <Drawer
        userName={user.first_name}
        roles={user.roles}
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
