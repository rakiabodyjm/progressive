/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  TablePagination,
  TextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CaesarBankLinking from '@src/components/pages/bank/CaesarBankLinking'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { formatIntoCurrency } from '@src/utils/api/common'
import {
  CaesarWalletResponse,
  getAllWallet,
  getWallet,
  searchWalletV2,
} from '@src/utils/api/walletApi'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import useNotification from '@src/utils/hooks/useNotification'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

export default function CaesarIndexPage() {
  const { account, data: currentCaesar, loading } = useGetCaesarOfUser()
  // useEffect(() => {
  //   console.log('usegetcaesarofuser', loading, account, data)
  // }, [account, data, loading])

  // const [caesarButtonTrigger, setCaesarButtonTrigger] = useState(Date.now())
  const router = useRouter()

  // const searchQuery = useState<undefined | string>('')
  const [query, setQuery] = useState<PaginateFetchParameters & { searchQuery?: string }>({
    limit: 100,
    page: 0,
    searchQuery: undefined,
  })
  const setQueryState = useCallback(
    (param: keyof typeof query) => (value: typeof query[keyof typeof query]) => {
      setQuery((prev) => ({
        ...prev,
        [param]: value,
      }))
    },
    []
  )

  const formatter = useCallback(
    (param: CaesarWalletResponse[]) =>
      param.map(({ id, description, account_type, cash_transfer_balance, bank_accounts }) => ({
        id,
        name: description,
        account_type,
        bank_accounts: bank_accounts.map((ea) => ea.bank.name).join(' '),
        balance: formatIntoCurrency(cash_transfer_balance),
        bank_balances: formatIntoCurrency(bank_accounts.reduce((acc, ea) => acc + ea.balance, 0)),
      })),
    []
  )
  const fetcher = useCallback(
    () =>
      searchWalletV2(query).then(async (res) => ({
        metadata: res.metadata,
        data: formatter(res.data),
      })),
    [query, formatter]
  )

  const { data: paginatedCaesar, isValidating, error } = useSWR(['/caesar', query], fetcher)
  const caesars = useMemo(() => paginatedCaesar?.data || undefined, [paginatedCaesar])

  const ceasarMetaData = useMemo(() => paginatedCaesar?.metadata || undefined, [paginatedCaesar])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const user = useSelector(userDataSelector)
  const dispatchNotif = useNotification()
  useEffect(() => {
    if (user && user?.roles) {
      if (![...user.roles].some((ea) => ['ct-operator', 'ct-admin'].includes(ea))) {
        router.push('/')
        dispatchNotif({
          type: NotificationTypes.WARNING,
          message: `Unauthorized to access`,
        })
      }

      // console.log('user.roles', user.roles)
    }
  }, [user])
  const theme = useTheme()

  if (error) {
    return <ErrorLoading />
  }

  return (
    <Container maxWidth="lg" disableGutters>
      <Paper>
        <Box p={2}>
          <Box>
            <Typography variant="h4">Caesar Accounts</Typography>
            <Typography color="primary" variant="body2">
              Caesar Accounts
            </Typography>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Paper variant="outlined">
            <Box p={2}>
              <FormLabel>Search for Accounts</FormLabel>
              <Box my={1} />
              <FormTextField
                name="search"
                onChange={(e) => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    setQuery((prev) => ({
                      ...prev,
                      // searchQuery: e.target.value?.length > 0 ? e.target.value : undefined,
                      searchQuery: e.target.value,
                    }))
                  }, 500)
                }}
              />
              <Box mt={1}>
                {caesars?.length === 0 && !isValidating && (
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
                    <Typography variant="body2">No Account Matched the Search</Typography>
                    <Typography variant="caption" color="primary">
                      Try Searching for a different keyword
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Caesar Account's First Name, Last Name, Phone Number
                    </Typography>
                  </Paper>
                )}
                {isValidating ? (
                  <LoadingScreen2
                    containerProps={{
                      style: {
                        borderRadius: 4,
                      },
                    }}
                  />
                ) : (
                  caesars &&
                  caesars.length > 0 && (
                    <>
                      <Box
                        style={{
                          height: 640,
                          overflowY: 'auto',
                        }}
                      >
                        {Object.entries(
                          caesars.reduce((acc, ea) => {
                            let accum = { ...acc }
                            if (!accum[ea.account_type]) {
                              accum = {
                                ...accum,
                                [ea.account_type]: [],
                              }
                            }
                            accum[ea.account_type] = [...accum[ea.account_type], ea]
                            return accum
                          }, {} as Record<UserTypes, ReturnType<typeof formatter>>)
                        )
                          .sort(([key1], [key2]) => key1.localeCompare(key2))
                          .map(([accountType, caesarValues]) => (
                            <Box
                              style={{
                                position: 'sticky',
                                top: 0,
                              }}
                              key={accountType}
                            >
                              <Box
                                style={{
                                  background:
                                    theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                                  borderTopLeftRadius: 4,
                                  borderTopRightRadius: 4,
                                }}
                                p={2}
                                mt={2}
                              >
                                <RoleBadge disablePopUp uppercase>
                                  {accountType}
                                </RoleBadge>
                              </Box>
                              <UsersTable
                                data={caesarValues}
                                limit={query.limit!}
                                page={query.page!}
                                setLimit={setQueryState('limit')}
                                setPage={setQueryState('page')}
                                total={ceasarMetaData?.total || 0}
                                hiddenFields={['id', 'account_type']}
                                onRowClick={(e, data) => {
                                  const id = (data as { id: string })?.id
                                  router.push({
                                    pathname: '/cash-transfer/[id]',
                                    query: {
                                      id,
                                    },
                                  })
                                }}
                                hidePagination
                              />
                            </Box>
                          ))}
                      </Box>

                      <TablePagination
                        rowsPerPageOptions={[50, 100, 250, 500]}
                        count={ceasarMetaData?.total || 0}
                        rowsPerPage={query?.limit || 0}
                        page={query?.page || 0}
                        onPageChange={(_, page) => {
                          // setPage(page)
                          setQueryState('page')(page)
                        }}
                        onRowsPerPageChange={(
                          e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
                        ) => {
                          setQueryState('limit')(Number(e.target.value))
                        }}
                        component="div"
                      />
                    </>
                  )
                )}
              </Box>
            </Box>
          </Paper>
        </Box>
      </Paper>

      <Box my={2} />

      <Grid container>
        <Grid item xs={12} md={6}>
          <Paper>
            <Box p={2}>
              <Box>
                <Typography variant="h4">Banks</Typography>
                <Typography color="primary" variant="body2">
                  Banks that can be linked to Caesar Account Cash transfers
                </Typography>
              </Box>
              <Box my={2}>
                <Divider />
              </Box>
              <CaesarBankLinking />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

// const CashTransferTable = () => {
//   function fetchCaesarAccounts<T>(params: T) {
//     getAllWallet(params: T).then(res => {

//     })
//   }
//   return (
//     <>
//       <UsersTable/>
//     </>
//   )
// }
