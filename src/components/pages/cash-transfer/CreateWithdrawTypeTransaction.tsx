import { Box, Divider, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSWRConfig } from 'swr'

const WithDrawTypeTransaction = ({
  caesar_bank_from,
  to,
}: {
  caesar_bank_from?: CaesarBank
  to?: CaesarWalletResponse
}) => {
  const [withDrawForm, setWithDrawForm] = useState<{
    amount?: number
    caesar_bank_from?: CaesarBank
    to?: CaesarWalletResponse
    description?: string
    bank_fee?: number
    as: CashTransferAs
  }>({
    amount: undefined,
    caesar_bank_from,
    to,
    description: undefined,
    bank_fee: undefined,
    as: CashTransferAs.WITHDRAW,
  })
  const { mutate } = useSWRConfig()

  const submitter = () =>
    axios
      .post('/cash-transfer/withdraw', {
        ...withDrawForm,
        to: withDrawForm?.to?.id,
        caesar_bank_from: withDrawForm?.caesar_bank_from?.id,
      })
      .then((res) => res.data)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
      .finally(() => {
        mutate(`/caesar/${withDrawForm?.caesar_bank_from?.caesar?.id}`, null, true)
        mutate(`/cash-transfer/caesar-bank/${withDrawForm?.caesar_bank_from?.id}`, null, true)
      })

  const { error, loading, response, submit } = useSubmitFormData({
    submitFunction: submitter,
  })

  const dispatch = useDispatch()
  useEffect(() => {
    if (error) {
      ;(error as string[]).forEach((ea) => {
        dispatch(
          setNotification({
            message: ea,
            type: NotificationTypes.ERROR,
          })
        )
      })
    }
    if (response) {
      dispatch(
        setNotification({
          message: `Withdraw Successful`,
          type: NotificationTypes.SUCCESS,
        })
      )
    }
  }, [error, dispatch, response])

  return (
    <>
      <Box>
        <Typography variant="h4">Withdraw</Typography>
        <Typography variant="body2" color="textSecondary">
          Record Withdrawal from Bank Account
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <FormLabel>From Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank) => {
            setWithDrawForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          value={withDrawForm.caesar_bank_from}
          disabled={!!caesar_bank_from}
        />

        <Box my={2} />
        <FormLabel>To Person</FormLabel>
        <ToCaesarAutoComplete
          onChange={(caesar) => {
            setWithDrawForm((prev) => ({
              ...prev,
              to: caesar,
            }))
          }}
          value={withDrawForm.to}
          disabled={!!to}
        />

        <Box my={2}></Box>
        {withDrawForm.caesar_bank_from && (
          <FeesTransaction
            caesar_bank={withDrawForm.caesar_bank_from}
            onChange={(bank_fee) => {
              setWithDrawForm((prev) => ({
                ...prev,
                bank_fee,
              }))
            }}
          />
        )}

        <Box my={2}></Box>
        <FormLabel>Transaction Description</FormLabel>
        <FormTextField
          multiline
          name="description"
          rows={3}
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }}
        />

        <Box my={2} />
        <FormLabel>Amount</FormLabel>
        <FormNumberField
          onChange={(value) => {
            setWithDrawForm((prev) => ({
              ...prev,
              amount: value,
            }))
          }}
          value={withDrawForm.amount}
        />
        {/* 
        <Box my={2} />
        <FormLabel>Type</FormLabel>
        <AsDropDown
          onChange={(e) => {
            setWithDrawForm((prev) => ({
              ...prev,
              as: e.target.value,
            }))
          }}
        /> */}

        <Box my={2}>
          <Divider />
        </Box>
        <AsyncButton fullWidth onClick={submit} loading={loading} disabled={loading}>
          Submit
        </AsyncButton>
      </Box>
    </>
  )
}

export default WithDrawTypeTransaction
