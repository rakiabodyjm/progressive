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
import AsyncButton from '@src/components/AsyncButton'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import RoleBadge from '@src/components/RoleBadge'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { userDataSelector } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { getUser } from '@src/utils/api/userApi'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { Bank, CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
// import { GetServerSideProps, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR, { KeyedMutator } from 'swr'

type CreateCaesarBank = {
  caesar: string
  bank: number
  description?: string
}

const caesarFetcher = (id: string) => () => getWalletById(id)

/**
 *
 * View Overall Transactions
 *
 * View overall Balance
 *
 * Create Transaction
 */
export default function ViewCaesarPage() {
  const theme: Theme = useTheme()
  const { query } = useRouter()
  const { id } = query

  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const {
    data: caesar,
    error: caesarError,
    isValidating: caesarLoading,
  } = useSWR<CaesarWalletResponse>(`caesar/${id}`, caesarFetcher(id as string))

  const {
    data,
    error,
    isValidating,
    mutate: mutateCaesarBanks,
  } = useSWR<Paginated<CaesarBank>>(
    id
      ? `/cash-transfer/caesar-bank/?caesar=${id}&page=${paginateOptions.page}&limit=${paginateOptions.limit}`
      : null,
    (url) => axios.get(url).then((res) => res.data),
    {}
  )

  const metadata = useMemo(() => (data ? data.metadata : undefined), [data])
  const caesarBanks = useMemo(() => (data ? data.data : undefined), [data])

  const [addCaesarBankModal, setAddCaesarBankModal] = useState<boolean>(false)
  const handleAddCaesarModalClose = useCallback(() => {
    setAddCaesarBankModal(false)
  }, [])

  const currentUser = useSelector(userDataSelector)
  const user = useSWR(
    currentUser?.user_id ? `/user/${currentUser?.user_id}` : null,
    () => getUser(currentUser!.user_id),
    {}
  )
  const router = useRouter()

  if (error) {
    return <ErrorLoading />
  }
  //   const user = getUser()

  return (
    <Container disableGutters maxWidth="lg">
      <Paper>
        <Box p={2}>
          <Box>
            <RoleBadge uppercase>{caesar?.account_type}</RoleBadge>
            <Typography variant="h4">Cash Transfer</Typography>
            <Typography variant="body1" color="primary">
              {caesar?.description}
            </Typography>
          </Box>

          <Box my={2}>
            <Divider />
          </Box>

          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
                          router.push(`/cash-transfer/caesar/${id}`)
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
                        caesarBanks.map(({ id, bank, description, balance }) => (
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
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>

      <ModalWrapper
        containerSize="xs"
        onClose={handleAddCaesarModalClose}
        open={addCaesarBankModal}
      >
        <Paper>
          <Box p={2}>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h6">Add New Bank</Typography>
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
            <AddCaesarBank mutate={mutateCaesarBanks} caesar={id as string} />
          </Box>
        </Paper>
      </ModalWrapper>
    </Container>
  )
}

const AddCaesarBank = ({
  caesar,
  mutate,
}: {
  caesar: string
  mutate: KeyedMutator<Paginated<CaesarBank>>
}) => {
  const [formValues, setFormValues] = useState<Partial<Omit<CreateCaesarBank, 'id'>>>({
    bank: undefined,
    caesar,
    description: undefined,
  })

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatchSuccess = useSuccessNotification()
  const dispatchError = useErrorNotification()

  const handleSubmit = () => {
    setIsSubmitting(true)
    axios
      .post('/cash-transfer/caesar-bank', {
        ...formValues,
      })
      .then((res) => {
        dispatchSuccess(`Caesar Bank Created`)
      })
      .catch((err) => {
        extractMultipleErrorFromResponse(err).forEach((ea) => {
          dispatchError(ea)
        })
      })
      .finally(() => {
        setIsSubmitting(false)
        mutate()
      })
  }

  return (
    <>
      <FormLabel>Caesar</FormLabel>
      <FormTextField
        name="caesar"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }}
        value={caesar}
        disabled
      />
      <Box my={1} />

      <FormLabel>Bank</FormLabel>
      <SimpleAutoComplete<
        Bank,
        {
          page: number
          limit: number
          search: string
        }
      >
        initialQuery={{ limit: 100, page: 0, search: '' }}
        fetcher={(q) =>
          axios
            .get('/cash-transfer/bank', {
              params: {
                ...q,
              },
            })
            .then((res) => res.data.data)
        }
        querySetter={(arg, inputValue) => ({
          ...arg,
          search: inputValue,
        })}
        getOptionLabel={(option) =>
          `${option.name}  ${option?.description && ` - ${option?.description}`}`
        }
        onChange={(value) => {
          setFormValues((prev) => ({
            ...prev,
            bank: value?.id || undefined,
          }))
        }}
        getOptionSelected={(val1, val2) => val1.id === val2.id}
        // defaultValue={}
      />
      <Box my={1} />
      <FormLabel>Description</FormLabel>
      <FormTextField
        name="description"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }}
      />
      <Box my={2}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <AsyncButton onClick={handleSubmit} disabled={isSubmitting} loading={isSubmitting}>
          Submit
        </AsyncButton>
      </Box>
    </>
  )
}
// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const getWallet = await getWalletById(context?.params?.id as string)

//   return {
//     props: {
//       caesar: getWallet,
//     },
//   }
// }

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
