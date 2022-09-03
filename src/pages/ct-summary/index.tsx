import { Box, Container, Divider, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { makeStyles, useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { objectToURLQuery } from '@src/utils/api/common'
import { CaesarBank, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import React, { useState } from 'react'
import useSWR from 'swr'

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
  const [query, setQuery] = useState<{
    as?: string
    caesar_bank_from?: string
    caesar_bank_to?: string
    from?: string
    to?: string
  }>({
    as: undefined,
    caesar_bank_from: undefined,
    caesar_bank_to: undefined,
    from: undefined,
    to: undefined,
  })
  const { data: summaryTableData } = useSWR<Paginated<CashTransferResponse>>(
    `/cash-transfer?${objectToURLQuery({
      ...query,
    })}`,
    (url) => axios.get(url).then((res) => res.data)
  )

  const classes = useStyles()

  const [paginated, setPaginated] = useState({
    limit: 100,
    page: 0,
  })

  return (
    <Container>
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
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Paper variant="outlined" style={{ padding: 16 }}>
              <Grid container spacing={2} className={classes.gridContainer}>
                <Grid item sm={12} md={4} lg={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormLabel>Transaction Type</FormLabel>
                      <AsDropDown
                        onChange={(e) => {
                          if (e.target.value === '') {
                            setQuery((prev) => ({
                              ...prev,
                              as: undefined,
                            }))
                          } else {
                            setQuery((prev) => ({
                              ...prev,
                              as: e.target.value,
                            }))
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>

                    <Grid item xs={12}>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item sm={12} md={8} lg={9}>
                  {/* <CashTransferBalancesTable /> */}
                  {summaryTableData && summaryTableData.data && (
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
                            width: '40%',
                          },
                        },
                      }}
                      renderCell={{
                        from_bank_account: (value) => (
                          <Box display="flex" flexWrap="wrap">
                            {value && Array.isArray(value)
                              ? (value as CaesarBank[])
                                  ?.sort((ea1, ea2) => ea1.bank.name?.localeCompare(ea2.bank.name))
                                  .map((ea, index) => (
                                    <RoleBadge
                                      key={ea?.id || index}
                                      style={{
                                        marginTop: 4,
                                        marginRight: 4,
                                        borderRadius: '4em',
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                      }}
                                      disablePopUp
                                    >
                                      {ea.bank.name}
                                    </RoleBadge>
                                  ))
                              : null}
                          </Box>
                        ),
                        to_bank_account: (value) => (
                          <Box display="flex" flexWrap="wrap">
                            {value && Array.isArray(value)
                              ? (value as CaesarBank[])
                                  ?.sort((ea1, ea2) => ea1.bank.name?.localeCompare(ea2.bank.name))
                                  .map((ea, index) => (
                                    <RoleBadge
                                      key={ea?.id || index}
                                      style={{
                                        marginTop: 4,
                                        marginRight: 4,
                                        borderRadius: '4em',
                                        paddingLeft: 16,
                                        paddingRight: 16,
                                      }}
                                      disablePopUp
                                    >
                                      {ea.bank.name}
                                    </RoleBadge>
                                  ))
                              : null}
                          </Box>
                        ),
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
const formatSummaryTable = (param: CashTransferResponse[]) =>
  param.map(({ ref_num, as, description, amount, from, to, caesar_bank_from, caesar_bank_to }) => ({
    reference_number: ref_num,
    as,
    description,
    amount,
    from: from === null ? caesar_bank_from.description : from.description,
    from_bank_account: from === null ? caesar_bank_from.caesar.bank_accounts : from.bank_accounts,
    to: to === null ? caesar_bank_to.description : to.description,
    to_bank_account: to === null ? caesar_bank_to.caesar.bank_accounts : to.bank_accounts,
  }))
