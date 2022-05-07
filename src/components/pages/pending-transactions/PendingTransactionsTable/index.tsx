import { Box, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import PendingTransactionsApprovalModal from '@src/components/pages/pending-transactions/PendingTransactionsTable/PendingTransactionsApprovalModal'
import PendingTransactionsRoleSelector from '@src/components/pages/pending-transactions/PendingTransactionsTable/PendingTransactionsRoleSelector'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { UserTypes } from '@src/redux/data/userSlice'
import { Inventory } from '@src/utils/api/inventoryApi'
import { getAllPendingTransactions } from '@src/utils/api/pendingTransactionApi'
import { PendingTransactionResponse } from '@src/utils/api/transactionApi'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useMemo, useState } from 'react'
import useSWR from 'swr'

export default function PendingTransactionsTable({
  as,
  caesar,
  height,
}: {
  as?: UserTypes
  caesar?: string
  height?: number
}) {
  const theme: Theme = useTheme()
  const [action, setAction] = useState<'seller' | 'buyer'>('buyer')
  //   useEffect(() => {}, [])
  const [paginationParams, setPaginationParams] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const [selectedPendingTransaction, setSelectedPendingTransaction] = useState<null | string>(null)

  const { data: pendingTransactionsFetch, isValidating: loading } = useSWR(
    [
      {
        ...paginationParams,
        ...(as !== 'admin' && {
          ...(action === 'seller' &&
            caesar && {
              caesar_seller: caesar,
            }),
          ...(action === 'buyer' &&
            caesar && {
              caesar_buyer: caesar,
            }),
        }),
      },
    ],
    (...params) =>
      getAllPendingTransactions(...params)
        .then((res) => {
          switch (as) {
            case 'admin': {
              return {
                ...res,
                data: res.data.map((ea) => reduceForAdmin(ea)),
              }
            }
            default: {
              return {
                ...res,
                data: res.data.map((ea) => reduceForAdmin(ea)),
              }
            }
          }
        })
        .catch((err) => {
          console.log('Failed fetching pending transactions', err)
          return undefined
        }),
    {
      refreshInterval: 60000,
    }
  )

  const { data: pendingTransactions, metadata: pendingTransactionsMetadata } = useMemo(
    () => pendingTransactionsFetch || { data: [], metadata: undefined },
    [pendingTransactionsFetch]
  )

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {pendingTransactions && (
        <>
          <Box
            style={{
              margin: 'auto',
              // width: 'max-content',
              padding: `8px 24px`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography
              style={{
                marginBottom: 8,
              }}
              variant="body1"
              color="primary"
            >
              Show Pending Transactions As:
            </Typography>
            <PendingTransactionsRoleSelector action={action} setAction={setAction} />
          </Box>
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
            total={pendingTransactionsMetadata?.total || 0}
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
              seller: (value) => (
                <Typography variant="body2">
                  {(value as CaesarWalletResponse).description}
                </Typography>
              ),
              buyer: (value) => (
                <Typography variant="body2">
                  {(value as CaesarWalletResponse).description}
                </Typography>
              ),
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
            onRowClick={(_, value) => {
              setSelectedPendingTransaction(value.id)
            }}
          />
        </>
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
          action={as === 'admin' ? 'admin' : action}
          open={!!selectedPendingTransaction}
          pendingTransaction={selectedPendingTransaction}
          onClose={() => {
            setSelectedPendingTransaction(null)
          }}
        />
      )}
    </div>
  )
}

const reduceForAdmin = ({
  id,
  approved,
  quantity,
  inventory,
  caesar_buyer,
  caesar_seller,
  created_at,
  pending_purchase_id,
}: PendingTransactionResponse) => ({
  id,
  inventory,
  quantity,
  buyer: caesar_buyer,
  seller: caesar_seller,

  approved,

  reference_id: pending_purchase_id,
  pending_date: `${new Date(created_at).toLocaleTimeString()} - ${new Date(
    created_at
  ).toLocaleDateString()}`,
})

PendingTransactionsTable.defaultProps = {
  as: 'all',
}
