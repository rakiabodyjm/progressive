import { Box, Divider, Typography } from '@material-ui/core'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import FeesTransaction from '@src/components/pages/cash-transfer/FeesTransactionForm'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

const DepositTypeTransaction = ({
  caesar_bank_to,
  from,
}: {
  caesar_bank_to?: CaesarBank
  from?: CaesarWalletResponse
}) => {
  const [withDrawForm, setWithDrawForm] = useState<{
    amount?: number
    caesar_bank_to?: CaesarBank
    from?: CaesarWalletResponse
    description?: string
    as?: CashTransferAs
  }>({
    amount: undefined,
    caesar_bank_to,
    from,
    description: undefined,
    as: CashTransferAs.DEPOSIT,
  })

  const { mutate } = useSWRConfig()
  const submitFunction = () =>
    axios
      .post('/cash-transfer/deposit', {
        ...withDrawForm,
        caesar_bank_to: withDrawForm.caesar_bank_to?.id,
        from: withDrawForm.from?.id,
      })
      .then((res) => res)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
      .finally(() => {
        mutate(`/caesar/${withDrawForm?.from?.id}`, null, true)
      })
  const { error, loading, response, submit } = useSubmitFormData({
    submitFunction,
  })

  // const dispatch = useDispatch()
  const dispatchNotif = useNotification()

  useEffect(() => {
    if (error) {
      ;(error as string[]).forEach((ea) => {
        dispatchNotif({
          message: ea,
          type: NotificationTypes.ERROR,
        })
      })
    }
    if (response) {
      dispatchNotif({
        message: `Deposit Successful`,
        type: NotificationTypes.SUCCESS,
      })
    }
  }, [error, response, dispatchNotif])
  return (
    <>
      <Box>
        <Typography variant="h4">Deposit</Typography>
        <Typography variant="body2" color="textSecondary">
          Deposit Money from Person
        </Typography>
      </Box>
      <Box my={2}>
        <Divider />
      </Box>
      <Box>
        <FormLabel>From Person</FormLabel>
        <ToCaesarAutoComplete
          onChange={(caesar) => {
            setWithDrawForm((prev) => ({
              ...prev,
              from: caesar,
            }))
          }}
          defaultValue={withDrawForm.from}
          disabled={!!from}
        />

        <Box my={2} />

        <FormLabel>To Bank Account</FormLabel>
        <ToCaesarBankAutoComplete
          onChange={(caesarBank) => {
            setWithDrawForm((prev) => ({
              ...prev,
              caesar_bank_from: caesarBank,
            }))
          }}
          value={withDrawForm.caesar_bank_to}
          disabled={!!caesar_bank_to}
        />

        {/* {caesar_bank_to && (
          <Box my={2}>
            <FeesTransaction
              onChange={(bank_fees) => {
                setWithDrawForm((prev) => ({
                  ...prev,
                  bank_fee: bank_fees,
                }))
              }}
              caesar_bank={caesar_bank_to}
            />
          </Box>
        )} */}

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

        {/* <Box my={2} />
        <FormLabel>Type</FormLabel>
        <AsDropDown
          // disabledKeys={['']}
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
        <AsyncButton loading={loading} disabled={loading} onClick={submit} fullWidth>
          SUBMIT
        </AsyncButton>
      </Box>
    </>
  )
}

export default DepositTypeTransaction
