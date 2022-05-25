/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  BoxProps,
  Divider,
  IconButton,
  Paper,
  PaperProps,
  TablePagination,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import {
  AccountBoxRounded,
  AddCircleOutlined,
  CloseOutlined,
  TableChart,
  Assessment,
} from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CreateRetailerShortcutModal from '@src/components/pages/retailer/CreateRetaileShortcutModal'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { userDataSelector, UserTypes, UserTypesWithCashTransfer } from '@src/redux/data/userSlice'
import { formatIntoCurrency } from '@src/utils/api/common'
import { getDsp } from '@src/utils/api/dspApi'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { CaesarWalletResponse, searchWalletV2 } from '@src/utils/api/walletApi'
import useIsCtOperatorOrAdmin from '@src/utils/hooks/useIsCtOperatorOrAdmin'
import useNotification from '@src/utils/hooks/useNotification'
import { Bank, CaesarBank } from '@src/utils/types/CashTransferTypes'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useRouter } from 'next/router'
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'

export const CashTransferBalancesTable = ({
  disabledKeys,
  paperProps,
  boxProps,
}: {
  disabledKeys?: ('id' | 'name' | 'account_type' | 'bank_accounts' | 'balance' | 'bank_balances')[]
  paperProps?: PaperProps
  boxProps?: BoxProps
}) => {
  const user = useSelector(userDataSelector)
  const isAuthorizedForViewingBalances = useMemo(
    () => user && user.roles.some((ea) => ['ct-operator', 'ct-admin', 'admin'].includes(ea)),
    [user]
  )

  const router = useRouter()

  const [addRetailerModal, setAddRetailerModal] = useState<boolean>(false)
  const [account, setAccount] = useState<UserResponse>()
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  // const searchQuery = useState<undefined | string>('')
  const [query, setQuery] = useState<PaginateFetchParameters & { searchQuery?: string }>({
    limit: 100,
    page: 0,
    searchQuery: undefined,
    ...(!isAuthorizedForViewingBalances && {
      account_type: 'retailer',
    }),
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
      param.map(({ id, description, account_type, cash_transfer_balance, bank_accounts }) => {
        const returnValue = {
          id,
          name: description,
          account_type,
          //   bank_accounts: bank_accounts.map((ea) => ea.bank.name).join(' '),
          bank_accounts,
          balance: formatIntoCurrency(cash_transfer_balance),
          bank_balances: formatIntoCurrency(bank_accounts.reduce((acc, ea) => acc + ea.balance, 0)),
        }
        return returnValue
      }),
    [disabledKeys]
  )
  const fetcher = useCallback(
    () =>
      searchWalletV2(query).then(async (res) => ({
        metadata: res.metadata,
        data: formatter(res.data),
      })),
    [formatter, query?.searchQuery]
  )

  const { data: paginatedCaesar, isValidating, error, mutate } = useSWR(['/caesar', query], fetcher)
  const caesars = useMemo(() => paginatedCaesar?.data || undefined, [paginatedCaesar])

  const ceasarMetaData = useMemo(() => paginatedCaesar?.metadata || undefined, [paginatedCaesar])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const theme: Theme = useTheme()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // timeoutRef.current = setTimeout(() => {
    //   mutate(['/caesar', query])
    //   console.log('MUTATED')
    // }, 1000)
  }, [addRetailerModal])

  useEffect(() => {
    if (user) {
      setLoading(true)
      getUser(user.user_id as string, {
        cached: false,
      })
        .then(async (res) => {
          if (res?.dsp) {
            res.dsp = await getDsp(res.dsp.id)
          }
          if (res?.dsp?.subdistributor) {
            res.subdistributor = await getSubdistributor(res.dsp.subdistributor.id)
          }
          setAccount(res)
        })

        .catch((err) => {
          const error = userApi.extractError(err)
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: error.toString(),
            })
          )
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [dispatch, user])
  const isEligible = useIsCtOperatorOrAdmin(['ct-operator', 'ct-admin'])
  const eligibleAsCTAdmin = useIsCtOperatorOrAdmin(['ct-admin'])

  if (error) {
    return <ErrorLoading />
  }

  return (
    <>
      <Paper variant="outlined" {...paperProps} style={{ display: 'relative' }}>
        <Box p={2} {...boxProps}>
          <Typography variant="h6" noWrap>
            Search For Accounts
          </Typography>
          <Typography color="primary" variant="body2">
            Find Bank Accounts to user that has Bank
          </Typography>
          <Box display="flex" flexDirection="row-reverse">
            {eligibleAsCTAdmin && (
              <Box textAlign="end">
                <Box>
                  <Tooltip
                    arrow
                    placement="left"
                    title={<Typography variant="subtitle2">View Summary Table</Typography>}
                  >
                    <IconButton
                      onClick={() => {
                        router.push({
                          pathname: '/cash-transfer/ct-summary',
                        })
                      }}
                    >
                      <TableChart />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
            {user && user.roles.some((ea) => ['dsp', 'subdistributor'].includes(ea)) && (
              <Box textAlign="end">
                <Box>
                  <Tooltip
                    arrow
                    placement="left"
                    title={<Typography variant="subtitle2">Add Retailer</Typography>}
                  >
                    <IconButton
                      onClick={() => {
                        setAddRetailerModal(true)
                      }}
                    >
                      <AddCircleOutlined />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Box>

          <Box my={1} mb={2}>
            <Divider />
          </Box>
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
                <Typography
                  variant="body2"
                  style={{
                    textAlign: 'center',
                  }}
                >
                  No Account Matched the Search
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  style={{
                    textAlign: 'center',
                  }}
                >
                  Try Searching for a different keyword
                </Typography>
                <Typography
                  variant="caption"
                  color="textSecondary"
                  style={{
                    textAlign: 'center',
                  }}
                >
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
                      maxHeight: 640,
                      overflowY: 'auto',
                    }}
                  >
                    {Object.entries(
                      caesars.reduce((acc, ea) => {
                        let accum = { ...acc }
                        if (!accum[ea.account_type as keyof typeof accum]) {
                          accum = {
                            ...accum,
                            [ea.account_type as keyof typeof accum]: [],
                          }
                        }
                        accum[ea.account_type as keyof typeof accum] = [
                          ...accum[ea.account_type as keyof typeof accum],
                          ea,
                        ]
                        return accum
                      }, {} as Record<UserTypes, ReturnType<typeof formatter>>)
                    )
                      .filter((ea) => {
                        if (!account?.admin && account?.dsp && !isEligible) {
                          return ea[0] !== 'admin' && ea[0] !== 'subdistributor'
                        }
                        if (!account?.admin && account?.subdistributor && !isEligible) {
                          return ea[0] !== 'admin' && ea[0] !== 'subdistributor'
                        }
                        return ea
                      })
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
                              background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                              borderTopLeftRadius: 4,
                              borderTopRightRadius: 4,
                            }}
                            p={2}
                            // mt={2}
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
                            hiddenFields={['id', 'account_type', ...(disabledKeys || [])]}
                            onRowClick={(e, data) => {
                              const id = (data as { id: string })?.id
                              if (isEligible) {
                                router.push({
                                  pathname: '/cash-transfer/[id]',
                                  query: {
                                    id,
                                  },
                                })
                              }
                              if (
                                user?.roles &&
                                (user?.roles as UserTypesWithCashTransfer[])?.includes(
                                  'subdistributor' as UserTypesWithCashTransfer
                                ) &&
                                ['user', 'retailer', 'dsp'].includes(data.account_type)
                              ) {
                                router.push({
                                  pathname: '/cash-transfer/[id]',
                                  query: {
                                    id,
                                  },
                                })
                              }

                              if (
                                user?.roles &&
                                (user?.roles as UserTypesWithCashTransfer[])?.includes(
                                  'dsp' as UserTypesWithCashTransfer
                                ) &&
                                ['user', 'retailer'].includes(data.account_type)
                              ) {
                                router.push({
                                  pathname: '/cash-transfer/[id]',
                                  query: {
                                    id,
                                  },
                                })
                              }
                            }}
                            hidePagination
                            tableCellProps={{
                              name: {
                                style: {
                                  minWidth: '30%',
                                },
                              },
                              bank_accounts: {
                                style: {
                                  width: '30%',
                                },
                              },
                              bank_balances: {
                                style: {
                                  width: '20%',
                                },
                              },
                              balance: {
                                style: {
                                  width: '20%',
                                },
                              },
                            }}
                            renderCell={{
                              bank_accounts: (value) => (
                                <Box display="flex" flexWrap="wrap">
                                  {value && Array.isArray(value)
                                    ? (value as CaesarBank[])
                                        ?.sort((ea1, ea2) =>
                                          ea1.bank.name?.localeCompare(ea2.bank.name)
                                        )
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
        {addRetailerModal && user?.roles.filter((ea) => ea !== 'admin') && isEligible && (
          <CreateRetailerShortcutModal
            open={addRetailerModal}
            onClose={() => {
              setAddRetailerModal(false)
            }}
            triggerRender={mutate}
          />
        )}
        {addRetailerModal &&
          user?.roles.some((ea) => ['subdistributor'] || ['dsp'].includes(ea)) &&
          !isEligible && (
            <CreateRetailerShortcutModal
              open={addRetailerModal}
              onClose={() => {
                setAddRetailerModal(false)
              }}
              dsp={account?.dsp ? account.dsp : undefined}
              subd={account?.subdistributor ? account.subdistributor : undefined}
              triggerRender={mutate}
            />
          )}
      </Paper>
    </>
  )
}
function dispatch(arg0: any) {
  throw new Error('Function not implemented.')
}
