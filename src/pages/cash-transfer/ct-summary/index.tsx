/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Box,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { ArrowBack, GetApp } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import EditOrRevertModal from '@src/components/pages/cash-transfer/EditOrRevertModal'
import EditTransactionModal from '@src/components/pages/cash-transfer/EditTransactionModal'
import RevertCashTransferModal from '@src/components/pages/cash-transfer/RevertCashTransferModal'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import UsersTable from '@src/components/UsersTable'
import { objectToURLQuery, extractMultipleErrorFromResponse } from '@src/utils/api/common'
import {
  CashTransferAs,
  CashTransferFilterTypes,
  CashTransferResponse,
  EditOrRevertTypes,
} from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useState } from 'react'
import useSWR from 'swr'
import { CSVLink } from 'react-csv'

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))

export default function CashTransferSummaryTable() {
  const theme: Theme = useTheme()
  const paperHeight = 600
  const router = useRouter()
  const [query, setQuery] = useState<{
    as?: string
    caesar_bank_from?: string
    caesar_bank_to?: string
    from?: string
    to?: string
  }>({
    as: '',
    caesar_bank_from: undefined,
    caesar_bank_to: undefined,
    from: undefined,
    to: undefined,
  })

  const [formQuery, setFormQuery] = useState<CashTransferFilterTypes>({
    as: undefined,
    date_from: undefined,
    date_to: undefined,
  })
  const [paginated, setPaginated] = useState({
    limit: 100,
    page: 0,
  })

  const {
    data: summaryTableData,
    mutate,
    isValidating,
  } = useSWR<Paginated<CashTransferResponse>>(
    `/cash-transfer?${objectToURLQuery({
      ...query,
      ...formQuery,
    })}`,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
  )
  const [revertModal, setRevertModal] = useState<boolean>(false)
  const [ct_id, setCTID] = useState('')

  const classes = useStyles()

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [fromCaesarEnabled, setFromCaesarEnabled] = useState<boolean>(false)

  const [transactionModal, setTransactionModal] = useState<{
    transactionModalOpen: boolean
    transactionSelected?: EditOrRevertTypes
  }>({
    transactionModalOpen: false,
    transactionSelected: undefined,
  })

  const newDate = new Date(Date.now()).toLocaleDateString()

  const csvLinkFormat = {
    filename: query.as ? `${query.as}-Reports_${newDate}.csv` : `Summary-Reports_${newDate}.csv`,
    headers,
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormQuery((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <>
      <Paper variant="outlined">
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h4">Cash Transfer Summary Table</Typography>
              <Typography variant="body2" color="primary">
                This section the admin can see all of the transactions in all users
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row-reverse">
            <Box>
              <Tooltip
                arrow
                placement="left"
                title={<Typography variant="subtitle2">Back</Typography>}
              >
                <IconButton
                  onClick={() => {
                    router.push({
                      pathname: '/cash-transfer',
                    })
                  }}
                >
                  <ArrowBack color="primary" />
                </IconButton>
              </Tooltip>
            </Box>
            {summaryTableData && summaryTableData.data && (
              <Box>
                <Tooltip
                  arrow
                  placement="left"
                  title={<Typography variant="subtitle2">Export to CSV</Typography>}
                >
                  <CSVLink data={formatToCsv(summaryTableData?.data)} {...csvLinkFormat}>
                    <IconButton>
                      <GetApp color="primary" />
                    </IconButton>
                  </CSVLink>
                </Tooltip>
              </Box>
            )}
          </Box>
          <Box textAlign="end"></Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Paper variant="outlined" style={{ padding: 16 }}>
              <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4} md={3} lg={2}>
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
                    <Grid item xs={12} sm={4} md={3} lg={2}>
                      {fromCaesarEnabled ? (
                        <>
                          <FormLabel>From Caesar Account</FormLabel>
                          <ToCaesarAutoComplete
                            onChange={(cFrom) => {
                              if (!cFrom) {
                                setQuery((prev) => ({
                                  ...prev,
                                  from: undefined,
                                }))
                              } else {
                                setQuery((prev) => ({
                                  ...prev,
                                  from: cFrom.id,
                                }))
                              }
                            }}
                          ></ToCaesarAutoComplete>
                        </>
                      ) : (
                        <>
                          <FormLabel>From Caesar Bank Account</FormLabel>
                          <ToCaesarBankAutoComplete
                            onChange={(cBFrom) => {
                              if (!cBFrom) {
                                setQuery((prev) => ({
                                  ...prev,
                                  caesar_bank_from: undefined,
                                }))
                              } else {
                                setQuery((prev) => ({
                                  ...prev,
                                  caesar_bank_from: cBFrom.id,
                                }))
                              }
                            }}
                          ></ToCaesarBankAutoComplete>
                        </>
                      )}
                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          <Typography variant="subtitle2">Switch Source Account Type</Typography>
                        }
                      >
                        <Link
                          component="button"
                          color="textSecondary"
                          variant="caption"
                          onClick={() => {
                            if (fromCaesarEnabled) {
                              setFromCaesarEnabled(false)
                            } else {
                              setFromCaesarEnabled(true)
                            }
                          }}
                        >
                          {fromCaesarEnabled
                            ? 'Use Bank Account instead'
                            : 'Use Caesar Account instead'}
                        </Link>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={2}>
                      {toCaesarEnabled ? (
                        <>
                          <FormLabel>To Caesar Account</FormLabel>
                          <ToCaesarAutoComplete
                            onChange={(cTo) => {
                              if (!cTo) {
                                setQuery((prev) => ({
                                  ...prev,
                                  to: undefined,
                                }))
                              } else {
                                setQuery((prev) => ({
                                  ...prev,
                                  to: cTo.id,
                                }))
                              }
                            }}
                          ></ToCaesarAutoComplete>
                        </>
                      ) : (
                        <>
                          <FormLabel>To Caesar Bank Account</FormLabel>
                          <ToCaesarBankAutoComplete
                            onChange={(cBTo) => {
                              if (!cBTo) {
                                setQuery((prev) => ({
                                  ...prev,
                                  caesar_bank_to: undefined,
                                }))
                              } else {
                                setQuery((prev) => ({
                                  ...prev,
                                  caesar_bank_to: cBTo.id,
                                }))
                              }
                            }}
                          ></ToCaesarBankAutoComplete>
                        </>
                      )}
                      <Tooltip
                        arrow
                        placement="right"
                        title={
                          <Typography variant="subtitle2">
                            Switch Destination Account Type
                          </Typography>
                        }
                      >
                        <Link
                          component="button"
                          color="textSecondary"
                          variant="caption"
                          onClick={() => {
                            if (toCaesarEnabled) {
                              setToCaesarEnabled(false)
                            } else {
                              setToCaesarEnabled(true)
                            }
                          }}
                        >
                          {toCaesarEnabled
                            ? 'Use Bank Account instead'
                            : 'Use Caesar Account instead'}
                        </Link>
                      </Tooltip>
                    </Grid>
                    <Grid item xs={12} sm={4} lg={2}>
                      <FormLabel>Date From</FormLabel>
                      <FormTextField
                        type="date"
                        name="date_from"
                        size="small"
                        value={formQuery.date_from}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} lg={2}>
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
                </Grid>
              </Grid>
              <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item xs={12}>
                  {/* <CashTransferBalancesTable /> */}
                  {summaryTableData && summaryTableData.data && !isValidating ? (
                    <UsersTable
                      data={formatSummaryTable(summaryTableData.data)}
                      page={paginated.page}
                      limit={paginated.limit}
                      setPage={(page: number) => {
                        setPaginated((prev) => ({
                          ...prev,
                          page,
                        }))
                      }}
                      setLimit={(limit: number) => {
                        setPaginated((prev) => ({
                          ...prev,
                          limit,
                        }))
                      }}
                      paperProps={{
                        style: {
                          ...(paperHeight && { height: paperHeight! - 50 }),
                        },
                      }}
                      total={summaryTableData.metadata.total}
                      hiddenFields={['id', 'deleted_at', 'created_at', 'updated_at']}
                      tableHeadProps={{
                        style: {
                          position: 'sticky',
                          top: 0,
                          background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                        },
                      }}
                      tableCellProps={{
                        reference_number: {
                          style: {
                            width: '20%',
                          },
                        },
                      }}
                      // renderCell={
                      // {
                      // from_bank_account: (value) => (
                      //   <Box display="flex" flexWrap="wrap">
                      //     {value && Array.isArray(value)
                      //       ? (value as CaesarBank[])
                      //           ?.sort((ea1, ea2) => ea1.bank.name?.localeCompare(ea2.bank.name))
                      //           .map((ea, index) => (
                      //             <RoleBadge
                      //               key={ea?.id || index}
                      //               style={{
                      //                 marginTop: 4,
                      //                 marginRight: 4,
                      //                 borderRadius: '4em',
                      //                 paddingLeft: 16,
                      //                 paddingRight: 16,
                      //               }}
                      //               disablePopUp
                      //             >
                      //               {ea.bank.name}
                      //             </RoleBadge>
                      //           ))
                      //       : null}
                      //   </Box>
                      // ),
                      // to_bank_account: (value) => (
                      //   <Box display="flex" flexWrap="wrap">
                      //     {value && Array.isArray(value)
                      //       ? (value as CaesarBank[])
                      //           ?.sort((ea1, ea2) => ea1.bank.name?.localeCompare(ea2.bank.name))
                      //           .map((ea, index) => (
                      //             <RoleBadge
                      //               key={ea?.id || index}
                      //               style={{
                      //                 marginTop: 4,
                      //                 marginRight: 4,
                      //                 borderRadius: '4em',
                      //                 paddingLeft: 16,
                      //                 paddingRight: 16,
                      //               }}
                      //               disablePopUp
                      //             >
                      //               {ea.bank.name}
                      //             </RoleBadge>
                      //           ))
                      //       : null}
                      //   </Box>
                      // ),
                      // }
                      // }
                      // renderRow={({ amount, description, as, from, to, reference_number }) => (
                      //   <>
                      //     <Box>
                      //       <Paper>
                      //         <Box p={2}>
                      //           <Typography>{amount}</Typography>
                      //         </Box>
                      //       </Paper>
                      //     </Box>
                      //   </>
                      // )}
                      onRowClick={(rowData, data) => {
                        setRevertModal(true)
                        setCTID(data.reference_number)
                      }}
                    />
                  ) : (
                    <LoadingScreen2 />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Paper>
      {revertModal && (
        <EditOrRevertModal
          open={revertModal}
          onClose={() => {
            setRevertModal(false)
          }}
          selected={(selected) => {
            setTransactionModal((prev) => ({
              ...prev,
              transactionSelected: selected,
            }))
            setTransactionModal((prev) => ({
              ...prev,
              transactionModalOpen: true,
            }))
          }}
        />
      )}
      {transactionModal.transactionSelected === EditOrRevertTypes.REVERT &&
        transactionModal.transactionModalOpen && (
          <RevertCashTransferModal
            open={revertModal}
            onClose={() => {
              setRevertModal(false)
              setTransactionModal((prev) => ({
                ...prev,
                transactionModalOpen: false,
              }))
            }}
            ct_id={ct_id}
            triggerRender={mutate}
          />
        )}
      {transactionModal.transactionSelected === EditOrRevertTypes.EDIT &&
        transactionModal.transactionModalOpen && (
          <EditTransactionModal
            open={revertModal}
            onClose={() => {
              setRevertModal(false)
              setTransactionModal((prev) => ({
                ...prev,
                transactionModalOpen: false,
              }))
            }}
            ct_id={ct_id}
            mutate={mutate}
          />
        )}
    </>
  )
}
const formatToCsv = (param: CashTransferResponse[]) =>
  param.map(
    ({
      original_created_at,
      as,
      from,
      amount,
      to,
      caesar_bank_from,
      caesar_bank_to,
      created_at,
      is_loan_paid,
      total_amount,
      remaining_balance_to,
      updated_at,
      bank_charge,
    }) => ({
      sender_bank: caesar_bank_from?.bank.name || `${from.description} - CAESAR`,
      date_posting: original_created_at && new Date(original_created_at).toLocaleDateString(),
      type: as,
      med_used: caesar_bank_to?.bank.name || 'CAESAR',
      sender: caesar_bank_from?.description || `${from.description} - CAESAR`,
      sender_account: caesar_bank_from ? `'${caesar_bank_from?.account_number}` : '',
      // : `'${from?.data?.cp_number}`,
      receiver: caesar_bank_to?.description || `${to.description} - CAESAR`,
      receiver_account: caesar_bank_to ? `'${caesar_bank_to?.account_number}` : '',
      // : `'${to?.data?.cp_number}`,
      amount,
      transact_time: new Date(created_at).toLocaleTimeString(),
      requested_by: caesar_bank_to?.description || to.description,
      one_percent: as === CashTransferAs.LOAN ? total_amount : '',
      status: as === CashTransferAs.LOAN ? (is_loan_paid ? 'PAID' : 'CREDIT') : '',
      date_transact: original_created_at && new Date(original_created_at).toLocaleDateString(),
      date_paid: is_loan_paid ? updated_at && new Date(updated_at).toLocaleDateString() : '',
      time_paid: is_loan_paid ? new Date(updated_at).toLocaleTimeString() : '',
      receiver_bank: caesar_bank_to?.bank.name || 'Cash On Hand',
      remaining_balance: remaining_balance_to,
      bank_fee: bank_charge,
    })
  )

const headers = [
  {
    label: 'Posting Date',
    key: 'date_posting',
  },
  {
    label: 'Description',
    key: 'sender_bank',
  },
  {
    label: 'Transaction Type',
    key: 'type',
  },
  {
    label: 'Transfer',
    key: 'med_used',
  },
  {
    label: 'Sender Name',
    key: 'sender',
  },
  {
    label: 'Account Number',
    key: 'sender_account',
  },
  {
    label: 'Receiver Name',
    key: 'receiver',
  },
  {
    label: 'Account Number',
    key: 'receiver_account',
  },
  {
    label: 'Amount',
    key: 'amount',
  },
  {
    label: 'Bank Fee',
    key: 'bank_fee',
  },
  {
    label: 'Requested By',
    key: 'requested_by',
  },
  {
    label: '1%',
    key: 'one_percent',
  },
  {
    label: '2%',
    key: 'two_percent',
  },
  {
    label: 'Status',
    key: 'status',
  },
  {
    label: 'Transaction Date',
    key: 'date_transact',
  },
  {
    label: 'Time',
    key: 'transact_time',
  },
  {
    label: 'Payment Date',
    key: 'date_paid',
  },
  {
    label: 'Time',
    key: 'time_paid',
  },
  {
    label: 'Transaction',
    key: 'receiver_bank',
  },
  {
    label: 'Running Balance',
    key: 'remaining_balance',
  },
]

const formatSummaryTable = (param: CashTransferResponse[]) =>
  param.map(
    ({
      ref_num,
      as,
      description,
      amount,
      from,
      to,
      caesar_bank_from,
      caesar_bank_to,
      bank_charge,
    }) => ({
      reference_number: ref_num,
      as,
      description: description || '<No Description>',
      amount,
      bank_charge,
      from: from?.description || caesar_bank_from?.description || 'error',
      to: to?.description || caesar_bank_to?.description || 'error',
    })
  )
