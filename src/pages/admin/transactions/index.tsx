import {
  Box,
  Container,
  Divider,
  IconButton,
  Menu,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import TransactionsTable from '@src/components/pages/transactions/TransactionsTable'
import RoleBadge from '@src/components/RoleBadge'
import { userDataSelector } from '@src/redux/data/userSlice'
import useResizeListener from '@src/utils/hooks/useResizeListener'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

const AdminTransactionsPage = () => {
  const user = useSelector(userDataSelector)
  const moreAnchorEl = useRef<HTMLElement | undefined>()
  const [refElement, setRefElement] = useState<HTMLDivElement | null>(null)
  const { refElementState } = useResizeListener({
    refElement,
    target: 'clientHeight',
  })

  const [heightOfTransactionTable, setHeightOfTransactionTable] = useState<number>(400)

  useEffect(() => {
    if (refElementState) {
      setHeightOfTransactionTable(refElementState as number)
    }
    if (refElement) {
      setHeightOfTransactionTable(refElement.clientHeight)
    }
  }, [refElementState, refElement])
  return (
    <>
      <Container
        style={{
          height: '85vh',
          minHeight: 480,
        }}
        maxWidth="lg"
        disableGutters
      >
        <Paper
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            height: '100%',
            minHeight: 400,
          }}
        >
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
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <div
            style={{
              flexGrow: 1,
              overflow: 'hidden',
            }}
            ref={(ref) => {
              if (ref) {
                const refElement = ref as HTMLDivElement
                setRefElement(refElement)
              }
            }}
          >
            <TransactionsTable height={heightOfTransactionTable} as="admin" />
          </div>
        </Paper>
      </Container>
    </>
  )
}

export default AdminTransactionsPage
