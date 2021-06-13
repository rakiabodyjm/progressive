import { Paper, Typography } from '@material-ui/core'
// import SampleEmail from '@src/api/views/SampleEmail'
import { GetServerSideProps, NextPageContext } from 'next'
// import EmailTemplate from '@src/api/views/SampleMaterialUiEmail'
import dynamic from 'next/dynamic'
const EmailTemplate = dynamic(() => import('@src/api/views/SampleMaterialUiEmail'))

const Email = () => (
  <div
    style={{
      color: 'black',
      margin: 'auto',
      marginTop: 120,
    }}
  >
    <EmailTemplate
      name="Juan Miguel Dela Cruz"
      contact_number="09498460475"
      message="Hi I saw your advertisement, I am a hardworking person, you can contact me at my email 😘"
      email="rakiabodyjm@gmail.com"
    />
  </div>
)

export const getServerSideProps: GetServerSideProps = async (context) => ({
  notFound: process.env.NODE_ENV === 'production',
  props: {},
})
// props: {

// }

// const ip = context.req.connection.remoteAddress

export default Email
