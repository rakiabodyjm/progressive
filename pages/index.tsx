import { Theme, Typography } from '@material-ui/core'
// import { Details } from '@material-ui/icons'
import Details from '@src/components/pages/Home/Details'
import { makeStyles } from '@material-ui/styles'
import Section1 from '@src/components/pages/Home/Section1'
import PromoPackages from '@src/components/pages/Home/PromoPackages'
import FAQs from '@src/components/pages/Home/FAQs'
import Contact from '@src/components/pages/Home/Contact'
import Head from 'next/head'

const useStyles = makeStyles(() => ({
  index: { overflow: 'hidden' },
}))
export default function Home() {
  const classes = useStyles()
  return (
    <>
      <Head>
        <title>REALM1000 - DITO SIM Packages</title>
        <meta
          name="description"
          content="DITO Sim Packages from REALM1000 are available for bulk ordering and inquiries. Inquire Now to get your special quotation sent directly to your email or phone number"
        />
      </Head>
      <div className={classes.index}>
        <Section1 />
        <Details />
        <PromoPackages />
        <FAQs />
        <Contact />
      </div>
    </>
  )
}
