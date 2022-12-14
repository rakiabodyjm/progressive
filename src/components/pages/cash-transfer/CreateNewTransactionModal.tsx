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
import { userDataSelector } from '@src/redux/data/userSlice'
import useIsCtOperatorOrAdmin from '@src/utils/hooks/useIsCtOperatorOrAdmin'
import { CashTransferAs } from '@src/utils/types/CashTransferTypes'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

const CreateNewTransactionModal = ({
  open,
  onClose,
  onSelect,
  caesarBankName,
}: {
  open: boolean
  onClose: () => void
  onSelect?: (param: CashTransferAs) => void
  caesarBankName: string
}) => {
  const isEligible = useIsCtOperatorOrAdmin(['ct-operator', 'ct-admin'])
  const disabledKeys = useMemo(() => [...(isEligible ? [] : ['DEPOSIT', 'WITHDRAW'])], [isEligible])
  const disableLoad = useMemo(() => ['LOAD'], [])
  const disabledKeysAsRetailer = useMemo(
    () => [...(isEligible ? [] : ['LOAN', 'WITHDRAW', 'LOAD'])],
    [isEligible]
  )

  const telcoNetwork = [
    'Smart Communications',
    'Globe Telecommunications',
    'Dito Telecommunity',
    'Shoppe',
  ]

  const user = useSelector(userDataSelector)

  const theme = useTheme()
  const transactionTypes = useMemo<
    {
      id: CashTransferAs
      title: string
      description: string
    }[]
  >(
    () =>
      [
        {
          id: CashTransferAs.LOAD,
          title: 'Load',
          description: 'Recording Load Transactions',
        },
        {
          id: CashTransferAs.TRANSFER,
          title: 'Cash Transfer',
          description: 'Recording Bank to Bank Transactions',
        },
        {
          id: CashTransferAs.WITHDRAW,
          title: 'Withdraw',
          description: 'Recording Bank to Person Transaction',
        },
        {
          id: CashTransferAs.DEPOSIT,
          title: 'Deposit',
          description: 'Recording Person to Bank Transactions',
        },
        {
          id: CashTransferAs.LOAN,
          title: 'Loan',
          description: 'Recording Loan Transactions',
        },
        // {
        //   id: CashTransferAs.LOAN_PAYMENT,
        //   title: 'Loan Payment',
        //   description: 'Record Loan Payment Transactions',
        // },
      ].filter((ea) => {
        if (user?.retailer_id) {
          return disabledKeysAsRetailer
            ? !disabledKeysAsRetailer.includes(ea.id as CashTransferAs)
            : true
        }
        if (caesarBankName && isEligible && telcoNetwork.includes(caesarBankName as string)) {
          return disabledKeys ? !disabledKeys.includes(ea.id as CashTransferAs) : true
        }
        return disableLoad ? !disableLoad.includes(ea.id as CashTransferAs) : true
      }),
    [disabledKeys, disabledKeysAsRetailer, disableLoad, caesarBankName]
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
                    <Typography
                      variant="body2"
                      style={{
                        fontWeight: 400,
                      }}
                    >
                      {ea.description}
                    </Typography>
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
