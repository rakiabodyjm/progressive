import {
  Box,
  Button,
  colors,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { CloseOutlined, DoubleArrow, Edit } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoCurrency,
  formatIntoReadableDate,
} from '@src/utils/api/common'
import { getWalletById } from '@src/utils/api/walletApi'
import useNotification from '@src/utils/hooks/useNotification'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'

import axios, { AxiosError } from 'axios'
import router from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import useSWR from 'swr'

const asType = [
  {
    value: 'TRANSFER',
  },
  {
    value: 'LOAN',
  },
  {
    value: 'LOAD',
  },
  {
    value: 'WITHDRAW',
  },
  {
    value: 'DEPOSIT',
  },
  {
    value: 'DEPOSIT',
  },
  {
    value: 'LOAN PAYMENT',
  },
  {
    value: 'LOAD PAYMENT',
  },
]

type UpdateFormTypes = {
  created_at?: string
  message?: string
  as?: string
  description?: string
}
type NewDateType = {
  year: string
  month: string
  date: string
  hour: string
  minutes: string
}

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
}))

export default function EditTransactionModal({
  open,
  onClose,
  ct_id,
  mutate,
}: {
  open: boolean
  onClose: () => void
  ct_id: string
  mutate: () => void
}) {
  const { data: ct_data, mutate: mutateCT } = useSWR<CashTransferResponse>(
    `/cash-transfer/${ct_id}`,
    (url) =>
      axios
        .get(url)
        .then((res) => res.data)
        .then(async (cashTransferData) => ({
          ...cashTransferData,
          ...(cashTransferData.from && { from: await getWalletById(cashTransferData.from.id) }),
          ...(cashTransferData.to && { to: await getWalletById(cashTransferData.to.id) }),
        }))
        .then((res) => res)
  )

  const [convertedDate, setConvertedDate] = useState<string>()
  const [updateForms, setUpdateForms] = useState<UpdateFormTypes>({
    created_at: convertedDate,
    description: ct_data?.description,
    message: ct_data?.message,
    as: ct_data?.as,
  })
  const [newDate, setNewDate] = useState<NewDateType>({
    year: '',
    date: '',
    month: '',
    hour: '',
    minutes: '',
  })
  const [editField, setEditField] = useState({
    editMessage: false,
    editDescription: false,
    editAs: false,
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
    computeDate(ct_data?.created_at.toString())
  }, [ct_data?.created_at])

  useEffect(() => {
    setConvertedDate(
      `${newDate.year}-${newDate.month.padStart(2, '0')}-${newDate.date.padStart(
        2,
        '0'
      )}T${newDate.hour.padStart(2, '0')}:${newDate.minutes.padStart(2, '0')}`
    )
  }, [newDate])

  const dispatchNotif = useNotification()
  const classes = useStyles()

  const handleSubmit = () => {
    if (ct_data) {
      axios
        .patch(`/cash-transfer/${ct_data.id}`, updateForms)
        .then((res) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: 'Update Saved',
          })
        })
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
        .finally(() => {
          mutate()
          mutateCT()
          onClose()
        })
    }
  }

  const handleDelete = () => {
    if (ct_data) {
      axios
        .delete(`/cash-transfer/${ct_data.id}`)
        .then((res) => {
          dispatchNotif({
            type: NotificationTypes.SUCCESS,
            message: 'Transaction Deleted',
          })
        })
        .catch((err) => {
          throw extractMultipleErrorFromResponse(err)
        })
        .finally(() => {
          mutate()
          mutateCT()
          onClose()
        })
    }
  }
  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="sm">
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        {ct_data ? (
          <>
            <Box display="flex" justifyContent="space-between">
              <Box>
                <FormLabel>Transaction Type</FormLabel>
                <Typography variant="h5">{ct_data?.as}</Typography>
              </Box>
              <Box>
                <IconButton onClick={onClose}>
                  {/* onClick={onClose} */}
                  <CloseOutlined />
                </IconButton>
              </Box>
            </Box>

            <Box>
              <Box>
                <Grid item xs={12}>
                  <Divider style={{ marginTop: 8, marginBottom: 8 }} />
                </Grid>

                <Grid container spacing={2} className={classes.gridContainer}>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Reference Number:</FormLabel>
                    <Typography> {ct_data.ref_num}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Date of Transaction:</FormLabel>
                    <FormTextField
                      type="datetime-local"
                      name="created_at"
                      size="small"
                      value={convertedDate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>From:</FormLabel>
                    <Typography>
                      {ct_data.from
                        ? ct_data.from.description
                        : ct_data.caesar_bank_from.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>To:</FormLabel>
                    <Typography>
                      {ct_data.to ? ct_data.to.description : ct_data.caesar_bank_to.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Description:</FormLabel>
                    <Box display="flex">
                      <Box maxHeight={160} style={{ overflowY: 'auto' }} flexGrow={1}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          defaultValue={ct_data.description}
                          disabled={!editField.editDescription}
                          onChange={(e) => {
                            setUpdateForms((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }}
                        ></TextField>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => {
                            if (editField.editDescription) {
                              setEditField((prev) => ({
                                ...prev,
                                editDescription: false,
                              }))
                            } else {
                              setEditField((prev) => ({
                                ...prev,
                                editDescription: true,
                              }))
                            }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Message:</FormLabel>
                    <Box display="flex">
                      <Box maxHeight={160} style={{ overflowY: 'auto' }} flexGrow={1}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          defaultValue={ct_data.message}
                          disabled={!editField.editMessage}
                          onChange={(e) => {
                            setUpdateForms((prev) => ({
                              ...prev,
                              message: e.target.value,
                            }))
                          }}
                        ></TextField>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => {
                            if (editField.editMessage) {
                              setEditField((prev) => ({
                                ...prev,
                                editMessage: false,
                              }))
                            } else {
                              setEditField((prev) => ({
                                ...prev,
                                editMessage: true,
                              }))
                            }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Type:</FormLabel>
                    <Box display="flex">
                      <Box maxHeight={160} style={{ overflowY: 'auto' }} flexGrow={1}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          defaultValue={ct_data.as}
                          select
                          disabled={!editField.editAs}
                          onChange={(e) => {
                            setUpdateForms((prev) => ({
                              ...prev,
                              as: e.target.value,
                            }))
                          }}
                        >
                          {asType.map((ea, i) => (
                            <MenuItem key={i} value={ea.value}>
                              <Typography variant="body1">{ea.value}</Typography>
                            </MenuItem>
                          ))}
                        </TextField>
                      </Box>
                      <Box>
                        <IconButton
                          onClick={() => {
                            if (editField.editAs) {
                              setEditField((prev) => ({
                                ...prev,
                                editAs: false,
                              }))
                            } else {
                              setEditField((prev) => ({
                                ...prev,
                                editAs: true,
                              }))
                            }
                          }}
                        >
                          <Edit />
                        </IconButton>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormLabel>Amount:</FormLabel>
                    <Typography>{formatIntoCurrency(ct_data.amount)}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            <Box display="flex" justifyContent="flex-end">
              <Box mt={2} pr={2}>
                <Button variant="contained" onClick={handleDelete}>
                  <Typography color="error">DELETE</Typography>
                </Button>
              </Box>
              <Box mt={2}>
                <Button color="primary" variant="contained" onClick={handleSubmit}>
                  UPDATE
                </Button>
              </Box>
            </Box>
          </>
        ) : (
          <LoadingScreen2 />
        )}
      </Paper>
    </ModalWrapper>
  )
}
