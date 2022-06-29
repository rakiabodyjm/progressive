import { Box, Divider, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import AsDropDown from '@src/components/pages/cash-transfer/AsDropDownForm'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarBank, CashTransferAs } from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { request } from 'http'
import { ChangeEvent, ChangeEventHandler, useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'

type RequestForm = {
  amount?: number
  as?: CashTransferAs
  description?: string
  caesar_bank?: string
}

export default function RetailerRequestModal({
  openModal,
  handleClose,
  caesarId,
}: {
  openModal: boolean
  handleClose: () => void
  caesarId?: string
}) {
  const dispatch = useDispatch()
  const [paginateOptions, setPaginateOptions] = useState<PaginateFetchParameters>({
    limit: 100,
    page: 0,
  })

  const {
    data,
    error,
    isValidating,
    mutate: mutateCaesarBanks,
  } = useSWR<Paginated<CaesarBank>>(
    caesarId
      ? `/cash-transfer/caesar-bank/?caesar=${caesarId}&page=${paginateOptions.page}&limit=${paginateOptions.limit}`
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

  const [requestForm, setRequestForm] = useState<RequestForm>({
    as: undefined,
    amount: undefined,
    description: undefined,
    caesar_bank: undefined,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRequestForm((prev) => ({
      ...prev,
      description: e.target.value,
    }))
  }

  const [loading, setLoading] = useState<boolean>(false)

  const handleRequest = () => {
    setLoading(true)
    axios
      .post('/request', { ...requestForm })
      .then((res) => {
        dispatch(
          setNotification({
            type: NotificationTypes.SUCCESS,
            message: 'Request Created',
          })
        )
      })
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: 'Request Failed',
          })
        )
        throw extractMultipleErrorFromResponse(err)
      })
      .finally(() => {
        setLoading(false)
        handleClose()
      })
  }

  return (
    <ModalWrapper
      open={openModal}
      onClose={() => {
        handleClose()
      }}
      containerSize="xs"
    >
      <Paper style={{ padding: 16 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography color="primary" variant="h6">
              Create Request Transaction
            </Typography>
            <Typography variant="body2">Request a new Transaction</Typography>
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>
        <Box my={2}>
          <Divider />
        </Box>
        <Paper style={{ padding: 16 }}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormLabel>Transaction Type</FormLabel>
                <AsDropDown
                  disabledKeys={['DEPOSIT', 'WITHDRAW', 'LOAN_PAYMENT', 'TRANSFER']}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setRequestForm((prev) => ({
                        ...prev,
                        as: undefined,
                      }))
                    } else {
                      setRequestForm((prev) => ({
                        ...prev,
                        as: e.target.value as CashTransferAs,
                      }))
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Requester Account</FormLabel>
                <Autocomplete
                  onChange={(e, value) => {
                    setRequestForm((prev) => ({
                      ...prev,
                      caesar_bank: value?.id,
                    }))
                  }}
                  options={data?.data as CaesarBank[]}
                  getOptionLabel={(option) => option.description}
                  renderInput={(params) => (
                    <TextField {...params} size="small" variant="outlined" />
                  )}
                ></Autocomplete>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Amount</FormLabel>
                <FormNumberField
                  value={requestForm.amount}
                  onChange={(ea) => {
                    setRequestForm((prev) => ({
                      ...prev,
                      amount: ea,
                    }))
                  }}
                ></FormNumberField>
              </Grid>
              <Grid item xs={12}>
                <FormLabel>Description</FormLabel>
                <FormTextField
                  size="medium"
                  name="description"
                  onChange={handleChange}
                ></FormTextField>
              </Grid>
            </Grid>
            <Box pt={2} display="flex" justifyContent="flex-end">
              <Box>
                <AsyncButton
                  loading={loading}
                  disabled={loading}
                  onClick={() => {
                    handleRequest()
                  }}
                >
                  REQUEST
                </AsyncButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Paper>
    </ModalWrapper>
  )
}
