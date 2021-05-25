import { Theme, Typography } from '@material-ui/core'
// import { Details } from '@material-ui/icons'
import Details from '@src/components/pages/Home/Details'
import { makeStyles } from '@material-ui/styles'
import Section1 from '@src/components/pages/Home/Section1'
import Section2 from '@src/components/pages/Home/Section2'
import Section3 from '@src/components/pages/Home/Section3'

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
}))
export default function Home() {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Section1 />
      <Details />
      <Section2 />
      <Section3 />
    </div>
  )
}
