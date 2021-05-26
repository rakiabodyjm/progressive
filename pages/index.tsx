import { Theme, Typography } from '@material-ui/core'
// import { Details } from '@material-ui/icons'
import Details from '@src/components/pages/Home/Details'
import { makeStyles } from '@material-ui/styles'
import Section1 from '@src/components/pages/Home/Section1'
import PromoPackages from '@src/components/pages/Home/PromoPackages'
import FAQs from '@src/components/pages/Home/FAQs'
import Contact from '@src/components/pages/Home/Contact'

const useStyles = makeStyles((theme: Theme) => ({
  index: { overflow: 'hidden' },
}))
export default function Home() {
  const classes = useStyles()
  return (
    <div className={classes.index}>
      <Section1 />
      <Details />
      <PromoPackages />
      <FAQs />
      <Contact />
    </div>
  )
}
