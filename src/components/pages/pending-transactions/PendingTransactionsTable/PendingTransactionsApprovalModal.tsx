import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Grid,
  IconButton,
  Paper,
  SvgIconTypeMap,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'

import {
  AssignmentTurnedInOutlined,
  CancelPresentationOutlined,
  Close,
  MoneyOffOutlined,
  SvgIconComponent,
} from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import {
  approvePendingTransaction,
  cancelPendingTransaction,
  denyPendingTransaction,
  getPendingTransaction,
} from '@src/utils/api/pendingTransactionApi'
import {
  getSrpKey,
  PendingTransactionResponse,
  TransactionResponse,
} from '@src/utils/api/transactionApi'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { EntityWithMessage } from '@src/utils/types/EntityMessage'
import { useMemo, useState } from 'react'

import useSWR, { useSWRConfig } from 'swr'

export default function PendingTransactionsApprovalModal({
  open,
  action,
  pendingTransaction: pendingTransactionId,
  onClose,
}: //   modal,
{
  action: 'admin' | 'buyer' | 'seller'
  pendingTransaction?: PendingTransactionResponse['id']
  //   modal?: () => void
  open: boolean
  onClose: () => void
}) {
  const dispatchSuccessNotif = useSuccessNotification()
  const dispatchErrorNotif = useErrorNotification()
  const transactionActionHandler = (
    actionTransaction: Promise<
      EntityWithMessage<
        PendingTransactionResponse & {
          transaction?: TransactionResponse
        }
      >
    >
  ) => {
    actionTransaction
      .then((res) => {
        dispatchSuccessNotif(res.message)
      })
      .catch((err) => {
        const error = err as string[]
        error.forEach((ea) => {
          dispatchErrorNotif(ea)
        })
      })
  }
  const transactionAction = (key: 'approve' | 'deny' | 'cancel') => {
    switch (key) {
      case 'approve': {
        return () => transactionActionHandler(approvePendingTransaction(pendingTransaction!.id))
      }
      case 'deny': {
        return () => transactionActionHandler(denyPendingTransaction(pendingTransaction!.id))
      }
      case 'cancel': {
        return () => transactionActionHandler(cancelPendingTransaction(pendingTransaction!.id))
      }
      default: {
        throw new Error(`transactionAction is not in appropriate keys: approve, deny, cancel`)
      }
    }
  }

  const theme: Theme = useTheme()
  const { data: pendingTransaction } = useSWR([pendingTransactionId], getPendingTransaction)
  const [buttonLoading, setButtonLoading] = useState<boolean>(false)

  const { mutate } = useSWRConfig()
  const actionTitle = useMemo(() => {
    switch (action) {
      case 'admin': {
        return ['Approve', 'Cancel', 'Deny']
      }
      case 'buyer': {
        return ['Cancel']
      }
      case 'seller': {
        return ['Deny']
      }
      default: {
        return ['Approve', 'Cancel', 'Deny']
      }
    }
  }, [action])

  const handleApprove = () => {}

  return (
    <>
      <ModalWrapper open={open} containerSize="xs" onClose={onClose}>
        <Paper>
          <Box p={2}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Typography variant="h6">Pending Transactions</Typography>
                <Typography variant="body2" color="primary">
                  {actionTitle.map((ea, index, array) =>
                    !(index === array.length - 1) ? (
                      <Typography component="span" className="action-title" variant="body2">
                        {ea},{' '}
                      </Typography>
                    ) : (
                      <>
                        or
                        <Typography component="span" className="action-title" variant="body2">
                          {' '}
                          {ea}
                        </Typography>
                      </>
                    )
                  )}{' '}
                  Pending Transactions
                </Typography>
              </div>
              <div>
                <IconButton
                  style={{
                    padding: 4,
                  }}
                  onClick={() => {
                    onClose()
                  }}
                >
                  <Close />
                </IconButton>
              </div>
            </div>

            <Box my={2}>
              <Divider />
            </Box>
            <Box>
              {pendingTransaction ? (
                <>
                  <Paper
                    style={{
                      padding: 8,
                    }}
                  >
                    <Grid container>
                      <Grid item xs={6}>
                        <Field
                          title="Pending Transaction"
                          content={pendingTransaction.inventory.name}
                        />
                        <Field title="Quantity" content={pendingTransaction.quantity.toFixed(2)} />
                        <Field
                          title="Sales Price"
                          content={
                            <>
                              <span
                                style={{
                                  color: theme.palette.primary.main,
                                  fontWeight: 600,
                                }}
                              >
                                CCoins{' '}
                              </span>
                              {(
                                pendingTransaction.inventory[
                                  getSrpKey(pendingTransaction.caesar_buyer.account_type)
                                ] * pendingTransaction.quantity
                              ).toFixed(2)}
                            </>
                          }
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <Field
                          title="Buyer"
                          content={pendingTransaction.caesar_buyer.description}
                        />
                        <Field
                          title="Seller"
                          content={pendingTransaction.caesar_seller.description}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                  <Grid
                    style={{
                      marginTop: 16,
                    }}
                    container
                    spacing={1}
                    xs={12}
                  >
                    {(action === 'admin' || action === 'seller') && (
                      <Grid item xs={12}>
                        <AsyncButtonWithIcon
                          title="Approve Transaction"
                          Icon={AssignmentTurnedInOutlined}
                          loading={buttonLoading}
                          onClick={transactionAction('approve')}
                        />
                      </Grid>
                    )}
                    {(action === 'admin' || action === 'seller') && (
                      <Grid item xs={12}>
                        <AsyncButtonWithIcon
                          loading={buttonLoading}
                          title="Deny Transaction"
                          Icon={MoneyOffOutlined}
                          color="default"
                          style={{
                            color: theme.palette.primary.main,
                          }}
                          onClick={transactionAction('deny')}
                        />
                      </Grid>
                    )}
                    {(action === 'admin' || action === 'buyer') && (
                      <Grid item xs={12}>
                        <AsyncButtonWithIcon
                          loading={buttonLoading}
                          title="Cancel Transaction"
                          Icon={CancelPresentationOutlined}
                          color="primary"
                          variant="outlined"
                          onClick={transactionAction('cancel')}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Box my={2}>
                    <Divider />
                  </Box>
                  <Button
                    onClick={() => {
                      onClose()
                    }}
                    fullWidth
                    variant="contained"
                    color="default"
                  >
                    <Typography variant="body2">Close</Typography>
                  </Button>
                </>
              ) : (
                <LoadingScreen2 />
              )}
            </Box>
          </Box>
        </Paper>
      </ModalWrapper>
      <style jsx>
        {`
          .action-title {
            font-weight: 600;
          }
        `}
      </style>
    </>
  )
}

const Field = ({
  title,
  content,
}: {
  title: string | JSX.Element
  content: string | JSX.Element
}) => (
  <Box
    style={{
      marginBottom: 8,
    }}
  >
    <FormLabel variant="body2">{title}:</FormLabel>
    <Typography>{content} </Typography>
  </Box>
)

const AsyncButtonWithIcon = ({
  title,
  loading,
  Icon,
  style,
  ...restProps
}: {
  title: string
  loading: boolean
  Icon: SvgIconComponent
} & ButtonProps) => (
  <AsyncButton
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      ...style,
    }}
    loading={loading}
    disabled={loading}
    fullWidth
    {...restProps}
  >
    <Typography
      style={{
        fontWeight: 600,
        marginRight: 8,
      }}
      variant="body2"
    >
      {title}
    </Typography>
  </AsyncButton>
)
