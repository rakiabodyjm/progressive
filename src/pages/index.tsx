import { makeStyles, Typography } from '@material-ui/core'
import Drawer from '@src/components/layout/NavigationLayout/Drawer'
import Nav from '@src/components/layout/NavigationLayout/Nav'
import LoadingScreen from '@src/components/screens/LoadingScreen'
import { User, UserState } from '@src/redux/data/userSlice'
import { RootState } from '@src/redux/store'
import useWidth from '@src/utils/hooks/useWidth'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useSelector } from 'react-redux'

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
export default function Index({ children }: { children: JSX.Element }) {
  const width = useWidth()
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  const handleDrawerOpen = () => {
    setOpen(true)
  }
  // const user: User = useSelector((state: RootState) => state.user?.data)
  const handleDrawerClose = () => {
    setOpen(false)
  }

  return <Typography variant="h4">Main Dashboard</Typography>
}
