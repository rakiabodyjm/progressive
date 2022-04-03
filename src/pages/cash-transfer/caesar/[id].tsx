import { Box, Container, Paper } from '@material-ui/core'
import { useRouter } from 'next/router'

export default function ViewCashTransferCaesar() {
  const { query } = useRouter()
  const { id } = query

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper>
          <Box p={2}></Box>
        </Paper>
      </Container>
    </>
  )
}
