/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable no-redeclare */
import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Link,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
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
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useSWRConfig } from 'swr'

type UpdateFormTypes = {
  override_interest?: number | null
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
  const defaultUpdateFormsRef = useRef<typeof updateForms>({
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

  const formatter = useCallback(
    (param: typeof updateForms) =>
      Object.entries(param).reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(value !== defaultUpdateFormsRef?.current?.[key as keyof typeof updateForms] && {
            [key]: value,
          }),
        }),
        {} as typeof updateForms
      ),
    []
  )

  const { mutate } = useSWRConfig()

  const submitFunction = useCallback(() => {
    console.log('updateForms', updateForms)
    return axios
      .patch(
        `/cash-transfer/${loanDetails?.id}`,
        formatter({
          override_interest: updateForms?.override_interest,
          created_at: updateForms?.created_at,
        })
      )
      .finally(() => {
        mutate(`/cash-transfer/${loanDetails?.id}`, null, true)
      })
  }, [loanDetails, updateForms, mutate, formatter])

  const { submit, error, loading, response } = useSubmitFormData({
    submitFunction,
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

  // const [isResetInterest, setIsResetInterest] = useState<boolean>(false)

  const handleResetInterest = useCallback(() => {
    // setUpdateForms((prev) => ({
    //   ...prev,
    //   override_interest: null,
    // }))
    // submit()
    axios
      .patch(`/cash-transfer/${loanDetails?.id}`, {
        override_interest: null,
      })
      .then(() => {
        notify({
          type: NotificationTypes.SUCCESS,
          message: `Loan Interest Updated`,
        })
      })
      .catch((err) => {
        extractMultipleErrorFromResponse(err as AxiosError).forEach((err) => {
          notify({
            type: NotificationTypes.ERROR,
            message: err,
          })
        })
      })
      .finally(() => {
        mutate(`/cash-transfer/${loanDetails?.id}`, null, true)
      })
  }, [loanDetails])

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
                  <Grid item xs={12} sm={4}>
                    <FormLabel>Interest rate:</FormLabel>
                    <FormNumberField
                      onChange={(newValue) => {
                        setUpdateForms((prev) => ({
                          ...prev,
                          override_interest: newValue,
                        }))
                      }}
                      value={updateForms?.override_interest || undefined}
                    />
                    {/* <FormTextField
                      name="override_interest"
                      size="small"
                      value={updateForms.override_interest}
                      onChange={handleChange}
                    ></FormTextField> */}
                    <ResetInterestRateLink
                      onClick={handleResetInterest}
                      // toggled={isResetInterest}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
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

const ResetInterestRateLink = ({ onClick }: { onClick: () => void }) => (
  <Tooltip
    arrow
    placement="left"
    title={
      <Typography variant="subtitle2">
        {/* Record as Transaction to {!toggled ? 'Caesar' : `Caesar's Bank Account`}{' '} */}
        Reset interest rate back to daily calculated amount
      </Typography>
    }
  >
    <Link component="button" color="textSecondary" variant="caption" onClick={onClick}>
      Reset Interest Rate
    </Link>
  </Tooltip>
)
