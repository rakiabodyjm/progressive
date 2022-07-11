import { Box, Grid, List, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import RoleBadge from '@src/components/RoleBadge'
import { formatIntoCurrency, objectToURLQuery } from '@src/utils/api/common'
import { CashTransferAs, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export default function CollectiblesSmallCards({ id, dsp_name }: { id: string; dsp_name: string }) {
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
    error: cashTransfersError,
    mutate: mutateCashTransferList,
  } = useSWR<Paginated<CashTransferResponse>>(
    !id
      ? null
      : `/cash-transfer?${objectToURLQuery({
          caesar: id,
          ...queryParameters,
        })}`,
    (url) => axios.get(url).then((res) => res.data)
  )

  const {
    data: externalCashTransfers,
    isValidating: loadingCashTransfers,
    error: errorCashTransfers,
    mutate: mutateRetailerLoanList,
  } = useSWR<CashTransferResponse[]>(
    id ? `/cash-transfer/get-retailer-loan?caesar=${id}` : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[])
  )

  const {
    data: externalCashTransfersLoad,
    isValidating: loadingCashTransfersLoad,
    error: errorCashTransfersLoad,
    mutate: mutateRetailerLoanListLoad,
  } = useSWR<CashTransferResponse[]>(
    id ? `/cash-transfer/get-retailer-load?caesar=${id}` : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[])
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

  return (
    <Box p={1.5}>
      <Box pb={2}>
        <RoleBadge disablePopUp>{dsp_name}</RoleBadge>
      </Box>
      <Box>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={4}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              <FormLabel>Unpaid Loans</FormLabel>
              <Typography variant="h4" style={{ fontWeight: '800' }}>
                {loanToCollect.toBeCollect || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={8}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              <FormLabel>Need To Collect</FormLabel>
              <Typography variant="h4" style={{ fontWeight: '800' }}>
                {formatIntoCurrency(
                  loanAndLoad.unpaid.reduce((prev, { total_amount }) => prev + total_amount, 0)
                )}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <List
        style={{
          display: 'grid',
          gap: 4,
          maxHeight: 640,
          overflowY: 'auto',
        }}
      ></List>
    </Box>
  )
}
