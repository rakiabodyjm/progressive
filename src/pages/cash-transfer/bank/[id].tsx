/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import ErrorLoading from '@src/components/ErrorLoadingScreen'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import CreateNewTransactionModal from '@src/components/pages/cash-transfer/CreateNewTransactionModal'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useMemo, useRef, useState } from 'react'
import {
  Close,
  CloseOutlined,
  Edit,
  ErrorOutline,
  MonetizationOn,
  MoreVert,
} from '@material-ui/icons'
import useSWR from 'swr'
import CashTransferForm from '@src/components/pages/cash-transfer/CashTransferForm'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import RoleBadge from '@src/components/RoleBadge'
import { useTheme } from '@material-ui/styles'
import CashTransferList from '@src/components/pages/cash-transfer/CashTransferList'
import { formatIntoCurrency } from '@src/utils/api/common'
import { PopUpMenu } from '@src/components/PopUpMenu'
import ModalWrapper from '@components/ModalWrapper'
import CreateOrUpdateCaesarBank from '@components/pages/cash-transfer/CreateOrUpdateCaesarBank'

/**
 *
 * Deposit to CaesarBank
 *
 * View CaesarBank Transactions
 *
 */
export default function ViewCaesarBankPage() {
  const router = useRouter()
  const { query } = router
  const id = useMemo(() => query?.id, [query])

  const {
    data: caesarBankData,
    error: caesarBankError,
    isValidating: caesarBankLoading,
  } = useSWR<CaesarBank>(id ? `/cash-transfer/caesar-bank/${id}` : null, (url) =>
    axios.get(url).then((res) => res.data)
  )

  // const {
  //   data: caesarBankTransactions,
  //   error: caesarBankTransactionsError,
  //   isValidating: caesarBankTransactionLoading,
  // } = useSWR(id ? `/cash-transfer/caesar-bank` : undefined)

  const {
    data: caesarData,
    error: ceasarError,
    isValidating: caesarValidating,
    mutate,
  } = useSWR<CaesarWalletResponse>(
    caesarBankData?.caesar?.id ? `/caesar/${caesarBankData?.caesar?.id}` : undefined,
    () => getWalletById(caesarBankData!.caesar!.id)
  )

  const caesar = useMemo(() => {
    if (caesarData) {
      return caesarData
    }

    return undefined
  }, [caesarData])

  const [transactionModal, setTransactionModal] = useState<{
    transactionModalOpen: boolean
    transactionSelected?: CashTransferAs
  }>({
    transactionModalOpen: false,
    transactionSelected: undefined,
  })

  const roles: string[] | undefined = useSelector(userDataSelector)?.roles

  const { transactionSelected } = transactionModal
  const theme: Theme = useTheme()

  const [editMenu, setEditMenu] = useState<{
    modal: HTMLButtonElement | undefined
    editMode: boolean
  }>({
    modal: undefined,
    editMode: false,
  })

  const editAnchorElement = useRef<HTMLButtonElement | undefined>()

  if (ceasarError || caesarBankError) {
    return <ErrorLoading />
  }

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper variant="outlined">
          <Box p={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  variant="outlined"
                  style={{
                    padding: 16,
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <ErrorOutline color="error" />

                    <Typography
                      style={{
                        marginLeft: 4,
                        fontWeight: 500,
                        letterSpacing: 2,
                        alignItems: 'center',
                        display: 'inline',
                      }}
                      color="error"
                      variant="body1"
                    >
                      TIP / GUIDE:
                    </Typography>
                  </Box>

                  <Box my={1}>
                    <Divider />
                  </Box>

                  <Box display="inline">
                    <Typography color="error" variant="body2">
                      Sender's Bank Fee:{' '}
                    </Typography>
                    <Typography variant="caption">
                      - Add this on top of your Bank Fee for Loans
                    </Typography>
                  </Box>
                  {/* <Box mt={2} display="inline">
                    <Typography color="error" variant="body2">'
                      
                    </Typography>
                    <Typography variant="caption">
                      Add this on top of your Bank Fee for Loans
                    </Typography>
                  </Box> */}
                </Paper>
                <Box my={2} />

                <Paper variant="outlined">
                  <Box p={2}>
                    {caesarBankData && caesarData ? (
                      <>
                        <Box display="flex" justifyContent="space-between">
                          <Box>
                            <RoleBadge disablePopUp variant="body1" color="primary">
                              {caesarData.description}
                            </RoleBadge>
                            <Typography variant="h4">
                              <Typography color="primary" component="span" variant="h4">
                                {caesarBankData.bank.name}
                              </Typography>{' '}
                              Transactions
                            </Typography>
                            <Typography variant="body2">{caesarBankData.description}</Typography>
                          </Box>
                          <Box>
                            <Tooltip
                              arrow
                              placement="left"
                              title={<Typography variant="body1">Edit Account</Typography>}
                            >
                              <IconButton
                                onClick={(e) => {
                                  setEditMenu((prev) => ({
                                    ...prev,
                                    modal: editAnchorElement.current,
                                  }))
                                }}
                                innerRef={editAnchorElement}
                              >
                                <MoreVert />
                              </IconButton>
                            </Tooltip>
                            <PopUpMenu
                              menuItems={[
                                {
                                  text: 'Edit',
                                  Component: <Edit />,
                                  action: () => {
                                    setEditMenu((prev) => ({
                                      ...prev,
                                      editMode: true,
                                    }))
                                    // setEditMode((prevState) => !prevState)
                                    // setEditPopUpMenuOpen(false)
                                  },
                                },
                              ]}
                              open={!!editMenu.modal}
                              // anchorEl={(editMenu?.modal as HTMLButtonElement) | undefined}
                              anchorEl={editAnchorElement.current}
                              onClose={() => {
                                setEditMenu((prev) => ({
                                  ...prev,
                                  modal: undefined,
                                }))
                                // setEditPopUpMenuOpen((prevState) => !prevState)
                              }}
                              autoFocus
                              transformOrigin={{
                                horizontal: 'right',
                                vertical: 'top',
                              }}
                            />
                          </Box>
                        </Box>

                        <Typography
                          style={{
                            marginTop: 16,
                            marginBottom: -8,
                            display: 'block',
                          }}
                          variant="caption"
                          color="primary"
                        >
                          Bank Balance:{' '}
                        </Typography>
                        <Typography variant="h6">
                          {formatIntoCurrency(caesarBankData?.balance)}
                        </Typography>
                        <Box my={2}></Box>

                        <Box my={2}>
                          <Divider />
                        </Box>
                        <CashTransferList caesarBankId={caesarBankData.id} />
                      </>
                    ) : (
                      <LoadingScreen2 />
                    )}
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  style={{
                    padding: `8px 24px`,
                    display: transactionModal.transactionSelected ? 'none' : undefined,
                  }}
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: true,
                    }))
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 700,
                    }}
                    variant="body1"
                  >
                    NEW TRANSACTION
                  </Typography>
                  <Box ml={1} />
                  <MonetizationOn />
                </Button>

                {transactionModal?.transactionSelected && (
                  <Box
                    style={{
                      position: 'relative',
                    }}
                    py={0}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        top: 0,
                        width: '100%',
                      }}
                      textAlign="end"
                    >
                      <IconButton
                        style={{
                          marginRight: 16,
                          marginTop: 16,
                        }}
                        onClick={() => {
                          setTransactionModal((prev) => ({
                            ...prev,
                            transactionSelected: undefined,
                          }))
                        }}
                      >
                        <CloseOutlined />
                      </IconButton>
                    </Box>
                    {transactionSelected && (
                      <CashTransferForm
                        {...(transactionSelected === CashTransferAs.TRANSFER && {
                          caesar_bank_from: caesarBankData,
                        })}
                        {...(transactionSelected === CashTransferAs.WITHDRAW && {
                          caesar_bank_from: caesarBankData,
                        })}
                        {...(transactionSelected === CashTransferAs.DEPOSIT && {
                          caesar_bank_to: caesarBankData,
                          from: caesar,
                        })}
                        {...(transactionSelected === CashTransferAs.LOAN && {
                          caesar_bank_from: caesarBankData,
                        })}
                        transactionType={transactionSelected}
                      />
                    )}
                    {/* {transactionModal?.transactionSelected === 'transfer' && (
                      <TransferTypeTransaction caesar_bank_from={caesarBankData} />
                    )}
                    {transactionModal?.transactionSelected === 'withdraw' && (
                      <WithDrawTypeTransaction caesar_bank_from={caesarBankData} />
                    )}
                    {transactionModal?.transactionSelected === 'deposit' && (
                      <DepositTypeTransaction caesar_bank_to={caesarBankData} />
                    )} */}
                  </Box>
                )}

                <Box my={2} />

                {/**
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 *
                 * New Transaction Modal
                 */}
                {editMenu.editMode && (
                  <EditCaesarBankModal
                    open={editMenu.editMode}
                    onClose={() => {
                      setEditMenu((prev) => ({
                        ...prev,
                        editMode: false,
                      }))
                    }}
                    caesarBankId={id as string}
                  />
                )}

                <CreateNewTransactionModal
                  open={transactionModal.transactionModalOpen}
                  onClose={() => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: false,
                    }))
                  }}
                  onSelect={(selected) => {
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionSelected: selected,
                    }))
                    setTransactionModal((prev) => ({
                      ...prev,
                      transactionModalOpen: false,
                    }))
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  )
}

const EditCaesarBankModal = ({
  open,
  onClose,
  caesarBankId,
}: {
  open: boolean
  onClose: () => void
  caesarBankId: CaesarBank['id']
}) => {
  const {
    data: caesarBank,
    error,
    isValidating: loading,
    mutate,
  } = useSWR<CaesarBank>(`/cash-transfer/caesar-bank/${caesarBankId}`, (url) =>
    axios.get(url).then((res) => res.data)
  )

  return (
    <ModalWrapper onClose={onClose} open={open} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
      >
        {loading && caesarBank ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6">Update Bank Account</Typography>
                <Typography variant="body2" color="textSecondary">
                  Update this Caesar's Bank Account
                </Typography>
              </Box>

              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>

            <CreateOrUpdateCaesarBank
              onClose={onClose}
              caesar={caesarBank!.caesar.id}
              mutate={mutate}
              updateValues={{
                account_number: caesarBank?.account_number,
                bank: caesarBank?.bank.id,
                caesar: caesarBank?.caesar.id,
                description: caesarBank?.description,
              }}
              updateValueId={caesarBankId}
            />
          </>
        )}
      </Paper>
    </ModalWrapper>
  )
}
// type CreateTransaction = {
// caesar_bank_to:  CaesarBank

// }
