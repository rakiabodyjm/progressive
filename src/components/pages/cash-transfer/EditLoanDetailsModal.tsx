/* eslint-disable no-underscore-dangle */
/* eslint-disable no-redeclare */
import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import FormNumberField from '@src/components/FormNumberField'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import axios, { AxiosError } from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

type UpdateFormTypes = {
  override_interest?: number
  created_at?: string
}
type NewDateType = {
  year: string
  month: string
  date: string
  hour: string
  minutes: string
}

export default function EditLoanDetailsModal({
  open,
  onClose,
  loanDetails,
}: {
  open: boolean
  onClose: () => void
  loanDetails?: CashTransferResponse
}) {
  const [newDate, setNewDate] = useState<NewDateType>({
    year: '',
    date: '',
    month: '',
    hour: '',
    minutes: '',
  })
  const [convertedDate, setConvertedDate] = useState<string>()
  const [updateForms, setUpdateForms] = useState<UpdateFormTypes>({
    override_interest: loanDetails?.interest,
    created_at: convertedDate,
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUpdateForms((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
    if (e.target.name === 'created_at') {
      setConvertedDate(e.target.value)
    }
  }

  const computeDate = (transanctionDate?: string) => {
    const date = new Date(transanctionDate as string)
    setNewDate({
      year: date.getFullYear().toString(),
      date: date.getDate().toString(),
      month: (date.getMonth() + 1).toString(),
      hour: date.getHours().toString(),
      minutes: date.getMinutes().toString(),
    })
  }
  useEffect(() => {
    computeDate(loanDetails?.created_at.toString())
  }, [loanDetails?.created_at])

  useEffect(() => {
    setConvertedDate(
      `${newDate.year}-${newDate.month.padStart(2, '0')}-${newDate.date.padStart(
        2,
        '0'
      )}T${newDate.hour.padStart(2, '0')}:${newDate.minutes.padStart(2, '0')}`
    )
  }, [newDate])

  const { mutate } = useSWRConfig()
  const { submit, error, loading, response } = useSubmitFormData({
    submitFunction: () =>
      axios
        .patch(`/cash-transfer/${loanDetails?.id}`, {
          override_interest: updateForms?.override_interest,
          created_at: updateForms?.created_at,
        })
        .finally(() => {
          mutate(`/cash-transfer/${loanDetails?.id}`, null, true)
        }),
  })

  const notify = useNotification()
  useEffect(() => {
    if (error) {
      extractMultipleErrorFromResponse(error as AxiosError).forEach((err) => {
        notify({
          type: NotificationTypes.ERROR,
          message: err,
        })
      })
    }
  }, [error, notify])

  useEffect(() => {
    if (response) {
      notify({
        type: NotificationTypes.SUCCESS,
        message: `Loan Updated Successfully`,
      })
    }
  }, [response, notify])

  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="xs">
      <Paper style={{ padding: 16 }} variant="outlined">
        {loanDetails && (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <Typography variant="h5" color="primary">
                  Edit Details
                </Typography>
                <Typography variant="body2">Edit the details of the loan transaction</Typography>
              </Box>
              <Box>
                <IconButton onClick={onClose}>
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Box my={2}>
                  <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormLabel>Interest rate:</FormLabel>
                    <FormNumberField
                      onChange={(newValue) => {
                        setUpdateForms((prev) => ({
                          ...prev,
                          override_interest: newValue,
                        }))
                      }}
                      value={updateForms?.override_interest}
                    />
                    {/* <FormTextField
                      name="override_interest"
                      size="small"
                      value={updateForms.override_interest}
                      onChange={handleChange}
                    ></FormTextField> */}
                  </Grid>
                  <Grid item xs={8}>
                    <FormLabel>Date Created:</FormLabel>
                    <FormTextField
                      type="datetime-local"
                      name="created_at"
                      size="small"
                      value={convertedDate}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mt={2}>
                <Button color="primary" variant="contained" onClick={submit}>
                  Update
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </ModalWrapper>
  )
}
