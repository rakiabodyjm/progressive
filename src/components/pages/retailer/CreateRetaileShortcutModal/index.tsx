import { Box, Button, Chip, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { AddOutlined, CloseOutlined } from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import { BasePickerProps } from '@material-ui/pickers/typings/BasePicker'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { userDataSelector } from '@src/redux/data/userSlice'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useSWR, { useSWRConfig } from 'swr'
import { DspResponseType } from '@src/utils/api/dspApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import useSubmitFormData from '@src/utils/hooks/useSubmitFormData'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { on } from 'events'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'

type FormValuesType = {
  first_name: string
  last_name: string
  phone_number: string
  address: string
  dsp: string
  subdistributor: string
}

export default function CreateRetailerShortcutModal({
  open,
  onClose,
  subd,
  dsp,
  triggerRender,
}: {
  open: boolean
  onClose: () => void
  subd: SubdistributorResponseType
  dsp: DspResponseType
  triggerRender?: () => void
}) {
  const [formValues, setFormValues] = useState<FormValuesType>({
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    dsp: dsp.id,
    subdistributor: subd.id,
  })
  const dispatchNotif = useNotification()
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    console.log(formValues)
  }
  console.log(formValues)

  const handleSubmit = () => {
    setLoading(true)
    if (open) {
      console.log('IF STATEMENT')
      axios
        .post('retailer/cash-transfer/', { ...formValues })
        .then((res) => {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: 'Retailer Created',
            })
          )
          console.log('RESPONSE:', res)
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((msg) => {
            dispatchNotif({
              type: NotificationTypes.ERROR,
              message: msg,
            })
          })
        })
        .finally(() => {
          onClose()
          setLoading(false)
          // mutate('/caesar/ct-balance')
          if (triggerRender) {
            triggerRender()
          }
        })
    }
  }
  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="sm">
      <Paper style={{ padding: 16 }} variant="outlined">
        <>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h5" color="primary">
                Create New Retailer Account
              </Typography>
              <Typography color="textSecondary" variant="body2">
                Complete the form to Create a new Retailer Account
              </Typography>
            </Box>
            <Box>
              <IconButton onClick={onClose}>
                <CloseOutlined />
              </IconButton>
            </Box>
          </Box>
          <Box>
            <Divider
              style={{
                margin: '16px 0',
              }}
            />
          </Box>
          <Grid spacing={1} container>
            <Grid item xs={12} sm={4}>
              <FormLabel> First Name</FormLabel>
              <FormTextField
                name="first_name"
                placeholder="Juan"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel> Last Name</FormLabel>
              <FormTextField
                name="last_name"
                placeholder="Dela Cruz"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormLabel> Phone Number</FormLabel>
              <FormTextField
                name="phone_number"
                placeholder="09125846548"
                onChange={handleChange}
              ></FormTextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormLabel> Subdistributor</FormLabel>
              <FormTextField
                name="subdistributor"
                disabled
                defaultValue={subd.name}
              ></FormTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormLabel> DSP</FormLabel>
              <FormTextField name="dsp" disabled defaultValue={dsp.dsp_code}></FormTextField>
            </Grid>
            <Grid item xs={12}>
              <FormLabel> Address</FormLabel>
              <FormTextField
                name="address"
                placeholder="Unit#/Bldg/Street/Brgy/City/Province"
                onChange={handleChange}
              ></FormTextField>
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end">
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Box>
          </Box>
        </>
      </Paper>
    </ModalWrapper>
  )
}
