// import { Details } from '@material-ui/icons'
import Details from '@src/components/pages/Home/Details'
import { makeStyles } from '@material-ui/styles'
import Section1 from '@src/components/pages/Home/Section1'
import FAQs from '@src/components/pages/Home/FAQs'
import Contact from '@src/components/pages/Home/Contact'
import Head from 'next/head'
import DSPMap from '@src/components/pages/Home/DSPMap'
import DSPSection from '@src/components/pages/Home/DSPSection'
const useStyles = makeStyles(() => ({
  index: { overflow: 'hidden' },
}))
export default function Home() {
  const classes = useStyles()
  return (
    <>
      <Head>
        <title>REALM1000 | DITO SIM Packages</title>
        <meta
          name="description"
          content="DITO Sim Packages from REALM1000 are available for bulk ordering and inquiries. Inquire Now to get your special quotation sent directly to your email or phone number"
        />
        <meta property="og:title" content="REALM1000 | DITO SIM Packages" />
        <meta property="og:type" content="website" />
        {/* <meta property="og:image" content="/og:image.png" /> */}
        <meta property="og:image" content="/og:image2.png" />
        <meta
          property="og:description"
          content="Inquire and be an official retailer of DITO Telecom Sims, the fastest growing telecom in the country!"
        />
        <meta
          property="og:url"
          content="https://dito.realm1000.com"
          // content="Inquire and be an official retailer of DITO Telecom Sims, the fastest growing telecom in the country!"
        />
      </Head>
      <div className={classes.index}>
        <Section1 />
        <Details />
        {/* <PromoPackages /> */}
        <DSPMap />

        <DSPSection />

        <FAQs />
        <Contact />
      </div>
    </>
  )
}
