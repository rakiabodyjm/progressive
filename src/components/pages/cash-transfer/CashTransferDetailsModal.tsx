import { Box, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import ModalWrapper from '@src/components/ModalWrapper'
import { formatIntoReadableDate } from '@src/utils/api/common'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'

export default function CashTransferDetailsModal({
  open,
  onClose,
  cashTransferData,
}: {
  open: boolean
  onClose: () => void
  cashTransferData?: CashTransferResponse
}) {
  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        {cashTransferData &&
        cashTransferData.as !== 'DEPOSIT' &&
        cashTransferData.as !== 'WITHDRAW' ? (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <FormLabel>Transaction Type:</FormLabel>
                <Typography variant="h5">{cashTransferData?.as}</Typography>
              </Box>
              <Box>
                <IconButton onClick={onClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                </Grid>
                {/* <Grid item xs={6}>
                <Typography>{cashTransferData?.id.split('-')[0]}</Typography>
              </Grid> */}
                <Grid item xs={12}>
                  <FormLabel>Reference Number / ID:</FormLabel>
                  <Typography>
                    {cashTransferData?.ref_num
                      ? cashTransferData?.ref_num
                      : cashTransferData?.id.split('-')[0]}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Date of Transaction:</FormLabel>
                  <Typography>
                    {formatIntoReadableDate(cashTransferData?.created_at || Date.now())}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <FormLabel>From:</FormLabel>
                  <Typography>
                    {cashTransferData?.caesar_bank_from?.description || 'ERROR'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormLabel>To:</FormLabel>
                  <Typography>
                    {cashTransferData?.caesar_bank_to?.description || 'ERROR'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormLabel>Bank Fee:</FormLabel>
                  <Typography>{cashTransferData?.bank_charge}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormLabel>Amount:</FormLabel>
                  <Typography>{cashTransferData?.amount}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <FormLabel>Description:</FormLabel>
                  <Typography noWrap>{cashTransferData?.description || 'ERROR'}</Typography>
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          cashTransferData && (
            <>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <FormLabel>Transaction Type:</FormLabel>
                  <Typography variant="h5">{cashTransferData?.as}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={onClose}>
                    <CloseOutlined />
                  </IconButton>
                </Box>
              </Box>
              <Box>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Date of Transaction:</FormLabel>
                    <Typography>
                      {formatIntoReadableDate(cashTransferData?.created_at || Date.now())}
                    </Typography>
                  </Grid>
                  {cashTransferData.caesar_bank_from && (
                    <Grid item xs={12}>
                      <FormLabel>From:</FormLabel>
                      <Typography>{cashTransferData?.caesar_bank_from.description}</Typography>
                    </Grid>
                  )}
                  <Grid item xs={6}>
                    <FormLabel>Bank Fee:</FormLabel>
                    <Typography>{cashTransferData?.bank_charge}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <FormLabel>Amount:</FormLabel>
                    <Typography>{cashTransferData?.amount}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <FormLabel>Description:</FormLabel>
                    <Typography noWrap>{cashTransferData?.description}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </>
          )
        )}
      </Paper>
    </ModalWrapper>
  )
}
