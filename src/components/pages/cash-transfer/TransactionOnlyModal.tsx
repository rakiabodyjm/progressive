/* eslint-disable no-nested-ternary */
import {
  Box,
  Divider,
  Grid,
  IconButton,
  ListItem,
  Paper,
  TablePagination,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { Close } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  objectToURLQuery,
} from '@src/utils/api/common'
import {
  CashTransferAs,
  CashTransferFilterTypes,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { ChangeEvent, useCallback, useState } from 'react'
import useSWR from 'swr'

export default function TransactionOnlyModal({
  caesarBankId,
  open,
  handleClose,
}: {
  caesarBankId?: string
  open: boolean
  handleClose: () => void
}) {
  const [dateQuery, setDateQuery] = useState<CashTransferFilterTypes>({
    as: undefined,
    date_from: undefined,
    date_to: undefined,
  })
  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    limit: 10,
    page: 0,
  })
  const theme: Theme = useTheme()
  const { data: caesarBankData, isValidating: validatingTransaction } = useSWR(
    `/cash-transfer?${objectToURLQuery({
      caesar_bank: caesarBankId,
      ...paginateOptions,
      ...dateQuery,
    })}`,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data as Paginated<CashTransferResponse>)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
  )

  const isSender = useCallback(
    (cashTransfer: CashTransferResponse) =>
      !!(caesarBankId && cashTransfer?.caesar_bank_from?.id === caesarBankId),
    [caesarBankId]
  )
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateQuery((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }
  return (
    <ModalWrapper open={open} onClose={handleClose} containerSize="sm">
      <Paper style={{ padding: 16, overflow: 'hidden' }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h4">Transaction History</Typography>
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box mt={2}>
          <Divider />
        </Box>
        <Box p={1}>
          <Grid container spacing={1}>
            <Grid item xs={4} sm={4}>
              <FormLabel>Transaction Type</FormLabel>
              <AsDropDown
                onChange={(e) => {
                  if (e.target.value === '') {
                    setDateQuery((prev) => ({
                      ...prev,
                      as: undefined,
                    }))
                  } else {
                    setDateQuery((prev) => ({
                      ...prev,
                      as: e.target.value,
                    }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <FormLabel>Date From</FormLabel>
              <FormTextField
                type="date"
                name="date_from"
                size="small"
                value={dateQuery.date_from}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={4} sm={4}>
              <FormLabel>Date To</FormLabel>
              <FormTextField
                type="date"
                name="date_to"
                size="small"
                value={dateQuery.date_to}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
        <Box
          style={{
            display: 'grid',
            gap: 8,
            maxHeight: 500,
            overflowY: 'auto',
          }}
        >
          {caesarBankData && caesarBankData?.metadata.total > 0 ? (
            <>
              {caesarBankData.data.map((cashTransfer) => (
                <Paper
                  key={cashTransfer.id}
                  style={{
                    overflow: 'hidden',
                  }}
                  variant="outlined"
                >
                  <ListItem
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: 8,
                    }}
                    // button
                    // onClick={
                    //   cashTransfer.as === CashTransferAs.LOAN_PAYMENT
                    //     ? () => {
                    //         router.push(`/cash-transfer/loan/${cashTransfer.loan?.id}`)
                    //       }
                    //     : cashTransfer.as === CashTransferAs.LOAN
                    //     ? () => {
                    //         setLoanModal({
                    //           open: true,
                    //           transferData: cashTransfer,
                    //         })
                    //       }
                    //     : () => {
                    //         setTransferModal({
                    //           open: true,
                    //           transferData: cashTransfer,
                    //         })
                    //       }
                    // }
                  >
                    <Box display="flex" width="100%" justifyContent="space-between">
                      <Typography
                        style={{
                          display: 'block',
                          alignSelf: 'flex-end',
                        }}
                        variant="caption"
                      >
                        {cashTransfer?.ref_num
                          ? cashTransfer?.ref_num
                          : cashTransfer?.id.split('-')[0]}
                      </Typography>
                      <Typography
                        style={{
                          display: 'block',
                          alignSelf: 'flex-end',
                        }}
                        variant="caption"
                      >
                        {new Date(cashTransfer.created_at).toLocaleString()}
                      </Typography>
                    </Box>

                    {/* <Typography>
                    {isSender(cashTransfer)
                      ? cashTransfer?.caesar_bank_to?.description ||
                        cashTransfer?.to?.description ||
                        'ERROR'
                      : cashTransfer?.caesar_bank_from?.description ||
                        cashTransfer?.from?.description ||
                        'ERROR'}
                 
                  </Typography> */}
                    <Box
                      display="flex"
                      width="100%"
                      alignItems="flex-end"
                      justifyContent="space-between"
                    >
                      <Box display="inline-flex">
                        <Typography variant="body2" color="primary">
                          {(cashTransfer.as === CashTransferAs.LOAN_PAYMENT && 'PAYMENT') ||
                            cashTransfer.as}
                        </Typography>
                        {(cashTransfer?.as === CashTransferAs.LOAN ||
                          cashTransfer?.as === CashTransferAs.LOAD) &&
                          cashTransfer?.is_loan_paid && (
                            <Typography
                              variant="caption"
                              component="span"
                              color="initial"
                              style={{
                                display: 'inline',
                                marginLeft: 8,
                                border: `2px solid ${theme.typography.caption.color}`,
                              }}
                            >
                              PAID
                            </Typography>
                          )}
                      </Box>

                      <Typography
                        style={{
                          alignSelf: 'flex-end',
                        }}
                      >
                        <Typography component="span">
                          {cashTransfer?.as !== CashTransferAs.DEPOSIT && isSender(cashTransfer)
                            ? ' - '
                            : ' + '}
                        </Typography>

                        {formatIntoCurrency(cashTransfer.amount)}
                      </Typography>
                    </Box>
                    {cashTransfer?.as !== CashTransferAs.DEPOSIT && isSender(cashTransfer) && (
                      <Box
                        display="flex"
                        width="100%"
                        alignItems="flex-end"
                        justifyContent="space-between"
                      >
                        <Typography variant="caption" color="textSecondary">
                          {/* {cashTransfer.as} */}
                          Bank Fee:
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{
                            alignSelf: 'flex-end',
                          }}
                        >
                          - {formatIntoCurrency(cashTransfer?.bank_charge)}
                        </Typography>
                      </Box>
                    )}
                    {!isSender(cashTransfer) && (
                      <Box
                        display="flex"
                        width="100%"
                        alignItems="flex-end"
                        justifyContent="space-between"
                      >
                        <Typography variant="caption" color="textSecondary">
                          {/* {cashTransfer.as} */}
                          Senders Bank Fee:
                        </Typography>
                        <Typography
                          variant="caption"
                          style={{
                            alignSelf: 'flex-end',
                          }}
                        >
                          + {formatIntoCurrency(cashTransfer?.bank_charge)}
                        </Typography>
                      </Box>
                    )}

                    <Box
                      display="flex"
                      width="100%"
                      alignItems="flex-end"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption" color="textSecondary">
                        {/* {cashTransfer.as} */}
                        Remaining Bank Balance
                      </Typography>
                      <Typography
                        variant="caption"
                        style={{
                          alignSelf: 'flex-end',
                        }}
                      >
                        {formatIntoCurrency(
                          isSender(cashTransfer) && cashTransfer?.as !== CashTransferAs.DEPOSIT
                            ? cashTransfer.remaining_balance_from
                            : cashTransfer.remaining_balance_to
                        )}
                      </Typography>
                    </Box>
                  </ListItem>
                </Paper>
              ))}
            </>
          ) : validatingTransaction ? (
            <LoadingScreen2
              containerProps={{
                style: {
                  minHeight: 120,
                },
              }}
            />
          ) : (
            <Paper
              style={{
                minHeight: 120,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                flexDirection: 'column',
              }}
            >
              <Typography variant="body2">No Data Available</Typography>
              <Typography variant="caption" color="primary">
                No Transaction Found
              </Typography>
            </Paper>
          )}
        </Box>
        <Box pt={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            count={caesarBankData?.metadata.total || 0}
            rowsPerPage={caesarBankData?.metadata?.limit || 5}
            page={caesarBankData?.metadata?.page || 0}
            onPageChange={(_, page) => {
              setPaginateOptions((prev) => ({
                ...prev,
                page,
              }))
            }}
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setPaginateOptions((prev) => ({
                ...prev,
                limit: Number(e.target.value),
              }))
            }}
            component="div"
          />
        </Box>
      </Paper>
    </ModalWrapper>
  )
}
