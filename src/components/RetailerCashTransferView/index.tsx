import {
  Box,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { AddCircleOutlined, CloseOutlined } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import CollectiblesTable from '@src/components/CollectiblesTable'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import { CashTransferBalancesTable } from '@src/components/pages/cash-transfer/CashTransferBalancesTable'
import CreateOrUpdateCaesarBank from '@src/components/pages/cash-transfer/CreateOrUpdateCaesarBank'
import RetailerLoanList from '@src/components/RetailerLoanList'
import RoleBadge from '@src/components/RoleBadge'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { getUser } from '@src/utils/api/userApi'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import useGetCaesarOfUser from '@src/utils/hooks/useGetCaesarOfUser'
import { Bank, CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
// import { GetServerSideProps, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

const caesarFetcher = (id: string) => () => getWalletById(id)

/**
 *
 * View Overall Transactions
 *
 * View overall Balance
 *
 * Create Transaction
 */

const disabledAccounts = ['user'] as UserTypes[]
export default function RetailerCashTransferView() {
  const { data: caesarWallet, account } = useGetCaesarOfUser({ disabledAccounts })
  const [caesarId, setCaesarId] = useState({
    admin: '',
    dsp: '',
    subdistributor: '',
    retailer: '',
  })

  useEffect(() => {
    caesarWallet.map((ea) => setCaesarId((prev) => ({ ...prev, [ea[0]]: ea[1] })))
  }, [caesarWallet])

  const currentUser = useSelector(userDataSelector)
  const { data: caesar, mutate: mutateCaesar } = useSWR(
    caesarId.retailer ? `/caesar/${caesarId.retailer}` : undefined,
    () => getWalletById(caesarId.retailer as string)
  )

  return (
    <Container disableGutters maxWidth="lg">
      <Paper>
        <Box p={2}>
          <Box>
            {currentUser?.roles.map((role) => (
              <RoleBadge key={role} style={{ marginRight: 8 }} uppercase>
                {role}
              </RoleBadge>
            ))}
            <Typography variant="h4">Cash Transfer</Typography>
            <Typography variant="body1" color="primary">
              {currentUser?.first_name}
            </Typography>
          </Box>

          <Box my={2}>
            <Divider />
          </Box>
          <Grid container spacing={1}>
            <Grid item md={6} xs={12}>
              {caesarId.admin || caesarId.subdistributor || caesarId.dsp || caesarId.retailer ? (
                <>
                  <Box mb={2}>{caesarId.admin && <CaesarAccount caesarID={caesarId.admin} />}</Box>
                  <Box mb={2}>
                    {caesarId.subdistributor && (
                      <CaesarAccount caesarID={caesarId.subdistributor} />
                    )}
                  </Box>
                  <Box mb={2}>{caesarId.dsp && <CaesarAccount caesarID={caesarId.dsp} />}</Box>
                  <Box mb={2}>
                    {caesarId.retailer && <CaesarAccount caesarID={caesarId.retailer} />}
                  </Box>
                </>
              ) : (
                <LoadingScreen2
                  containerProps={{
                    minHeight: 480,
                  }}
                  textProps={{
                    variant: 'h4',
                  }}
                />
              )}
            </Grid>

            {/* <Grid item md={6} xs={12}>
              <Box mt={2}>
                <CashTransferBalancesTable
                  disabledKeys={['bank_balances', 'balance']}
                  caesarId={caesarId.dsp}
                />
              </Box>
            </Grid> */}

            <Grid item md={6} xs={12}>
              <Box mt={2}>
                <RetailerLoanList caesarId={caesar?.id} triggerRender={mutateCaesar} />
              </Box>
            </Grid>
          </Grid>

          {/* {caesarId.admin && <CaesarAccount caesarID={caesarId.admin} />}
          {caesarId.dsp && <CaesarAccount caesarID={caesarId.dsp} />} */}
          {/* {caesarId.retailer && <CaesarAccount caesarID={caesarId.retailer} />}
          {caesarId.subdistributor && <CaesarAccount caesarID={caesarId.subdistributor} />} */}
        </Box>
      </Paper>
    </Container>
  )
}

const CaesarAccount = ({ caesarID }: { caesarID: string }) => {
  const theme: Theme = useTheme()
  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const { data: caesarWallet, account } = useGetCaesarOfUser({ disabledAccounts })
  const [caesarId, setCaesarId] = useState({
    admin: '',
    dsp: '',
    subdistributor: '',
    retailer: '',
  })
  const [caesarWalletID, setCaesarWalletID] = useState('')
  useEffect(() => {
    caesarWallet.map((ea) => setCaesarId((prev) => ({ ...prev, [ea[0]]: ea[1] })))
  }, [caesarWallet])
  const {
    data: caesar,
    error: caesarError,
    isValidating: caesarLoading,
  } = useSWR<CaesarWalletResponse>(
    `caesar/${caesarID}`,
    caesarFetcher(caesarID as unknown as string)
  )

  const {
    data,
    error,
    isValidating,
    mutate: mutateCaesarBanks,
  } = useSWR<Paginated<CaesarBank>>(
    caesarID
      ? `/cash-transfer/caesar-bank/?caesar=${caesarID}&page=${paginateOptions.page}&limit=${paginateOptions.limit}`
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

  const metadata = useMemo(() => (data ? data.metadata : undefined), [data])
  const caesarBanks = useMemo(() => (data ? data.data : undefined), [data])

  const [addCaesarBankModal, setAddCaesarBankModal] = useState<boolean>(false)
  const handleAddCaesarModalClose = useCallback(() => {
    setAddCaesarBankModal(false)
  }, [])

  const currentUser = useSelector(userDataSelector)
  // const user = useSWR(
  //   currentUser?.user_id ? `/user/${currentUser?.user_id}` : null,
  //   () => getUser(currentUser!.user_id),
  //   {}
  // )
  const router = useRouter()

  if (error) {
    return <ErrorLoading />
  }
  //   const user = getUser()
  return (
    <>
      <Box>
        <Paper>
          <Box p={1.5}>
            <Box>
              <Typography variant="h6" noWrap>
                Accounts
              </Typography>
              <Typography color="primary" variant="body2">
                Caesar Account and Banks that are linked to this Caesar Account
              </Typography>
              <Box textAlign="end">
                <IconButton
                  onClick={() => {
                    setAddCaesarBankModal(true)
                  }}
                >
                  <AddCircleOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box my={1} mb={2}>
              <Divider />
            </Box>
            <List
              style={{
                display: 'grid',
                gap: 4,
              }}
            >
              <ListItem
                style={{
                  border: theme.palette.divider,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderRadius: 4,
                  padding: 8,
                }}
                button
                onClick={() => {
                  //   router.push(`/cash-transfer/caesar/${caesarID}`)
                }}
              >
                <Grid
                  container
                  spacing={1}
                  style={{
                    padding: 8,
                  }}
                >
                  <Grid item xs={8}>
                    <Typography
                      variant="body1"
                      style={{
                        fontWeight: 700,
                      }}
                      color="primary"
                    >
                      {/* {caesar?.description} */}
                      Caesar Account
                    </Typography>
                    <Typography variant="body2">{caesar?.description || ''}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <FormLabel>Total Loan/Balance: </FormLabel>

                    <Typography variant="body1">
                      ₱{' '}
                      {new Intl.NumberFormat('en-PH', {
                        currency: 'PHP',
                      }).format(caesar?.cash_transfer_balance || 0)}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              {caesarBanks && caesarBanks?.length > 0 ? (
                caesarBanks.map(({ id, bank, description, balance, account_number }) => (
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
                      router.push(`/cash-transfer/bank/${id}`)
                    }}
                  >
                    <Grid
                      container
                      spacing={1}
                      style={{
                        padding: 8,
                      }}
                    >
                      <Grid item xs={8}>
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
                            <Typography variant="caption" color="textSecondary" component="span">
                              {account_number}
                            </Typography>
                          </>
                        )}

                        <Typography variant="body2">{description || ''}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <FormLabel>Balance: </FormLabel>

                        <Typography variant="body1">
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

        {/* <Grid item xs={12} md={6}>
            <CashTransferBalancesTable disabledKeys={['bank_balances', 'balance']} />
          </Grid> */}
      </Box>

      <ModalWrapper
        containerSize="xs"
        onClose={handleAddCaesarModalClose}
        open={addCaesarBankModal}
      >
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6">Add New Bank Account</Typography>
                <Typography variant="body2" color="textSecondary">
                  Add a Bank to Link to this Caesar
                </Typography>
              </Box>
              <Box>
                <IconButton onClick={handleAddCaesarModalClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <CreateOrUpdateCaesarBank
              onClose={handleAddCaesarModalClose}
              mutate={mutateCaesarBanks}
              caesar={caesarID as string}
            />
          </Box>
        </Paper>
      </ModalWrapper>
    </>
  )
}

const CaesarSummary = ({ caesar }: { caesar: string }) => {
  const fetcher = useCallback(() => getWalletById(caesar), [caesar])
  const { data, error, isValidating } = useSWR<CaesarWalletResponse>(`caesar/${caesar}`, fetcher)

  return (
    <Container
      disableGutters
      style={{
        marginLeft: undefined,
        marginRight: undefined,
      }}
      maxWidth="xs"
    >
      <Paper variant="outlined">
        <Box p={2}>
          {data ? (
            <Grid container spacing={2}>
              <Grid item>
                <FormLabel>Description</FormLabel>
                <Typography variant="body1">{data.description}</Typography>
              </Grid>
            </Grid>
          ) : (
            <LoadingScreen2 />
          )}
        </Box>
      </Paper>
    </Container>
  )
}
