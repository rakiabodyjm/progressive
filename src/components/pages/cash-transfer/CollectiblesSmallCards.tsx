import { Box, Grid, List, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import LoadingScreen, { LoadingScreen2 } from '@src/components/LoadingScreen'
import RoleBadge from '@src/components/RoleBadge'
import { formatIntoCurrency, objectToURLQuery } from '@src/utils/api/common'
import { CashTransferAs, CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
type NewDateType = {
  year: string
  month: string
  date: string
}

export default function CollectiblesSmallCards({
  id,
  dsp_name,
  setValue,
  date_from,
  date_to,
  dateEnabled,
}: {
  id: string
  dsp_name: string
  setValue: (totalAmount: number, totalInterest: number, stillLoading: boolean) => void
  date_from?: string
  date_to?: string
  dateEnabled: boolean
}) {
  const theme: Theme = useTheme()
  const [newDate, setNewDate] = useState<NewDateType>({
    year: '',
    date: '',
    month: '',
  })

  const computeDateYesterday = (yesterDayDate?: string) => {
    const date = new Date(yesterDayDate as string)
    const newD = `${date.getFullYear().toString()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${(date.getDate() - 1).toString().padStart(2, '0')}`
    return newD
  }
  const computeDateToday = (todayDate?: string) => {
    const date = new Date(todayDate as string)
    const newD = `${date.getFullYear().toString()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    return newD
  }

  const transactionDate = (transanctionDate?: string) => {
    const date = new Date(transanctionDate as string)
    const newD = `${date.getFullYear().toString()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
    return newD
  }
  const [queryParameters, setQueryParameters] = useState<{
    page: number
    limit: number
    date_from?: string
    date_to?: string
  }>({
    page: 0,
    limit: 100,
    date_from: undefined,
    date_to: undefined,
  })
  // ALL CASH TRANSFER
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
    (url) => axios.get(url).then((res) => res.data),
    { revalidateIfStale: true }
  )

  // RETAILER LOAN
  const {
    data: externalCashTransfers,
    isValidating: loadingCashTransfers,
    error: errorCashTransfers,
    mutate: mutateRetailerLoanList,
  } = useSWR<CashTransferResponse[]>(
    id
      ? `/cash-transfer/get-retailer-loan/${id}/search?date_from=${date_from}&date_to=${date_to}`
      : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[]),
    { revalidateIfStale: true }
  )

  // RETAILER LOAD
  const {
    data: externalCashTransfersLoad,
    isValidating: loadingCashTransfersLoad,
    error: errorCashTransfersLoad,
    mutate: mutateRetailerLoanListLoad,
  } = useSWR<CashTransferResponse[]>(
    id
      ? `/cash-transfer/get-retailer-load/${id}/search?date_from=${date_from}&date_to=${date_to}`
      : null,
    (url) => axios.get(url).then((res) => res.data as CashTransferResponse[]),
    { revalidateIfStale: true }
  )

  // AGGREGATED FUNCTIONS

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
      toBeCollect:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && !ea.is_loan_paid
        )?.length || 0,
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const collectionFromPrevious = useMemo(
    () => ({
      toCollectFromPrev:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
            !ea.is_loan_paid &&
            transactionDate(ea.created_at.toLocaleString()) !==
              computeDateToday(new Date(Date.now()).toDateString())
        ).length || 0,

      toCollectFromPrevAmount: aggreGatedCashTransfersWithLoad.filter(
        (ea) =>
          (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
          !ea.is_loan_paid &&
          transactionDate(ea.created_at.toLocaleString()) !==
            computeDateToday(new Date(Date.now()).toDateString())
      ),

      collectedPreviousDay:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
            ea.is_loan_paid &&
            transactionDate(ea.created_at?.toLocaleString()) !==
              computeDateToday(new Date(Date.now()).toDateString()) &&
            transactionDate(ea.updated_at.toLocaleString()) ===
              computeDateToday(new Date(Date.now()).toDateString())
        ).length || 0,

      collectedPrevDayAmount: aggreGatedCashTransfersWithLoad.filter(
        (ea) =>
          (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
          ea.is_loan_paid &&
          transactionDate(ea.created_at?.toLocaleString()) !==
            computeDateToday(new Date(Date.now()).toDateString()) &&
          transactionDate(ea.updated_at.toLocaleString()) ===
            computeDateToday(new Date(Date.now()).toDateString())
      ),
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const loanedToday = useMemo(
    () => ({
      loanedSameDay:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
            !ea.is_loan_paid &&
            transactionDate(ea.created_at.toLocaleString()) ===
              computeDateToday(new Date(Date.now()).toDateString())
        ).length || 0,
      loanedSameDayAmount: aggreGatedCashTransfersWithLoad.filter(
        (ea) =>
          (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
          !ea.is_loan_paid &&
          transactionDate(ea.created_at.toLocaleString()) ===
            computeDateToday(new Date(Date.now()).toDateString())
      ),
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const collectedToday = useMemo(
    () => ({
      collectedSameDay:
        aggreGatedCashTransfersWithLoad.filter(
          (ea) =>
            (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
            ea.is_loan_paid &&
            transactionDate(ea.created_at.toLocaleString()) ===
              computeDateToday(new Date(Date.now()).toDateString())
        ).length || 0,
      collectedSameDayAmount: aggreGatedCashTransfersWithLoad.filter(
        (ea) =>
          (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
          ea.is_loan_paid &&
          transactionDate(ea.created_at.toLocaleString()) ===
            computeDateToday(new Date(Date.now()).toDateString())
      ),
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
      totalCollection: aggreGatedCashTransfersWithLoad.filter(
        (ea) =>
          (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) &&
          ea.is_loan_paid &&
          transactionDate(ea.updated_at.toLocaleString()) ===
            computeDateToday(new Date(Date.now()).toDateString())
      ),
      totalCollectionWithDate: aggreGatedCashTransfersWithLoad.filter(
        (ea) => (ea.as === CashTransferAs.LOAN || ea.as === CashTransferAs.LOAD) && ea.is_loan_paid
      ),
    }),
    [aggreGatedCashTransfersWithLoad]
  )

  const totalCollectionAmount = loanAndLoad.totalCollection.reduce(
    (prev, { total_amount }) => prev + total_amount,
    0
  )
  const totalCollectionAmountWithDate = loanAndLoad.totalCollectionWithDate.reduce(
    (prev, { total_amount }) => prev + total_amount,
    0
  )
  const totalCollectionInterest =
    loanAndLoad.totalCollection.reduce((prev, { total_amount }) => prev + total_amount, 0) -
    loanAndLoad.totalCollection.reduce((prev, { amount }) => prev + amount, 0)

  const totalCollectionInterestWithDate =
    loanAndLoad.totalCollectionWithDate.reduce((prev, { total_amount }) => prev + total_amount, 0) -
    loanAndLoad.totalCollectionWithDate.reduce((prev, { amount }) => prev + amount, 0)

  useEffect(() => {
    if (dateEnabled) {
      setQueryParameters((prev) => ({
        ...prev,
        date_from: computeDateToday(date_from),
        date_to: computeDateToday(date_to),
      }))
    } else {
      setQueryParameters((prev) => ({
        ...prev,
        date_from: undefined,
        date_to: undefined,
      }))
    }
  }, [dateEnabled, date_from, date_to])

  useEffect(() => {
    if (
      !loadingCashTransfers &&
      !loadingCashTransfersLoad &&
      (totalCollectionAmount || totalCollectionAmountWithDate)
    ) {
      if (dateEnabled) {
        setValue(
          totalCollectionAmountWithDate,
          totalCollectionInterestWithDate,
          loadingCashTransfers
        )
      } else {
        setValue(totalCollectionAmount, totalCollectionInterest, loadingCashTransfers)
      }
    }
  }, [
    totalCollectionAmountWithDate,
    totalCollectionAmount,
    loadingCashTransfers,
    loadingCashTransfersLoad,
    dateEnabled,
  ])

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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Remaining Collection From Previous</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {dateEnabled ? 0 : collectionFromPrevious.toCollectFromPrev || 0}
                  </Typography>
                </>
              )}
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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Remaining Collection Amount</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? 0
                      : formatIntoCurrency(
                          collectionFromPrevious.toCollectFromPrevAmount.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Collected From Previous</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {dateEnabled ? 0 : collectionFromPrevious.collectedPreviousDay || 0}
                  </Typography>
                </>
              )}
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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Collected Amount From Previous</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? 0
                      : formatIntoCurrency(
                          collectionFromPrevious.collectedPrevDayAmount.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Loaned Today (same day)</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {dateEnabled ? 0 : loanedToday.loanedSameDay || 0}
                  </Typography>
                </>
              )}
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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Loaned Today Amount</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? 0
                      : formatIntoCurrency(
                          loanedToday.loanedSameDayAmount.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Collected Today (same day)</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {dateEnabled ? 0 : collectedToday.collectedSameDay || 0}
                  </Typography>
                </>
              )}
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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Collected Today Amount</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? 0
                      : formatIntoCurrency(
                          collectedToday.collectedSameDayAmount.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={12}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Total Collection Today</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? formatIntoCurrency(
                          loanAndLoad.totalCollectionWithDate.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )
                      : formatIntoCurrency(
                          loanAndLoad.totalCollection.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper
              style={{
                textAlign: 'center',
                height: '100%',
                padding: 16,
                background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
              }}
            >
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>Loan For Tomorrow</FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800' }}>
                    {dateEnabled ? 0 : loanToCollect.toBeCollect || 0}
                  </Typography>
                </>
              )}
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
              {loadingCashTransfers ? (
                <LoadingScreen2 />
              ) : (
                <>
                  <FormLabel>To be collect for tomorrow </FormLabel>
                  <Typography variant="h4" style={{ fontWeight: '800', overflow: 'hidden' }}>
                    {dateEnabled
                      ? 0
                      : formatIntoCurrency(
                          loanAndLoad.unpaid.reduce(
                            (prev, { total_amount }) => prev + total_amount,
                            0
                          )
                        )}
                  </Typography>
                </>
              )}
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
