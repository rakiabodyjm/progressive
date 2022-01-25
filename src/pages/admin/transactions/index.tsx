import { Box, Container, Divider, IconButton, Menu, Paper, Typography } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { TransactionResponse } from '@src/utils/api/transactionApi'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const AdminTransactionsPage = () => {
  const user = useSelector(userDataSelector)
  const moreAnchorEl = useRef<HTMLElement | undefined>()

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
            <Box>
              <IconButton onClick={() => {}} innerRef={moreAnchorEl}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={moreAnchorEl.current} open={false}></Menu>
            </Box>
            {/* <Box>
              <TransactionsTable />
            </Box> */}
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

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[] | undefined>()
  return (
    <Paper>
      <Box p={2}></Box>
    </Paper>
  )
}
export default AdminTransactionsPage
