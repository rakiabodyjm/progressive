/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */
import { Box, Grid, ListItem, Paper, TablePagination, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import CashTransferDetailsModal from '@src/components/pages/cash-transfer/CashTransferDetailsModal'
import LoanDetailsModal from '@src/components/pages/cash-transfer/LoanDetailsModal'
import { formatIntoCurrency, objectToURLQuery } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferFilterTypes,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import useSWR from 'swr'
type NewDateType = {
  year: string
  month: string
  date: string
  // hour: string
  // minutes: string
}

type TransferTypeModal = {
  open: boolean
  transferData?: CashTransferResponse
}

export default function CashTransferList({
  caesarId,
  caesarBankId,
  loanId,
  triggerMutate,
}: {
  caesarId?: CaesarWalletResponse['id']
  caesarBankId?: CaesarBank['id']
  loanId?: CashTransferResponse['id']
  triggerMutate?: boolean
}) {
  const [queryParameters, setQueryParameters] = useState<{
    page: number
    limit: number
  }>({
    page: 0,
    limit: 100,
  })

  const [formQuery, setFormQuery] = useState<CashTransferFilterTypes>({
    as: undefined,
    date_from: undefined,
    date_to: undefined,
  })
  const [newDate, setNewDate] = useState<NewDateType>({
    year: '',
    date: '',
    month: '',
    // hour: '',
    // minutes: '',
  })
  const [convertedDate, setConvertedDate] = useState<string>()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormQuery((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const {
    data: cashTransfers,
    isValidating: loadingCashTransfers,
    error: errorCashTransfers,
    mutate: triggerRender,
  } = useSWR(
    caesarId || caesarBankId || loanId || formQuery
      ? `/cash-transfer?${objectToURLQuery({
          ...queryParameters,
          caesar: caesarId,
          caesar_bank: caesarBankId,
          loan: loanId,
          ...formQuery,
        })}`
      : null,
    (url) =>
      axios
        .get(url, {
          // params: {
          //   caesar: caesarId,
          //   caesar_bank: caesarBankId,
          //   loan: loanId,
          //   ...queryParameters,
          // },
        })
        .then((res) => res.data as Paginated<CashTransferResponse>)
        .catch((err) => {
          console.log('failed loading cash-transfers', err)
        })
  )

  const isSender = useCallback(
    (cashTransfer: CashTransferResponse) =>
      !!(
        (caesarBankId && cashTransfer?.caesar_bank_from?.id === caesarBankId) ||
        (caesarId && cashTransfer?.from?.id === caesarId) ||
        cashTransfer?.caesar_bank_from?.caesar.id === caesarId
      ),
    [caesarId, caesarBankId]
  )
  const theme: Theme = useTheme()
  const router = useRouter()

  useEffect(() => {
    triggerRender()
  }, [triggerMutate])

  const [loanModal, setLoanModal] = useState<TransferTypeModal>({
    open: false,
  })
  const [transferModal, setTransferModal] = useState<TransferTypeModal>({
    open: false,
  })
  return (
    <>
      <Paper
        style={{
          marginBottom: 8,
          background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
          padding: 8,
        }}
      >
        <Box p={1}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={4}>
              <FormLabel>Transaction Type</FormLabel>
              <AsDropDown
                onChange={(e) => {
                  if (e.target.value === '') {
                    setFormQuery((prev) => ({
                      ...prev,
                      as: undefined,
                    }))
                  } else {
                    setFormQuery((prev) => ({
                      ...prev,
                      as: e.target.value,
                    }))
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Date From</FormLabel>
              <FormTextField
                type="date"
                name="date_from"
                size="small"
                value={formQuery.date_from}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel>Date To</FormLabel>
              <FormTextField
                type="date"
                name="date_to"
                size="small"
                value={formQuery.date_to}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      <Box
        style={{
          display: 'grid',
          gap: 8,
          maxHeight: 400,
          overflowY: 'auto',
        }}
      >
        {!errorCashTransfers && cashTransfers?.data && cashTransfers?.data.length > 0 ? (
          <>
            {cashTransfers.data.map((cashTransfer) => (
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
                  button
                  onClick={
                    cashTransfer.as === CashTransferAs.LOAN_PAYMENT
                      ? () => {
                          router.push(`/cash-transfer/loan/${cashTransfer.loan?.id}`)
                        }
                      : cashTransfer.as === CashTransferAs.LOAN
                      ? () => {
                          setLoanModal({
                            open: true,
                            transferData: cashTransfer,
                          })
                        }
                      : () => {
                          setTransferModal({
                            open: true,
                            transferData: cashTransfer,
                          })
                        }
                  }
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
                    {/* {cashTransfer?.to?.description ||
                      cashTransfer?.caesar_bank_to?.description ||
                      'ERROR'} */}
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
                        Sender's Bank Fee:
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

                    {}
                  </Box>
                </ListItem>
              </Paper>
            ))}
            {transferModal.open && (
              <CashTransferDetailsModal
                open={transferModal.open}
                onClose={() => {
                  setTransferModal({
                    open: false,
                  })
                }}
                cashTransferData={transferModal.transferData}
              />
            )}
            {loanModal.open && (
              <LoanDetailsModal
                open={loanModal.open}
                onClose={() => {
                  setLoanModal({
                    open: false,
                  })
                }}
                loanData={loanModal.transferData}
              />
            )}
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
              No Recent Transactions
            </Typography>
          </Paper>
        )}
      </Box>

      <Box pt={2}>
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
      </Box>
    </>
  )
}
