import { Box, Theme, Typography, useTheme } from '@material-ui/core'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import UsersTable from '@src/components/UsersTable'
import { Inventory } from '@src/utils/api/inventoryApi'
import { getAllTransactions, TransactionResponse } from '@src/utils/api/transactionApi'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useEffect, useMemo, useState } from 'react'

type TransactionParameter = TransactionResponse &
  ReturnType<typeof reduceForAdmin> &
  ReturnType<typeof reduceForAccountType>

type IntersectionTransaction<T = TransactionParameter> = { [P in keyof T]?: T[P] | unknown }

const TransactionsTable = ({
  caesar,
  as,
  height,
}: {
  caesar?: string
  as?: 'admin' | 'all'
  height?: number
}) => {
  const [paginatedTransactions, setPaginatedTransactions] = useState<
    Paginated<TransactionResponse> | undefined
  >()
  const [paginationParams, setPaginationParams] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const transactions: IntersectionTransaction[] | undefined = useMemo(() => {
    if (paginatedTransactions?.data) {
      const transactions = paginatedTransactions.data
      switch (as) {
        case 'admin': {
          const adminCase = transactions.map((ea) => reduceForAdmin(ea)) as ReturnType<
            typeof reduceForAdmin
          >[]
          return adminCase
        }
        case 'all': {
          return transactions.map(reduceForAccountType) as ReturnType<typeof reduceForAccountType>[]
        }
        default: {
          return transactions as TransactionParameter[]
        }
      }
    }
    return undefined
  }, [paginatedTransactions, as])
  const transactionMetadata = useMemo(
    () => paginatedTransactions?.metadata || undefined,
    [paginatedTransactions]
  )
  const [loading, setLoading] = useState<boolean>(false)
  useEffect(() => {
    setLoading(true)

    getAllTransactions({
      ...paginationParams,
      ...(caesar && { caesar }),
    })
      .then(async (res) => ({
        ...res,
        data: await Promise.all(
          res.data.map(async (ea) => ({
            ...ea,
            buyer: await getWalletById(ea.buyer.id),
            seller: await getWalletById(ea.seller.id),
          }))
        ),
      }))
      .then((response) => {
        setPaginatedTransactions(response)
      })
      .then(() => {
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [caesar, paginationParams])
  const theme: Theme = useTheme()
  return (
    <>
      {!loading && transactions ? (
        <UsersTable<IntersectionTransaction>
          data={transactions}
          page={paginationParams.page || 0}
          limit={paginationParams.limit || 100}
          total={transactionMetadata?.total || 0}
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
            buyer: RenderBuyerOrSeller,
            seller: RenderBuyerOrSeller,
            inventory_from: (value) => (
              <Typography variant="body2">{(value as Inventory).name}</Typography>
            ),
            amount: (value) => (
              <Typography variant="body2">
                {value}{' '}
                <Typography color="primary" variant="body2" component="span">
                  CCoins
                </Typography>
              </Typography>
            ),
          }}
          paperProps={{
            style: {
              ...(height && { height }),
            },
          }}
        />
      ) : (
        <LoadingScreen2
          containerProps={{
            style: {
              height,
            },
          }}
        />
      )}
    </>
  )
}

const RenderBuyerOrSeller = (value: unknown) => {
  const caesar = value as CaesarWalletResponse
  return (
    <Box>
      <Typography variant="body2">
        <Typography display="block" component="span" color="primary" variant="body2">
          {caesar.account_type.toUpperCase()}
        </Typography>
        {caesar.description}
      </Typography>
    </Box>
  )
}

const reduceForAdmin = ({
  id,
  unit_price,
  selling_price,
  buying_account,
  selling_account,
  quantity,
  cost_price,
  sales_price,
  seller_profit,
  pending_purchase_id,
  created_at,
  updated_at,
  inventory_from,
  inventory_to,
  buyer,
  seller,
  approved,
}: TransactionResponse) => ({
  id,
  inventory_from,

  seller,

  unit_price,
  selling_price,

  seller_profit,

  // buying_account,
  buyer,

  transaction_date: `${new Date(created_at).toLocaleTimeString()} - ${new Date(
    created_at
  ).toLocaleDateString()} `,

  // approved: approved || false,
})

const reduceForAccountType = ({
  id,
  unit_price,
  selling_price,
  seller_profit,
  buying_account,
  selling_account,
  buyer,
  seller,
  inventory_from,
  created_at,
  sales_price,
}: TransactionResponse) => ({
  id,
  inventory_from,

  seller,

  // unit_price,
  // selling_price,

  buyer,
  // amount: `${sales_price} CCoins`,
  amount: sales_price,

  transaction_date: `${new Date(created_at).toLocaleTimeString()} - ${new Date(
    created_at
  ).toLocaleDateString()}`,
})

export default TransactionsTable
