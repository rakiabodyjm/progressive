import { Typography, Paper } from '@material-ui/core'
import ReactDOMServer from 'react-dom/server'

const SampleEmail = () => (
  <>
    <div
      style={{
        maxWidth: 600,
        width: '100%',
        padding: 16,
      }}
    >
      <div
        style={{
          border: '2px solid black',
          borderRadius: 6,
          padding: 16,
        }}
      >
        <h1>Hello World</h1>
        <hr
          style={{
            height: 1,
            margin: '16px 0px',
          }}
        />
        <div
          style={{
            padding: 8,
            border: '2px solid black',
          }}
        >
          <p>This is the main content</p>
        </div>
      </div>
    </div>
  </>
)

export default SampleEmail
export const html = ReactDOMServer.renderToStaticMarkup(<SampleEmail />)
