/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Divider,
  Paper,
  Theme,
  Typography,
  Grid,
  ListItem,
  TablePagination,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { AirlineSeatLegroomNormalTwoTone } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import DirectPaidModal from '@src/components/pages/cash-transfer/DirectPaidModal'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  objectToURLQuery,
} from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { CashTransferAs, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

type LoanCollectTypes = {
  collected?: number
  toBeCollect?: number
}

export default function RetailerLoanList({
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
    isValidating: loadingCashTransfers,
    mutate: mutateCashTransferList,
  } = useSWR<Paginated<CashTransferResponse>>(
    !caesarId
      ? null
      : `/cash-transfer?${objectToURLQuery({
          caesar: caesarId,
          // as: CashTransferAs.LOAN,
          // caesar_bank: caesarBankId,
          // loan: loanId,
          ...queryParameters,
        })}`,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
  )
  const isSender = useCallback(
    (cashTransfer: CashTransferResponse) =>
      !!(
        (caesarId && cashTransfer?.from?.id === caesarId) ||
        cashTransfer?.caesar_bank_from?.caesar.id === caesarId
      ),
    [caesarId]
  )

  const [loanToCollect, setLoanToCollect] = useState<LoanCollectTypes>({
    collected: undefined,
    toBeCollect: undefined,
  })

  const [loanData, setLoanData] = useState<CashTransferResponse>()

  useEffect(() => {
    if (cashTransfers) {
      setLoanToCollect((prev) => ({
        ...prev,
        collected: cashTransfers.data.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && ea.is_loan_paid
        ).length as number,
        toBeCollect: cashTransfers?.data.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && !ea.is_loan_paid
        ).length as number,
      }))
    }
  }, [cashTransfers])

  console.log('RETAILER TRANSACTIONS', cashTransfers)

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
                }}
              >
                Retailer Loan/s{' '}
              </span>{' '}
              to Pay
            </Typography>
          </Box>
          <Box my={2} />
          <Box my={2}>
            <Divider />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
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
            {/* <Grid item xs={6}>
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
            </Grid> */}
          </Grid>
          <Box
            my={2}
            style={{
              display: 'grid',
              gap: 8,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {cashTransfers &&
            loanToCollect &&
            loanToCollect?.toBeCollect &&
            loanToCollect.toBeCollect > 0 ? (
              <>
                {cashTransfers.data
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

                          <Typography>
                            {isSender(cashTransfer)
                              ? cashTransfer?.caesar_bank_to?.description ||
                                cashTransfer?.to?.description ||
                                'ERROR'
                              : cashTransfer?.caesar_bank_from?.description ||
                                cashTransfer?.from?.description ||
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
                              {formatIntoCurrency(cashTransfer.amount)}
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
        {creditToOtherDsp && (
          <DirectPaidModal
            open={creditToOtherDsp}
            handleClose={() => {
              setCreditToOtherDsp(false)
            }}
            loanData={loanData}
            triggeredRender={mutateCashTransferList}
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
