import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Modal,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { Close } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import TransactionOnlyModal from '@src/components/pages/cash-transfer/TransactionOnlyModal'
import RoleBadge from '@src/components/RoleBadge'
import { userDataSelector } from '@src/redux/data/userSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  objectToURLQuery,
} from '@src/utils/api/common'
import { getUser } from '@src/utils/api/userApi'
import { CaesarWalletResponse, getWalletById, searchWalletV2 } from '@src/utils/api/walletApi'
import {
  CaesarBank,
  CashTransferAs,
  CashTransferResponse,
} from '@src/utils/types/CashTransferTypes'
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

  const currentUser = useSelector(userDataSelector)
  const user = useSWR(
    currentUser?.user_id ? `/user/${currentUser?.user_id}` : null,
    () => getUser(currentUser!.user_id),
    {}
  )

  const router = useRouter()
  const [queryParameters, setQueryParameters] = useState<{
    page: number
    limit: number
  }>({
    page: 0,
    limit: 100,
  })

  const [showTransactions, setShowTransactions] = useState<boolean>(false)
  const [caesarBankId, setCaesarBankId] = useState<string>('')

  const { data: caesarBankData } = useSWR(
    `/cash-transfer?${objectToURLQuery({
      caesar_bank: caesarBankId,
      ...paginateOptions,
    })}`,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data as Paginated<CashTransferResponse>)
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
  )

  if (error) {
    return <ErrorLoading />
  }
  //   const user = getUser()
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
              <Grid item xs={12}>
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
                        // <LoadingScreen2 />
                      )}
                    </List>
                  </Box>
                </Paper>
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
