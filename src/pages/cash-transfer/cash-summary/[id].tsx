/* eslint-disable react/no-unescaped-entities */
import { Box, Divider, Grid, List, ListItem, Paper, Theme, Typography } from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CollectiblesSmallCards from '@src/components/pages/cash-transfer/CollectiblesSmallCards'
import TransactionOnlyModal from '@src/components/pages/cash-transfer/TransactionOnlyModal'
import RoleBadge from '@src/components/RoleBadge'
import { UserTypes } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse, formatIntoCurrency } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById, searchWalletV2 } from '@src/utils/api/walletApi'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import useSWR from 'swr'
const caesarFetcher = (id: string) => () => getWalletById(id)

export default function CashSummaryView() {
  const theme: Theme = useTheme()
  const { query } = useRouter()
  const { id } = query

  const mainBanks: string[] = ['09695638071', '09153754183']

  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const { data: caesar } = useSWR<CaesarWalletResponse>(`caesar/${id}`, caesarFetcher(id as string))

  const { data, error } = useSWR<Paginated<CaesarBank>>(
    id
      ? `/cash-transfer/caesar-bank/?caesar=${id}&page=${paginateOptions.page}&limit=${paginateOptions.limit}`
      : null,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        }),
    {}
  )

  const caesarBanks = useMemo(() => (data ? data.data : undefined), [data])

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
      searchWalletV2(query).then(async (res) => ({
        metadata: res.metadata,
        data: formatter(res.data),
      })),
    [formatter, query?.searchQuery]
  )

  const { data: paginatedCaesar, isValidating } = useSWR(['/caesar', query], fetcher)
  const caesars = useMemo(() => paginatedCaesar?.data || undefined, [paginatedCaesar])

  if (error) {
    return <ErrorLoading />
  }
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
              <Grid item xs={12} sm={6}>
                <Paper>
                  <Box p={1.5}>
                    <Box>
                      <Grid container spacing={2}>
                        <Grid item xs={12} lg={6}>
                          <Paper
                            style={{
                              textAlign: 'center',
                              height: '100%',
                              padding: 16,
                              background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                            }}
                          >
                            <FormLabel>Main Bank/s</FormLabel>
                            <Typography variant="h4" style={{ fontWeight: '800' }}>
                              {caesarBanks &&
                                caesarBanks.filter((ea) => !mainBanks.includes(ea.account_number))
                                  .length}
                            </Typography>
                          </Paper>
                        </Grid>

                        <Grid item xs={12} lg={6}>
                          <Paper
                            style={{
                              textAlign: 'center',
                              height: '100%',
                              padding: 16,
                              background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                            }}
                          >
                            <FormLabel>Total Balance</FormLabel>
                            <Typography variant="h4" style={{ fontWeight: '800' }}>
                              {formatIntoCurrency(
                                Number(
                                  caesarBanks &&
                                    caesarBanks
                                      .filter((ea) => !mainBanks.includes(ea.account_number))
                                      .reduce((acc, ea) => acc + ea.balance, 0)
                                )
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
                    >
                      {caesarBanks && caesarBanks?.length > 0 ? (
                        caesarBanks
                          .filter((ea) => !mainBanks.includes(ea.account_number))
                          .map(({ id, bank, description, balance, account_number }) => (
                            <ListItem
                              key={id}
                              style={{
                                border: theme.palette.divider,
                                borderWidth: 1,
                                borderStyle: 'solid',
                                borderRadius: 4,
                                padding: 8,
                              }}
                              button
                              onClick={() => {
                                if (showTransactions) {
                                  setShowTransactions(false)
                                  setCaesarBankId('')
                                } else {
                                  setShowTransactions(true)
                                  setCaesarBankId(id)
                                }
                              }}
                            >
                              <Grid
                                container
                                spacing={1}
                                style={{
                                  padding: 8,
                                }}
                              >
                                <Grid item xs={8} md={9} lg={10}>
                                  <Typography
                                    variant="body1"
                                    style={{
                                      fontWeight: 700,
                                    }}
                                    color="primary"
                                  >
                                    {bank.name}
                                  </Typography>
                                  {account_number && (
                                    <>
                                      <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        component="span"
                                      >
                                        {account_number}
                                      </Typography>
                                    </>
                                  )}

                                  <Typography variant="body2">{description || ''}</Typography>
                                </Grid>
                                <Grid item xs={4} md={3} lg={2}>
                                  <FormLabel>Balance: </FormLabel>

                                  <Typography noWrap variant="body1">
                                    ₱{' '}
                                    {new Intl.NumberFormat('en-PH', {
                                      currency: 'PHP',
                                    }).format(balance || 0)}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </ListItem>
                          ))
                      ) : (
                        <Paper
                          style={{
                            padding: 32,
                            textAlign: 'center',
                            background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                          }}
                          variant="outlined"
                        >
                          <Typography variant="body1" color="textSecondary">
                            No Banks linked Found
                          </Typography>
                        </Paper>
                      )}
                    </List>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box key={Math.floor(100000 + Math.random() * 900000)} mt={1}>
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
                                <Box
                                  style={{
                                    background:
                                      theme.palette.type === 'dark' ? grey['900'] : grey['200'],
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
                                {caesarValues.map((ea) => (
                                  <Box key={ea.id}>
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
                                          <CollectiblesSmallCards id={ea.id} dsp_name={ea.name} />
                                        </Grid>
                                      </Grid>
                                    </ListItem>
                                  </Box>
                                ))}
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
