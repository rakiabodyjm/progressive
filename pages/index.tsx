import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Section1 from '@src/components/pages/Home/Section1'
import Section2 from '@src/components/pages/Home/Section2'
import Section3 from '@src/components/pages/Home/Section3'

const useStyles = makeStyles((theme) => ({}))
export default function Home() {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
    </>
  )
}
