/* eslint-disable react/no-unescaped-entities */
import {
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { MoreVert, Edit, Close } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import AsyncButton from '@src/components/AsyncButton'
import CollectiblesTable from '@src/components/CollectiblesTable'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import CashTransferList from '@src/components/pages/cash-transfer/CashTransferList'
import { PopUpMenu } from '@src/components/PopUpMenu'
import RoleBadge from '@src/components/RoleBadge'
import { userDataSelector } from '@src/redux/data/userSlice'
import { extractMultipleErrorFromResponse, formatIntoCurrency } from '@src/utils/api/common'
import { getWalletById } from '@src/utils/api/walletApi'
import { useSuccessNotification, useErrorNotification } from '@src/utils/hooks/useNotification'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'
import { Caesar } from '../../../utils/types/CashTransferTypes'

type CreateCaesar = {
  cash_transfer_balance: number
}

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column-reverse',
    },
  },
}))

export default function ViewCashTransferCaesar() {
  const classes = useStyles()
  const { query } = useRouter()
  const { id } = query

  const { data: caesar, mutate: mutateCaesar } = useSWR(id ? `/caesar/${id}` : undefined, () =>
    getWalletById(id as string)
  )
  const theme: Theme = useTheme()
  const user = useSelector(userDataSelector)

  // if (errorCashTransfers) {
  //   return (
  //     <Paper
  //       style={{
  //         minHeight: 240,
  //         display: 'flex',
  //         justifyContent: 'center',
  //         alignItems: 'center',
  //         background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
  //         flexDirection: 'column',
  //       }}
  //     >
  //       <Typography variant="body2">Not Available</Typography>
  //       <Typography variant="caption" color="primary">
  //         No Recent Transactions
  //       </Typography>
  //     </Paper>
  //   )
  // }

  const [editMenu, setEditMenu] = useState<{
    modal: HTMLButtonElement | undefined
    editMode: boolean
  }>({
    modal: undefined,
    editMode: false,
  })

  const editAnchorElement = useRef<HTMLButtonElement | undefined>()

  return (
    <>
      <Container maxWidth="lg" disableGutters>
        <Paper>
          <Box p={2}>
            <Grid container spacing={2} className={classes.gridContainer}>
              <Grid item xs={12} md={6}>
                <Paper>
                  <Box p={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Box>
                        <RoleBadge variant="body1" color="primary">
                          {caesar?.account_type.toUpperCase()}
                        </RoleBadge>
                        <Typography variant="h4">
                          <span
                            style={{
                              color: theme.palette.primary.main,
                            }}
                          >
                            Caesar{' '}
                          </span>{' '}
                          Account
                        </Typography>

                        <Typography variant="body2">{caesar?.description.toUpperCase()}</Typography>

                        <Typography
                          style={{
                            marginTop: 16,
                            marginBottom: -8,
                            display: 'block',
                          }}
                          variant="caption"
                          color="primary"
                        >
                          Total Loan/Balance:{' '}
                        </Typography>
                      </Box>
                      {user?.roles.some((ea) => ['ct-admin'].includes(ea)) && (
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
                      )}
                    </Box>

                    {caesar && (
                      <Typography variant="h6">
                        {formatIntoCurrency(caesar.cash_transfer_balance)}
                      </Typography>
                    )}

                    <Box my={2}></Box>

                    <Box my={2}>
                      <Divider />
                    </Box>

                    {/**
                     *
                     *
                     *
                     */}
                    <CashTransferList caesarId={caesar?.id} />
                  </Box>
                </Paper>
                {editMenu.editMode && (
                  <EditCaesarModal
                    open={editMenu.editMode}
                    onClose={() => {
                      setEditMenu((prev) => ({
                        ...prev,
                        editMode: false,
                      }))
                    }}
                    caesarId={id as string}
                  />
                )}
              </Grid>
              <Grid item xs={12} md={6}>
                <CollectiblesTable caesarId={caesar?.id} triggerRender={mutateCaesar} />
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
const EditCaesarModal = ({
  open,
  onClose,
  caesarId,
}: {
  open: boolean
  onClose: () => void
  caesarId: Caesar['id']
}) => {
  const {
    data: caesar,
    error,
    isValidating: loading,
    mutate,
  } = useSWR<Caesar>(`/caesar/${caesarId}`, (url) => axios.get(url).then((res) => res.data))
  const [formValues, setFormValues] = useState<Partial<Omit<CreateCaesar, 'id'>>>({
    cash_transfer_balance: caesar?.cash_transfer_balance,
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatchSuccess = useSuccessNotification()
  const dispatchError = useErrorNotification()
  const handleSubmit = () => {
    axios
      .patch(`/caesar/${caesarId}`, formValues)
      .then((res) => {
        dispatchSuccess('Caesar\'s Bank Account Updated')
        onClose()
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
    <ModalWrapper onClose={onClose} open={open} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
      >
        {loading && caesar ? (
          <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography color="primary" variant="h6">
                  Update Caesar
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Update this Caesar Account's balance
                </Typography>
              </Box>

              <IconButton onClick={onClose}>
                <Close />
              </IconButton>
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Box my={2} />
            <FormLabel>Cash Transfer Balance: </FormLabel>
            <FormTextField
              name="cash_transfer_balance"
              onChange={(e) => {
                setFormValues((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }}
              value={formValues.cash_transfer_balance}
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
        )}
      </Paper>
    </ModalWrapper>
  )
}
