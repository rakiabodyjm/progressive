import { Box, Button, Divider, Grid, IconButton, Paper, Theme, Typography } from '@material-ui/core'
import { CloseOutlined, DoubleArrow } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  formatIntoReadableDate,
} from '@src/utils/api/common'
import { getWalletById } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'

import axios, { AxiosError } from 'axios'
import router from 'next/router'
import useSWR from 'swr'

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    marginTop: 64,
    [theme.breakpoints.down('xs')]: {
      transform: 'rotate(90deg)',
      marginTop: 16,
    },
  },
}))

export default function RevertCashTransferModal({
  open,
  onClose,
  ct_id,
  triggerRender,
}: {
  open: boolean
  onClose: () => void
  ct_id: string
  triggerRender: () => void
}) {
  const { data: ct_data } = useSWR<CashTransferResponse>(`/cash-transfer/${ct_id}`, (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .then(async (cashTransferData) => ({
        ...cashTransferData,
        ...(cashTransferData.from && { from: await getWalletById(cashTransferData.from.id) }),
        ...(cashTransferData.to && { to: await getWalletById(cashTransferData.to.id) }),
      }))
      .then((res) => res)
  )

  const dispatchNotif = useNotification()
  const classes = useStyles()
  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="sm">
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
                <IconButton onClick={onClose}>
                  {/* onClick={onClose} */}
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                </Grid>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormLabel>Date of Transaction:</FormLabel>
                    <Typography>
                      {formatIntoReadableDate(ct_data?.created_at || Date.now())}
                    </Typography>

                    <FormLabel>Amount:</FormLabel>
                    <Typography>{formatIntoCurrency(ct_data.amount)}</Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container alignItems="center" justifyContent="space-around">
                      <Grid item xs={12} sm={5}>
                        <FormLabel>
                          {ct_data.caesar_bank_to ? 'From Bank' : 'From Caesar'}
                        </FormLabel>
                        <Typography>
                          {ct_data.caesar_bank_to
                            ? ct_data.caesar_bank_to.description
                            : ct_data.to.description}
                        </Typography>
                        <Box mt={2}></Box>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>Current Balance:</FormLabel>
                              <Typography>
                                {formatIntoCurrency(
                                  ct_data.caesar_bank_to
                                    ? ct_data.caesar_bank_to.balance
                                    : ct_data?.to?.cash_transfer_balance
                                )}
                              </Typography>
                            </Grid>
                          </Box>
                        </Paper>
                        <Box mt={2}></Box>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>New Balance:</FormLabel>
                              <Typography>
                                {formatIntoCurrency(
                                  ct_data.caesar_bank_to
                                    ? ct_data.caesar_bank_to.balance - ct_data.amount
                                    : ct_data.to.cash_transfer_balance - ct_data.amount
                                )}
                              </Typography>
                            </Grid>
                          </Box>
                        </Paper>
                      </Grid>
                      <Grid item>
                        <DoubleArrow
                          className={classes.gridContainer}
                          style={{
                            fontSize: 60,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5}>
                        <FormLabel>{ct_data.caesar_bank_from ? 'To Bank' : 'To Caesar'}</FormLabel>
                        <Typography>
                          {ct_data.caesar_bank_from
                            ? ct_data.caesar_bank_from.description
                            : ct_data.from.description}
                        </Typography>
                        <Box mt={2}></Box>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>Current Balance:</FormLabel>
                              <Typography>
                                {formatIntoCurrency(
                                  ct_data.caesar_bank_from
                                    ? ct_data.caesar_bank_from.balance
                                    : ct_data?.from?.cash_transfer_balance
                                )}
                              </Typography>
                            </Grid>
                          </Box>
                        </Paper>
                        <Box mt={2}></Box>
                        <Paper>
                          <Box p={2}>
                            <Grid item xs={12}>
                              <FormLabel>New Balance:</FormLabel>
                              <Typography>
                                {formatIntoCurrency(
                                  ct_data.caesar_bank_from
                                    ? ct_data.caesar_bank_from.balance + ct_data.amount
                                    : ct_data.from.cash_transfer_balance + ct_data.amount
                                )}
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
            <Divider style={{ marginTop: 16 }} />
            <Box display="flex" justifyContent="flex-end">
              <Box mt={2}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    axios
                      .post(`/cash-transfer/revert/${ct_id}`)
                      .then((res) => {
                        dispatchNotif({
                          type: NotificationTypes.SUCCESS,
                          message: `Transaction Reverted`,
                        })
                      })
                      .catch((err) => {
                        extractMultipleErrorFromResponse(err as AxiosError).forEach((ea) => {
                          dispatchNotif({
                            type: NotificationTypes.ERROR,
                            message: ea,
                          })
                        })
                      })
                      .finally(() => {
                        onClose()
                        if (triggerRender) {
                          triggerRender()
                        }
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
