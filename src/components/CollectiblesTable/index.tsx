/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
import { Box, Divider, Paper, Theme, Typography, Grid, ListItem } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import DirectPaidModal from '@src/components/pages/cash-transfer/DirectPaidModal'
import RoleBadge from '@src/components/RoleBadge'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  objectToURLQuery,
} from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import {
  CashTransferAs,
  CashTransferRequestTypes,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import React, { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'

export default function CollectiblesTable({
  caesarId,
  triggerRender,
}: {
  caesarId?: CaesarWalletResponse['id']
  triggerRender: () => void
}) {
  const theme: Theme = useTheme()
  const [queryParameters, setQueryParameters] = useState<{
    page: number
    limit: number
  }>({
    page: 0,
    limit: 100,
  })

  const {
    data: cashTransfers,
    error,
    isValidating,
    mutate: mutateCashTransferList,
  } = useSWR<Paginated<CashTransferResponse>>(
    !caesarId
      ? null
      : `/cash-transfer?${objectToURLQuery({
          caesar: caesarId,
          // caesar_bank: caesarBankId,
          // loan: loanId,
          ...queryParameters,
        })}`,
    (url) => axios.get(url).then((res) => res.data)
  )

  const {
    data: pendingRequest,
    isValidating: loadingPendingRequest,
    mutate: mutatePendingRequest,
  } = useSWR<Paginated<CashTransferRequestTypes>>('/request?is_declined=false', (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
  )

  const {
    data: externalCashTransfers,
    isValidating: loadingCashTransfers,
    error: errorCashTransfers,
    mutate: mutateRetailerLoanList,
  } = useSWR<CashTransferResponse[]>(
    caesarId ? `/cash-transfer/get-retailer-loan/${caesarId}/search` : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[])
  )

  const {
    data: externalCashTransfersLoad,
    isValidating: loadingCashTransfersLoad,
    error: errorCashTransfersLoad,
    mutate: mutateRetailerLoanListLoad,
  } = useSWR<CashTransferResponse[]>(
    caesarId ? `/cash-transfer/get-retailer-load/${caesarId}/search` : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[])
  )

  const isSender = useCallback(
    (cashTransfer: CashTransferResponse) =>
      !!(
        (caesarId && cashTransfer?.from?.id === caesarId) ||
        cashTransfer?.caesar_bank_from?.caesar.id === caesarId
      ),
    [caesarId]
  )

  const aggreGatedCashTransfers = useMemo(
    () =>
      [...(externalCashTransfers || []), ...(cashTransfers?.data || [])].filter(
        (fi, index, array) => array.map((ea) => ea.id).indexOf(fi.id) === index
      ),
    [externalCashTransfers, cashTransfers]
  )

  const aggreGatedCashTransfersWithLoad = useMemo(
    () =>
      [...(aggreGatedCashTransfers || []), ...(externalCashTransfersLoad || [])].filter(
        (fi, index, array) => array.map((ea) => ea.id).indexOf(fi.id) === index
      ),
    [externalCashTransfers, externalCashTransfersLoad]
  )

  const loanToCollect = useMemo(
    () => ({
      collected:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && ea.is_loan_paid
        )?.length || 0,
      toBeCollect:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && !ea.is_loan_paid
        )?.length || 0,
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const loanAndLoad = useMemo(
    () => ({
      unpaid: aggreGatedCashTransfersWithLoad.filter(
        (ea) => (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && !ea.is_loan_paid
      ),
      paid: aggreGatedCashTransfersWithLoad.filter(
        (ea) => (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && ea.is_loan_paid
      ),
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const [loanData, setLoanData] = useState<CashTransferResponse>()

  const [creditToOtherDsp, setCreditToOtherDsp] = useState<boolean>(false)

  return (
    <>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">
              <span
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: -1,
                }}
              >
                Loan/Load Payments
              </span>{' '}
              to Collect
            </Typography>
          </Box>
          <Box my={2} />
          <Box my={2}>
            <Divider />
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={4} md={4} lg={6}>
              <Paper
                style={{
                  textAlign: 'center',
                  height: '100%',
                  padding: 16,
                  background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
              >
                <FormLabel>Unpaid Loan/s</FormLabel>
                <Typography variant="h4" style={{ fontWeight: '800' }}>
                  {loanToCollect.toBeCollect || 0}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={8} md={8} lg={6}>
              <Paper
                style={{
                  textAlign: 'center',
                  height: '100%',
                  padding: 16,
                  background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
              >
                <FormLabel>Total Amount</FormLabel>
                <Typography variant="h4" style={{ fontWeight: '800' }}>
                  {formatIntoCurrency(
                    loanAndLoad.unpaid.reduce((prev, { total_amount }) => prev + total_amount, 0)
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          {/* <Box my={2}>
            <Divider />
          </Box>

          <Grid container spacing={1}>
            <Grid item xs={12} sm={4} md={4} lg={6}>
              <Paper
                style={{
                  textAlign: 'center',
                  height: '100%',
                  padding: 16,
                  background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
              >
                <FormLabel>Paid Loan/s</FormLabel>
                <Typography variant="h4" style={{ fontWeight: '800' }}>
                  {loanToCollect.collected || 0}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={8} md={8} lg={6}>
              <Paper
                style={{
                  textAlign: 'center',
                  height: '100%',
                  padding: 16,
                  background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                }}
              >
                <FormLabel>Amount</FormLabel>
                <Typography variant="h4" style={{ fontWeight: '800' }}>
                  {formatIntoCurrency(
                    loanAndLoad.paid.reduce((prev, { total_amount }) => prev + total_amount, 0)
                  )}
                </Typography>
              </Paper>
            </Grid>
          </Grid> */}
          <Box
            my={2}
            style={{
              display: 'grid',
              gap: 8,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {aggreGatedCashTransfersWithLoad &&
            loanToCollect &&
            loanToCollect?.toBeCollect &&
            loanToCollect?.toBeCollect > 0 ? (
              <>
                {aggreGatedCashTransfersWithLoad
                  .filter(
                    (ea) =>
                      (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
                      !ea.is_loan_paid
                  )
                  .map((cashTransfer) => (
                    <Box key={cashTransfer.id}>
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
                          key={cashTransfer.id}
                          button
                          onClick={() => {
                            setCreditToOtherDsp(true)
                            setLoanData(cashTransfer)
                          }}
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

                          {!isSender(cashTransfer) && (
                            <Typography variant="caption">
                              <span
                                style={{
                                  color: theme.palette.primary.main,
                                }}
                              >
                                Transaction By:
                              </span>{' '}
                              {cashTransfer?.caesar_bank_from?.description ||
                                cashTransfer?.from?.description ||
                                'ERROR'}
                            </Typography>
                          )}
                          <Typography>
                            {cashTransfer?.caesar_bank_to?.description ||
                              cashTransfer?.to?.description ||
                              'ERROR'}
                          </Typography>
                          <Box
                            display="flex"
                            width="100%"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Typography variant="body2" color="primary">
                              {cashTransfer.as}
                            </Typography>
                            <Typography
                              style={{
                                alignSelf: 'flex-end',
                              }}
                            >
                              {formatIntoCurrency(cashTransfer.total_amount)}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            width="100%"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          ></Box>
                        </ListItem>
                      </Paper>
                    </Box>
                  ))}
              </>
            ) : loadingCashTransfers ? (
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
                <Typography variant="body2">Not Available</Typography>
                <Typography variant="caption" color="primary">
                  No Loans to be collect today
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>
        <Box my={2}>
          <Divider />
        </Box>

        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">
              <span
                style={{
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  letterSpacing: -1,
                }}
              >
                Pending
              </span>{' '}
              Request
            </Typography>
          </Box>
          <Box my={2} />
          <Box my={2}>
            <Divider />
          </Box>
          <Box
            // my={2}
            style={{
              display: 'grid',
              gap: 8,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            <Grid container>
              <Grid item xs={12}>
                <Paper
                  style={{
                    textAlign: 'center',
                    height: '100%',
                    padding: 16,
                    background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                  }}
                >
                  <FormLabel>Pending Request</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {pendingRequest?.metadata.total || 0}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
            {pendingRequest && pendingRequest.metadata.total > 0 ? (
              <>
                {pendingRequest &&
                  pendingRequest.data.map((p_request) => (
                    <Box key={p_request.id}>
                      <Paper
                        key={p_request.id}
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
                          key={p_request.id}
                          button
                          // onClick={() => {
                          //   setCreditToOtherDsp(true)
                          //   setLoanData(cashTransfer)
                          // }}
                        >
                          <Box display="flex" width="100%" justifyContent="space-between">
                            <Typography
                              style={{
                                display: 'block',
                                alignSelf: 'flex-end',
                              }}
                              variant="caption"
                            >
                              <RoleBadge variant="caption">{p_request.status}</RoleBadge>
                            </Typography>
                            <Typography
                              style={{
                                display: 'block',
                                alignSelf: 'flex-end',
                              }}
                              variant="caption"
                            >
                              {new Date(p_request?.created_at as Date).toLocaleString()}
                            </Typography>
                          </Box>

                          <Typography>{p_request.caesar_bank?.description}</Typography>
                          <Box
                            display="flex"
                            width="100%"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          >
                            <Typography variant="body2" color="primary">
                              {p_request.as}
                            </Typography>
                            <Typography
                              style={{
                                alignSelf: 'flex-end',
                              }}
                            >
                              {formatIntoCurrency(Number(p_request?.amount))}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            width="100%"
                            alignItems="flex-end"
                            justifyContent="space-between"
                          ></Box>
                        </ListItem>
                      </Paper>
                    </Box>
                  ))}
              </>
            ) : loadingPendingRequest ? (
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
                  No Pending Request Found
                </Typography>
              </Paper>
            )}
          </Box>
        </Box>

        {creditToOtherDsp && (
          <DirectPaidModal
            open={creditToOtherDsp}
            handleClose={() => {
              setCreditToOtherDsp(false)
            }}
            loanData={loanData}
            triggeredRender={() => {
              mutateRetailerLoanList()
              mutateCashTransferList()
              triggerRender()
            }}
          ></DirectPaidModal>
        )}
        {/* <Box pt={2}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            count={cashTransfers?.metadata.total || 0}
            rowsPerPage={cashTransfers?.metadata?.limit || 5}
            page={cashTransfers?.metadata?.page || 0}
            onPageChange={(_, page) => {
              setQueryParameters((prev) => ({
                ...prev,
                page,
              }))
            }}
            onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
              setQueryParameters((prev) => ({
                ...prev,
                limit: Number(e.target.value),
              }))
            }}
            component="div"
          />
        </Box> */}
      </Paper>
    </>
  )
}
