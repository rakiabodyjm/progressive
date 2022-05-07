import { Box, Container, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { Inventory } from '@src/utils/api/inventoryApi'
import { getAllPendingTransactions } from '@src/utils/api/pendingTransactionApi'
import { PendingTransactionResponse } from '@src/utils/api/transactionApi'
import { getWallet } from '@src/utils/api/walletApi'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import useFetchPendingTransaction from '@src/pages/notification/useFetchPendingTransactions'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import { LoadingScreen2 } from '../LoadingScreen'
import PendingTransactionsApprovalModal from '../pages/pending-transactions/PendingTransactionsTable/PendingTransactionsApprovalModal'
import RoleBadge from '../RoleBadge'

export default function NotificationPageTable({
  height,
  as,
  caesar,
}: {
  as?: UserTypes
  caesar?: string
  height?: number
}) {
  const user = useSelector(userDataSelector)
  // const [caesarTypes, setCaesarTypes] = useState<[UserTypes, string] | undefined>([])
  const theme: Theme = useTheme()
  const [selectedPendingTransaction, setSelectedPendingTransaction] = useState<null | string>(null)
  const [paginationParams, setPaginationParams] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const { fetchPendingTransaction, loading } = useFetchPendingTransaction({
    as,
    caesar,
    action: 'buyer',
  })

  const { data: pendingTransactions, metadata: pendingTransactionsMetadata } = useMemo(
    () => fetchPendingTransaction || { data: [], metadata: undefined },
    [fetchPendingTransaction]
  )

  return (
    <Container>
      <Box>
        {pendingTransactions && (
          <UsersTable
            paperProps={{
              style: {
                marginTop: 16,
                ...(height && { height }),
              },
            }}
            data={pendingTransactions}
            page={paginationParams.page || 0}
            limit={paginationParams.limit || 100}
            total={0}
            setLimit={(limit: number) => {
              setPaginationParams((prev) => ({
                ...prev,
                limit,
              }))
            }}
            setPage={(page: number) => {
              setPaginationParams((prev) => ({
                ...prev,
                page,
              }))
            }}
            renderCell={{
              inventory: (value) => (
                <Typography variant="body2">{(value as Inventory).name}</Typography>
              ),
              approved: (value) => {
                const val: boolean = value as boolean
                return (
                  <Typography variant="h6">
                    {val ? (
                      <>
                        <RoleBadge disablePopUp>APPROVED</RoleBadge>
                      </>
                    ) : (
                      <>
                        <RoleBadge disablePopUp>PENDING</RoleBadge>
                      </>
                    )}
                  </Typography>
                )
              },
            }}
          />
        )}
        {loading && (
          <Paper
            style={{
              height: '100%',
              overflow: 'hidden',
              position: 'absolute',
              top: -1,
              left: -1,
              bottom: -1,
              right: -1,
              background: 'transparent',
              borderRadius: theme.shape.borderRadius,
            }}
            variant="outlined"
          >
            <LoadingScreen2
              containerProps={{
                margin: 'auto',
                style: {
                  opacity: 0.8,
                  height: '100%',
                },
              }}
            />
          </Paper>
        )}
        {!!selectedPendingTransaction && (
          <PendingTransactionsApprovalModal
            action={as === 'admin' ? 'admin' : 'seller'}
            open={!!selectedPendingTransaction}
            pendingTransaction={selectedPendingTransaction}
            onClose={() => {
              setSelectedPendingTransaction(null)
            }}
          />
        )}
      </Box>
    </Container>
  )
}
