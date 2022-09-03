/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  Box,
  BoxProps,
  Divider,
  Grid,
  GridProps,
  IconButton,
  Link,
  Paper,
  PaperProps,
  Theme,
  Tooltip,
  Typography,
  TypographyProps,
} from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'
import ModalWrapper from '@components/ModalWrapper'
import { CloseOutlined } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { grey } from '@material-ui/core/colors'
import removeKeyFromObject from '@src/utils/removeKeyFromObject'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getRetailers } from '@src/utils/api/dspApi'

const LoanTypeTransaction = ({
  caesar_bank_from,
  caesar_bank_to,
}: {
  caesar_bank_from?: CaesarBank
  caesar_bank_to?: CaesarBank
}) => {
  const [transferForm, setTransferForm] = useState<{
    amount?: number
    caesar_bank_from?: CaesarBank
    // caesar_bank_to?: CaesarBank
    description?: string
    as?: CashTransferAs
    bank_fee?: number
    caesar_bank_to?: CaesarBank
    to?: CaesarWalletResponse
    from?: CaesarWalletResponse
  }>({
    amount: undefined,
    caesar_bank_from,
    caesar_bank_to,
    description: undefined,
    as: CashTransferAs.LOAN,
    bank_fee: undefined,
    to: undefined,
    from: undefined,
  })

  const user = useSelector(userDataSelector)

  const { data: retailersData } = useSWR([user?.dsp_id], getRetailers)
  const retailersDataMemoized = useMemo(() => retailersData?.data, [retailersData])
  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [fromCaesarEnabled, setFromCaesarEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [resetValue, setResetValue] = useState<number>()
  const [fromCaesaeEnabled, setFromCaesaeEnabled] = useState<boolean>(false)
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const dispatchNotif = useNotification()

  const { mutate } = useSWRConfig()
  const initialFrom = useRef({
    caesar_bank_from,
    // from,
  })
  const initialTo = useRef({
    caesar_bank_to,
    // to,
  })

  const submitAsLoanFunction = useCallback(
    () =>
      axios
        .post('/cash-transfer/loan', {
          ...formatFormValues(transferForm),
        })
        .then(({ data }) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: 'Loan Created',
          })
          return data
        })
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
        .finally(() => {
          mutate(`/caesar/${caesar_bank_from?.caesar?.id}`, null, true)
          if (caesar_bank_from?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_from.id}`, null, true)
          }
          if (caesar_bank_to?.id) {
            mutate(`/cash-transfer/caesar-bank/${caesar_bank_to.id}`, null, true)
          }
          setLoading(false)
        }),
    [transferForm, caesar_bank_from, caesar_bank_to, mutate, dispatchNotif]
  )

  const {
    error,
    loading: loanLoading,
    response,
    submit,
  } = useSubmitFormData({
    submitFunction: submitAsLoanFunction,
  })

  useEffect(() => {
    setLoading(loanLoading)
  }, [loanLoading])

  useEffect(() => {
    if (error) {
      ;(error as string[]).forEach((ea) => {
        dispatchNotif({
          type: NotificationTypes.ERROR,
          message: ea,
        })
      })
    }
  }, [error])

  useEffect(() => {
    if (response) {
      setTransferForm((prev) => ({
        ...prev,
        amount: undefined,
        // caesar_bank_to: undefined,
        description: '',
        as: CashTransferAs.LOAN,
        bank_fee: undefined,
        // to: undefined,
      }))
      setResetValue(Date.now())
    }
  }, [response])

  useEffect(() => {
    if (toCaesarEnabled) {
      setTransferForm((prev) => ({
        ...prev,
        caesar_bank_to: undefined,
      }))
    } else {
      setTransferForm((prev) => ({
        ...prev,
        to: undefined,
      }))
    }
  }, [toCaesarEnabled])

  return (
    <>
      <Box>
        <Typography variant="h4">Loan</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Loan from Account's Bank to Bank/Person
        </Typography>
      </Box>
      <Margin2>
        <Divider />
      </Margin2>
      <Box>
        {fromCaesaeEnabled ? (
          <>
            <FormLabel>From Caesar Account</FormLabel>
            <ToCaesarAutoComplete
              onChange={(caesarSelected) => {
                setTransferForm((prev) => ({
                  ...prev,
                  from: caesarSelected,
                }))
              }}
              filter={(res) => res.filter((ea) => ea.id !== caesar_bank_from?.caesar.id)}
              defaultValue={transferForm.from}
              value={transferForm.from}
              key={transferForm.amount}
              disabled={!!caesar_bank_from?.caesar}
            />
          </>
        ) : (
          <>
            <FormLabel>From Bank Account</FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(caesarBank) => {
                setTransferForm((prev) => ({
                  ...prev,
                  caesar_bank_from: caesarBank,
                }))
              }}
              defaultValue={transferForm.caesar_bank_from}
              disabled={!!caesar_bank_from}
            />
          </>
        )}

        {/* <FormLabel>From {fromCaesarEnabled ? 'Caesar' : 'Bank'} Account</FormLabel>
        <ToCaesarAndCaesarBank
          caesarBank={initialFrom.current.caesar_bank_from}
          caesarMode={fromCaesarEnabled}
          onChange={(param) => {
            setTransferForm((prev) => ({
              ...prev,
              ...(fromCaesarEnabled
                ? {
                    from: (param as CaesarWalletResponse) || undefined,
                    caesar_bank_from: undefined,
                  }
                : { caesar_bank_from: (param as CaesarBank) || undefined, from: undefined }),
            }))
          }}
          disabled
        />

        <Tooltip
          arrow
          placement="bottom"
          title={<Typography variant="subtitle2">Record Transaction FROM </Typography>}
        >
          <Link
            component="button"
            color="textSecondary"
            variant="caption"
            onClick={() => {
              setFromCaesarEnabled((prev) => !prev)
            }}
          >
            {fromCaesarEnabled ? `Use Bank Account instead` : `Use Caesar Account instead`}
          </Link>
        </Tooltip> */}

        {toCaesarEnabled ? (
          <>
            <FormLabel>To Caesar Account</FormLabel>
            <ToCaesarAutoComplete
              onChange={(caesarSelected) => {
                setTransferForm((prev) => ({
                  ...prev,
                  to: caesarSelected,
                }))
              }}
              filter={(res) => res.filter((ea) => ea.id !== caesar_bank_from?.caesar.id)}
              // value={transferForm.to}
              key={transferForm.amount}
            />
          </>
        ) : (
          <>
            <FormLabel>To Bank Account</FormLabel>
            <ToCaesarBankAutoComplete
              onChange={(caesarBank) => {
                setTransferForm((prev) => ({
                  ...prev,
                  caesar_bank_to: caesarBank,
                  to: undefined,
                }))
              }}
              filter={(args) => {
                const retunrObject = args
                  .filter((ea) => ea.caesar !== null)
                  .filter((caesarBank) =>
                    retailersDataMemoized?.some(
                      (ea) => ea.caesar_wallet.id === caesarBank.caesar.id
                    )
                  )
                return retunrObject
              }}
              defaultValue={transferForm?.caesar_bank_to || undefined}
              disabled={!!caesar_bank_to}
              // value={transferForm.caesar_bank_to}
              key={transferForm.amount}
            />
          </>
        )}

        <Tooltip
          arrow
          placement="bottom"
          title={<Typography variant="subtitle2">Record Transaction TO</Typography>}
        >
          <Link
            component="button"
            color="textSecondary"
            variant="caption"
            onClick={() => {
              if (toCaesarEnabled) {
                setToCaesarEnabled(false)
              } else {
                setToCaesarEnabled(true)
              }
            }}
          >
            {toCaesarEnabled ? 'Use Bank Account instead' : 'Use Caesar Account instead'}
          </Link>
        </Tooltip>

        {/**
         *
         *
         * TO Caesar enabled
         *
         *
         *
         */}

        <Margin2></Margin2>

        {transferForm?.caesar_bank_from && (
          <Margin2>
            <FeesTransaction
              triggerReset={resetValue}
              newValue={transferForm.bank_fee}
              onChange={(bank_fee: number | undefined) => {
                setTransferForm((prev) => ({
                  ...prev,
                  bank_fee,
                }))
              }}
              caesar_bank={transferForm?.caesar_bank_from}
            />
          </Margin2>
        )}

        <Margin2></Margin2>
        <FormLabel>Transaction Description</FormLabel>
        <FormTextField
          multiline
          name="description"
          rows={3}
          onChange={(e) => {
            setTransferForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
          value={transferForm.description}
        />

        <Margin2 />
        <FormLabel>Amount</FormLabel>
        <FormNumberField
          onChange={(value) => {
            setTransferForm((prev) => ({
              ...prev,
              amount: value,
            }))
          }}
          value={transferForm.amount}
        />

        <Margin2 />

        <Margin2>
          <Divider />
        </Margin2>
        <AsyncButton
          onClick={() => {
            submit()
            // submitAsLoanFunction()
            // setConfirmationModal((prev) => !prev)
          }}
          loading={loading}
          disabled={loading}
          fullWidth
        >
          Submit
        </AsyncButton>
      </Box>
      {/* <LoanConfirmationModal
        open={confirmationModal}
        submitFunction={() => {}}
        loanValues={transferForm}
        onClose={() => {
          setConfirmationModal(false)
        }}
      /> */}
    </>
  )
}

export default LoanTypeTransaction

const formatFormValues = (params: {
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
  from?: CaesarWalletResponse
  caesar_bank_to?: CaesarBank
  amount?: number
  message?: string
  description?: string
}) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (value && typeof value === 'object') {
      return { ...acc, [key]: value.id }
    }
    return acc
  }, params)

function LoanConfirmationModal({
  open,
  submitFunction,
  onClose,
  loanValues,
}: {
  open: boolean
  submitFunction(): void
  onClose(): void
  loanValues: {
    from?: CaesarWalletResponse
    to?: CaesarWalletResponse
    caesar_bank_from?: CaesarBank
    caesar_bank_to?: CaesarBank
    message?: string
    description?: string
    amount?: number
  }
}) {
  return (
    <>
      <ModalWrapper open={open} onClose={onClose} containerSize="xs">
        <Paper>
          <Box className="loan-confirmation-container" p={2}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <div>
                <Typography variant="h6" color="primary">
                  Confirmation
                </Typography>
                <Typography variant="body2">Confirm Loan Details</Typography>
              </div>

              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Box>

            <Divider />
            <Grid container>
              <Grid item xs={6}>
                <T variant="caption" color="primary">
                  From:
                </T>
                <T variant="body2">{loanValues?.from ? 'Caesar' : 'Bank'}</T>
              </Grid>
              <GridOpposite item xs={6}>
                <T variant="caption" color="primary">
                  To:
                </T>
                <T variant="body2">{loanValues?.from ? 'Caesar' : 'Bank'}</T>
              </GridOpposite>
            </Grid>

            <Grid container>
              <Grid item>
                <DarkPaper
                  style={{
                    padding: 16,
                  }}
                ></DarkPaper>
              </Grid>
              <GridOpposite item xs={6}></GridOpposite>
            </Grid>
          </Box>
        </Paper>
      </ModalWrapper>
      <style jsx>{`
        .loan-confirmation-container > * {
          margin-bottom: 16px;
        }
      `}</style>
    </>
  )
}

const T = (props: TypographyProps) => (
  <Typography {...removeKeyFromObject(props, ['children'])}>{props?.children}</Typography>
)

const GridOpposite = (props: GridProps) => (
  <Grid
    style={{
      display: 'flex',
      alignItems: 'flex-end',
      flexDirection: 'column',
      ...props?.style,
    }}
    {...removeKeyFromObject(props, ['style', 'children'])}
  >
    {props?.children}
  </Grid>
)

const DarkPaper = ({ style, children, ...props }: PaperProps) => {
  const theme: Theme = useTheme()
  return (
    <Paper
      style={{
        background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
        ...style,
      }}
      {...props}
    >
      {children}
    </Paper>
  )
}

const Margin2 = ({ children, ...props }: BoxProps) => (
  <Box my={2} {...props}>
    {children}
  </Box>
)
