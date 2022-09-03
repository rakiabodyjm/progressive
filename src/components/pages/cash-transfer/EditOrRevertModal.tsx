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
import { EditOrRevertTypes } from '@src/utils/types/CashTransferTypes'
import { useRef } from 'react'

export default function EditOrRevertModal({
  open,
  onClose,
  selected,
}: {
  open: boolean
  onClose: () => void
  selected: (arg1: EditOrRevertTypes) => void
}) {
  const theme = useTheme()
  const transactionTypes = useRef<
    {
      id: EditOrRevertTypes
      title: string
      description: string
    }[]
  >([
    {
      id: EditOrRevertTypes.EDIT,
      title: 'Edit Transaction',
      description: 'Edit details of transaction',
    },
    {
      id: EditOrRevertTypes.REVERT,
      title: 'Revert Transaction',
      description: 'Revert the chosen transaction',
    },
  ])
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
              Edit or Revert Transactions
            </Typography>
            <Typography variant="body2">Modify existing Transaction</Typography>
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
            {transactionTypes.current.map((ea) => (
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
                  if (selected) {
                    selected(ea.id)
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
