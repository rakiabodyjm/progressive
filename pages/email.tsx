import { Paper, Typography } from '@material-ui/core'
import SampleEmail from '@src/api/views/SampleEmail'
import EmailTemplate from '@src/api/views/SampleMaterialUiEmail'
const Email = () => (
  <div
    style={{
      color: 'black',
      margin: 'auto',
      maxWidth: 600,
    }}
  >
    <EmailTemplate />
  </div>
)

export default Email
