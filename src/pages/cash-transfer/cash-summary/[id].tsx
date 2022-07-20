/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CollectiblesSmallCards from '@src/components/pages/cash-transfer/CollectiblesSmallCards'
import TransactionOnlyModal from '@src/components/pages/cash-transfer/TransactionOnlyModal'
import RoleBadge from '@src/components/RoleBadge'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse, formatIntoCurrency } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById, searchWalletV2 } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
const caesarFetcher = (id: string) => () => getWalletById(id)

export default function CashSummaryView() {
  const theme: Theme = useTheme()
  const { query } = useRouter()
  const { id } = query

  const mainBanks: string[] = ['09695638071', '09153754183']
  const user = useSelector(userDataSelector)
  const isAuthorizedForViewingBalances = useMemo(
    () => user && user.roles.some((ea) => ['ct-operator', 'ct-admin', 'admin'].includes(ea)),
    [user]
  )

  const [fetchQuery, setFetchQuery] = useState<PaginateFetchParameters & { searchQuery?: string }>({
    limit: 1000,
    page: 0,
    searchQuery: undefined,
    ...(!isAuthorizedForViewingBalances && {
      account_type: 'retailer',
    }),
  })
  const setQueryState = useCallback(
    (param: keyof typeof fetchQuery) => (value: typeof fetchQuery[keyof typeof fetchQuery]) => {
      setFetchQuery((prev) => ({
        ...prev,
        [param]: value,
      }))
    },
    []
  )

  const { data: caesar } = useSWR<CaesarWalletResponse>(`caesar/${id}`, caesarFetcher(id as string))
  const [showTransactions, setShowTransactions] = useState<boolean>(false)
  const [caesarBankId, setCaesarBankId] = useState<string>('')
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
    []
  )

  const fetcher = useCallback(
    () =>
      searchWalletV2(fetchQuery).then(async (res) => ({
        metadata: res.metadata,
        data: formatter(res.data),
      })),
    [formatter, fetchQuery?.searchQuery]
  )

  const { data: paginatedCaesar, isValidating } = useSWR(['/caesar', { ...fetchQuery }], fetcher)
  const caesars = useMemo(() => paginatedCaesar?.data || undefined, [paginatedCaesar])

  console.log('CAESARS', caesars)

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Box>
            <RoleBadge uppercase>{caesar?.account_type}</RoleBadge>
            <Typography variant="h4">Cash Summary</Typography>
            <Typography variant="body1" color="primary">
              {caesar?.description}
            </Typography>
          </Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
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
                            maxHeight: 750,
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
                            .filter((ea) => ea[0] === 'dsp')
                            .sort(([key1], [key2]) => key1.localeCompare(key2))
                            .map(([accountType, caesarValues]) => (
                              <Box
                                style={{
                                  position: 'sticky',
                                  top: 0,
                                }}
                                key={accountType}
                              >
                                {console.log(caesarValues)}
                                <Grid container spacing={2}>
                                  {caesarValues.map((ea) => (
                                    <Grid key={ea.id} item xs={12} md={6} lg={4}>
                                      <Box>
                                        <ListItem
                                          style={{
                                            border: theme.palette.divider,
                                            borderWidth: 1,
                                            borderStyle: 'solid',
                                            borderRadius: 4,
                                            padding: 8,
                                            marginTop: 8,
                                          }}
                                        >
                                          <Grid
                                            container
                                            spacing={1}
                                            style={{
                                              padding: 8,
                                            }}
                                          >
                                            <Grid item xs={12}>
                                              <CollectiblesSmallCards
                                                id={ea.id}
                                                dsp_name={ea.name}
                                              />
                                            </Grid>
                                          </Grid>
                                        </ListItem>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              </Box>
                            ))}
                        </Box>
                      </>
                    )
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      {showTransactions && (
        <TransactionOnlyModal
          caesarBankId={caesarBankId}
          open={showTransactions}
          handleClose={() => {
            setShowTransactions(false)
          }}
        />
      )}
    </Box>
  )
}
