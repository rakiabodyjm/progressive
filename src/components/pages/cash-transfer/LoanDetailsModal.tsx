import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined, MoreVert } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import ModalWrapper from '@src/components/ModalWrapper'
import { formatIntoReadableDate } from '@src/utils/api/common'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { useRouter } from 'next/router'
import { useRef } from 'react'
import useSWR from 'swr'

export default function LoanDetailsModal({
  open,
  onClose,
  loanData,
}: {
  open: boolean
  onClose: () => void
  loanData?: CashTransferResponse
}) {
  const router = useRouter()

  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        {loanData && (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <FormLabel>Transaction Type:</FormLabel>
                <Typography variant="h5">{loanData?.as}</Typography>
              </Box>
              <Box>
                <IconButton onClick={onClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <FormLabel>Date loaned:</FormLabel>
                    <Typography>
                      {formatIntoReadableDate(loanData?.created_at || Date.now())}
                    </Typography>
                  </Grid>
                  {/* <Grid item xs={6}>
                    <Typography>{cashTransferData?.id.split('-')[0]}</Typography>
                  </Grid> */}

                  <Grid item xs={6}>
                    <FormLabel>From:</FormLabel>
                    <Typography>
                      {loanData?.caesar_bank_from.description ||
                        loanData?.from?.description ||
                        'ERROR'}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormLabel>To:</FormLabel>
                    <Typography>
                      {loanData?.caesar_bank_to?.description ||
                        loanData?.to?.description ||
                        'ERROR'}
                    </Typography>
                  </Grid>

                  <Grid item xs={6}>
                    <FormLabel>Bank Fee:</FormLabel>
                    <Typography>{loanData?.bank_charge}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormLabel>Amount:</FormLabel>
                    <Typography>{loanData?.amount}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Description:</FormLabel>
                    <Typography noWrap>{loanData?.description}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mt={2}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    router.push(`/cash-transfer/loan/${loanData.id}`)
                  }}
                >
                  Go to Page
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </ModalWrapper>
  )
}
