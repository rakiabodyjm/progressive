import { Box, Container, Divider, Paper, Typography } from '@material-ui/core'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

const AdminTransactionsPage = () => {
  const user = useSelector(userDataSelector)
  return (
    <Container>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              {user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
              <Typography noWrap color="textSecondary" variant="h6">
                {user?.first_name}
              </Typography>
              <Typography variant="h4">Transactions</Typography>
              <Typography variant="body2" color="primary">
                Transactions of Subdistributor | DSP | Retailers
              </Typography>
            </Box>
            <Box></Box>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Box>
              <Paper>
                <Box></Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

const TransactionsTable = ({ account }) => {
    
    return (
        <UsersTable/>
    )
}
export default AdminTransactionsPage
