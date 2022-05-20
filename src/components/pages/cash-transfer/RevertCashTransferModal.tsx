import { Box, Button, Divider, Grid, IconButton, Paper, Theme, Typography } from '@material-ui/core'
import { CloseOutlined, DoubleArrow } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { formatIntoReadableDate } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'

import axios from 'axios'
import router from 'next/router'
import useSWR from 'swr'

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      transform: 'rotate(90deg)',
    },
  },
}))

export default function RevertCashTransferModal({
  open,
  onClose,
  ct_id,
}: {
  open: boolean
  onClose: () => void
  ct_id: string
}) {
  const { data: ct_data } = useSWR<CashTransferResponse>(`/cash-transfer/${ct_id}`, (url) =>
    axios.get(url).then((res) => res.data)
  )
  console.log(ct_data)
  const dispatchNotif = useNotification()
  const classes = useStyles()
  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        {ct_data && (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <FormLabel>REVERT: {ct_data.ref_num}</FormLabel>
                <Typography variant="h5">{ct_data?.as}</Typography>
              </Box>
              <Box>
                <IconButton>
                  {/* onClick={onClose} */}
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
                    <FormLabel>Date of Transaction:</FormLabel>
                    <Typography>
                      {formatIntoReadableDate(ct_data?.created_at || Date.now())}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <FormLabel>From: </FormLabel>
                    <Typography>
                      {ct_data.caesar_bank_to
                        ? ct_data.caesar_bank_to.description
                        : ct_data.to.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormLabel>To:</FormLabel>
                    <Typography>
                      {ct_data.caesar_bank_from
                        ? ct_data.caesar_bank_from.description
                        : ct_data.from.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormLabel>Amount:</FormLabel>
                    <Typography>{ct_data.amount}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-around">
                      <Grid item xs={12} sm={5}>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>Current Balance:</FormLabel>
                              <Typography>
                                {ct_data.caesar_bank_to
                                  ? ct_data.caesar_bank_to.balance
                                  : ct_data?.to?.cash_transfer_balance}
                              </Typography>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid>
                        <DoubleArrow
                          className={classes.gridContainer}
                          style={{
                            fontSize: 60,
                          }}
                        />
                      </Grid>
                      <Grid xs={12} sm={5}>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>New Balance:</FormLabel>
                              <Typography>
                                {ct_data.caesar_bank_from
                                  ? ct_data.caesar_bank_from.balance + ct_data.amount
                                  : ct_data.from.cash_transfer_balance + ct_data.amount}
                              </Typography>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
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
                    axios.post(`/cash-transfer/revert/${ct_id}`).then((res) => {
                      dispatchNotif({
                        type: NotificationTypes.SUCCESS,
                        message: `Transaction Reverted`,
                      })
                    })
                  }}
                >
                  Revert Transaction
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </ModalWrapper>
  )
}
