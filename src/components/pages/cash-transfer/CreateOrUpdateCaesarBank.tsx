import { Box, CircularProgress, Divider } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { Bank, CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useCallback, useMemo, useRef, useState } from 'react'
import useSWR, { KeyedMutator } from 'swr'
import AsyncButton from '@src/components/AsyncButton'
import useIsCtOperatorOrAdmin from '@src/utils/hooks/useIsCtOperatorOrAdmin'

type CreateCaesarBank = {
  caesar: string
  bank: number
  description?: string
  account_number?: string
}

const CreateOrUpdateCaesarBank = ({
  caesar,
  mutate,
  updateValues,
  updateValueId,
  onClose,
}: {
  mutate: KeyedMutator<Paginated<CaesarBank>> | KeyedMutator<CaesarBank>
  caesar: string
  updateValues?: Partial<
    Omit<
      CreateCaesarBank & {
        balance: number
      },
      'id'
    >
  >
  updateValueId?: CaesarBank['id']
  onClose: () => void
}) => {
  const [formValues, setFormValues] = useState<
    Partial<
      Omit<
        CreateCaesarBank & {
          balance: number
        },
        'id'
      >
    >
  >({
    bank: undefined,
    caesar,
    description: undefined,
    account_number: undefined,
    balance: undefined,
    ...updateValues,
  })
  // const updateValuesRef = useRef<typeof updateValues | undefined>()

  const banksCanEdit: string[] = []

  const isUpdateMode = useMemo(() => !!updateValues, [updateValues])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const dispatchSuccess = useSuccessNotification()
  const dispatchError = useErrorNotification()

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true)
    if (isUpdateMode) {
      axios
        .patch(
          `/cash-transfer/caesar-bank/${updateValueId}`,

          Object.entries(formValues).reduce((acc, [key, value]) => {
            if (updateValues && updateValues[key as keyof typeof updateValues] !== value) {
              return {
                ...acc,
                [key]: value,
              }
            }
            return acc
          }, {})
        )
        .then((res) => {
          dispatchSuccess(`Caesar's Bank Account Updated`)
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

      return
    }
    axios
      .post('/cash-transfer/caesar-bank', {
        ...formValues,
      })
      .then((res) => {
        dispatchSuccess(`Caesar Bank Created`)
        setFormValues({
          bank: undefined,
          caesar,
          description: '',
          account_number: '',
        })
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
  }, [isUpdateMode, dispatchError, dispatchSuccess, formValues, mutate])

  const { data: bankFetchValue } = useSWR(
    updateValues?.bank ? `/cash-transfer/bank/${updateValues.bank}` : undefined,
    (url) => axios.get(url).then((res) => res.data)
  )

  const isEligible = useIsCtOperatorOrAdmin(['ct-admin'])
  const isEligibleAsDsp = useIsCtOperatorOrAdmin(['dsp'])

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
        value={formValues.caesar}
        disabled
      />
      <Box my={1} />

      <FormLabel>Bank</FormLabel>
      {!updateValues?.bank || bankFetchValue ? (
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
          defaultValue={bankFetchValue}
          key={formValues.caesar}
        />
      ) : (
        <Box display="flex" width="100%" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      <Box my={2} />
      <FormLabel>Account Number</FormLabel>
      <FormTextField
        name="account_number"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }}
        value={formValues.account_number}
      />
      <Box my={2} />
      <FormLabel>Description</FormLabel>
      <FormTextField
        name="description"
        onChange={(e) => {
          setFormValues((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }))
        }}
        value={formValues.description}
      />

      {isEligible ||
        (isEligibleAsDsp &&
          bankFetchValue &&
          banksCanEdit.includes(bankFetchValue.name as string) && (
            <>
              <Box my={2} />
              <FormLabel>Balance</FormLabel>
              <FormTextField
                type="number"
                name="balance"
                onChange={(e) => {
                  setFormValues((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }}
                value={formValues.balance}
              />
            </>
          ))}

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

export default CreateOrUpdateCaesarBank
