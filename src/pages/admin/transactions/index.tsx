import {
  Box,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Menu,
  Paper,
  TablePagination,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { CheckCircleOutline, HighlightOff, MoreVert } from '@material-ui/icons'
import LoadingScreen from '@src/components/LoadingScreen'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { userDataSelector } from '@src/redux/data/userSlice'
import { Inventory } from '@src/utils/api/inventoryApi'
import { getAllTransactions, TransactionResponse } from '@src/utils/api/transactionApi'
import { CaesarWalletResponse, getWallet, getWalletById } from '@src/utils/api/walletApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
type TransactionParameter = TransactionResponse & ReturnType<typeof reduceForAdmin>
type IntersectionTransaction<T = TransactionParameter> = { [P in keyof T]?: T[P] | unknown }

const AdminTransactionsPage = () => {
  const user = useSelector(userDataSelector)
  const moreAnchorEl = useRef<HTMLElement | undefined>()

  return (
    <Container>
      <Paper>
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              {user?.admin_id && <RoleBadge uppercase>Admin</RoleBadge>}
              <Typography noWrap color="textSecondary" variant="h6">
                {user?.first_name}
              </Typography>
              <Typography variant="h4">Transactions</Typography>
              <Typography variant="body2" color="primary">
                Transactions of Subdistributor | DSP | Retailers
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={() => {}} innerRef={moreAnchorEl}>
                <MoreVert />
              </IconButton>
              <Menu anchorEl={moreAnchorEl.current} open={false}></Menu>
            </Box>
            {/* <Box>
              <TransactionsTable />
            </Box> */}
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Box>
              {/* <Paper>{transactions && transactions.map((ea) => JSON.stringify(ea))}</Paper> */}
              <TransactionsTable as="admin" />
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

// type TransactionsTableTypes<T> =
//   | Array<T extends 'admin' ? ReturnType<typeof reduceForAdmin> : TransactionResponse>
//   | undefined

const TransactionsTable = ({
  caesar,
  as,
}: {
  caesar?: string
  as?: 'seller' | 'buyer' | 'admin'
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
        default: {
          return transactions as TransactionParameter[]
        }
      }
    }
    return undefined

    // paginatedTransactions?.data || undefined
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
      <Box>
        {!loading && transactions && (
          <UsersTable<IntersectionTransaction>
            data={transactions.sort(
              (a, b) =>
                new Date(a.transaction_date as Date).getTime() +
                new Date(b.transaction_date as Date).getTime()
            )}
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
              transaction_date: (value: unknown) => (
                <Typography>
                  {`${new Date(value as string).toLocaleTimeString()} - ${new Date(
                    value as string
                  ).toLocaleDateString()} `}
                </Typography>
              ),
              approved: (value) => (
                <Box display="flex" alignItems="center" justifyContent="center">
                  {(!value as boolean) ? (
                    <CheckCircleOutline className="success" />
                  ) : (
                    <HighlightOff className="error" />
                  )}
                </Box>
              ),
              buyer: RenderBuyerOrSeller,
              seller: RenderBuyerOrSeller,
            }}

            // formatTitle={}
            // hiddenFields={['inventory_from']}
          />
        )}

        {loading && (
          <Paper variant="outlined">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={1}
            >
              <LoadingScreen
                style={{
                  height: 320,
                }}
              />
            </Box>
          </Paper>
        )}

        {/* <TablePagination
          rowsPerPageOptions={[20, 50, 100, 200]}
          count={transactionMetadata?.total || 0}
          rowsPerPage={transactionMetadata?.limit || 20}
          page={transactionMetadata?.page || 0}
          onPageChange={(_, page) => {
            setPaginationParams((prev) => ({
              ...prev,
              page,
            }))
          }}
          onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setPaginationParams((prev) => ({
              ...prev,
              limit: Number(e.target.value),
            }))
          }}
          component="div"
        /> */}
      </Box>
      <style>{`
        .success{
          color: ${theme.palette.success.main};
        }
        .error{
          color: ${theme.palette.error.main}
        }
      `}</style>
    </>
  )
}

const RenderBuyerOrSeller = (value: unknown) => {
  const caesar = value as CaesarWalletResponse
  return (
    <Box>
      <RoleBadge variant="caption" disablePopUp uppercase>
        {caesar.account_type}
      </RoleBadge>
      <Typography variant="body1">{caesar.description}</Typography>
    </Box>
  )
}

// const TransactionRow = ({ transaction }: { transaction: Partial<>TransactionResponse }) => (
//   <Box>
//     <Typography></Typography>
//   </Box>
// )

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
  unit_price,
  selling_price,

  seller_profit,

  // buying_account,
  buyer,

  // selling_account,
  seller,

  transaction_date: created_at,

  approved: approved || false,
})
export default AdminTransactionsPage
