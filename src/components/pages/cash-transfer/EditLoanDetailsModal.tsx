import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { formatIntoReadableDate } from '@src/utils/api/common'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { previousTuesday } from 'date-fns'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

type UpdateFormTypes = {
  interest?: number
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
    interest: loanDetails?.interest,
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
  }, [])

  useEffect(() => {
    setConvertedDate(
      `${newDate.year}-${newDate.month.padStart(2, '0')}-${newDate.date.padStart(
        2,
        '0'
      )}T${newDate.hour.padStart(2, '0')}:${newDate.minutes}`
    )
  }, [newDate.minutes])

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
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <FormLabel>Interest rate:</FormLabel>
                    <FormTextField
                      name="interest"
                      size="small"
                      value={updateForms.interest}
                      onChange={handleChange}
                    ></FormTextField>
                  </Grid>
                  <Grid item xs={8}>
                    <FormLabel>Date Created:</FormLabel>
                    <FormTextField
                      type="datetime-local"
                      name="created_at"
                      size="small"
                      value={convertedDate}
                      onChange={handleChange}
                    ></FormTextField>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box display="flex" justifyContent="flex-end">
              <Box mt={2}>
                <Button color="primary" variant="contained" onClick={() => {}}>
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
