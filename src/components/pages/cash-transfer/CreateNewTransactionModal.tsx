import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import ModalWrapper from '@src/components/ModalWrapper'
import { useMemo } from 'react'

type TransferTypes = 'cash-transfer' | 'withdraw' | 'deposit'
const CreateNewTransactionModal = ({
  open,
  onClose,
  disabledKeys,
  onSelect,
}: {
  open: boolean
  onClose: () => void
  disabledKeys?: TransferTypes[]
  onSelect?: (param: TransferTypes) => void
}) => {
  const theme = useTheme()
  const transactionTypes = useMemo<
    {
      id: TransferTypes
      title: string
      description: string
    }[]
  >(
    () =>
      [
        {
          id: 'cash-transfer' as TransferTypes,
          title: 'Cash Transfer',
          description: 'Recording Bank to Bank Transactions',
        },
        {
          id: 'withdraw' as TransferTypes,
          title: 'Loan',
          description: 'Bank to Account or Person Transaction',
        },
        {
          id: 'deposit' as TransferTypes,
          title: 'Deposit',
          description: 'Recording Account or Person to Bank Transactions',
        },
      ].filter((ea) => (disabledKeys ? disabledKeys.includes(ea.id as TransferTypes) : true)),
    []
  )
  return (
    <ModalWrapper containerSize="xs" open={open} onClose={onClose}>
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography color="primary" variant="h6">
              Create Transaction
            </Typography>
            <Typography variant="body2">Record a new Transaction</Typography>
          </Box>
          <Box>
            <IconButton onClick={onClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>

        <Box my={2}>
          <Divider />
        </Box>
        <Box>
          <List>
            {transactionTypes.map((ea) => (
              <ListItem
                style={{
                  border: theme.palette.divider,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 4,
                  marginBottom: 4,
                }}
                button
                key={ea.id}
                // {...(onSelect && { onClick: onSelect })}
                onClick={() => {
                  if (onSelect) {
                    onSelect(ea.id)
                  }
                }}
              >
                <Grid
                  container
                  spacing={1}
                  style={{
                    padding: 8,
                  }}
                >
                  <Grid item xs={12}>
                    <Typography
                      style={{
                        fontWeight: 700,
                      }}
                      color="primary"
                      variant="body1"
                    >
                      {ea.title}
                    </Typography>
                    <Typography variant="body2">{ea.description}</Typography>
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>
    </ModalWrapper>
  )
}

export default CreateNewTransactionModal
