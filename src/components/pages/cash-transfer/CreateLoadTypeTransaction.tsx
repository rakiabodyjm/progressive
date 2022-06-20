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
import { AutocompleteProps } from '@material-ui/lab'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import useNotification, { useErrorNotification } from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { Bank, Caesar, CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'
import ModalWrapper from '@components/ModalWrapper'
import { CloseOutlined } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { grey } from '@material-ui/core/colors'
import removeKeyFromObject from '@src/utils/removeKeyFromObject'
import ToCaesarAndCaesarBank from '@src/components/pages/cash-transfer/ToCaesarAndCaesarBank'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'

const LoadTypeTransaction = ({
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
    as: CashTransferAs.LOAD,
    bank_fee: undefined,
    to: undefined,
    from: undefined,
  })

  const telcoNetwork = [
    'Smart Communications',
    'Globe Telecommunications',
    'Dito Telecommunity',
    'Shoppe',
  ]

  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    page: 0,
    limit: 100,
  })

  const {
    data,
    isValidating,
    mutate: mutateCaesarBanks,
  } = useSWR<Paginated<CaesarBank>>(`/cash-transfer/caesar-bank/`, (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
  )

  // const [filteredBanks, setFilterBanks] = useState<CaesarBank[]>([])

  // useEffect(() => {
  //   data?.data
  //     .filter((ea) => telcoNetwork.includes(ea.bank.name))
  //     .map((ea) =>
  //       setFilterBanks((prev) => ({
  //         ...prev,
  //       }))
  //     )
  // }, [data?.data])
  // console.log('BANKS FILTERED', filterBanks)

  const [toCaesarEnabled, setToCaesarEnabled] = useState<boolean>(false)
  const [fromCaesarEnabled, setFromCaesarEnabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [resetValue, setResetValue] = useState<number>()
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

  const submitAsLoadFunction = useCallback(
    () =>
      axios
        .post('/cash-transfer/load', {
          ...formatFormValues(transferForm),
        })
        .then(({ data }) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: `Load Successful`,
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
    loading: loadLoading,
    response,
    submit,
  } = useSubmitFormData({
    submitFunction: submitAsLoadFunction,
  })

  useEffect(() => {
    setLoading(loadLoading)
  }, [loadLoading])

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
        as: CashTransferAs.LOAD,
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

  const handleSubmit = () => {
    if (transferForm.amount !== 0) {
      submit()
    } else {
      dispatchNotif({
        type: NotificationTypes.ERROR,
        message: 'Amount cannot be zero',
      })
    }
  }

  return (
    <>
      <Box>
        <Typography variant="h4">Load</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Load from Account's Bank to Bank/Person
        </Typography>
      </Box>
      <Margin2>
        <Divider />
      </Margin2>
      <Box>
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

        <Margin2></Margin2>
        <FormLabel>To {toCaesarEnabled ? 'Caesar' : 'Bank'} Account</FormLabel>
        <ToCaesarBankAutoComplete
          filter={(filterBanks) =>
            filterBanks.filter(
              (ea) => ea.account_number !== null && telcoNetwork.includes(ea.bank.name)
            )
          }
          onChange={(caesarBank) => {
            setTransferForm((prev) => ({
              ...prev,
              caesar_bank_to: caesarBank,
            }))
          }}
        />

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
            handleSubmit()
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

export default LoadTypeTransaction

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
