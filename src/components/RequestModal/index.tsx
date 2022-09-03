import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Theme,
  Typography,
} from '@material-ui/core'
import { Check, CloseOutlined } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import RoleBadge from '@src/components/RoleBadge'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse, formatIntoReadableDate } from '@src/utils/api/common'
import {
  CashTransferRequestTypes,
  CashTransferResponse,
  RequestStatus,
} from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
type ControButtonTypes = {
  approved: boolean
  edit: boolean
  decline: boolean
}

export default function RequestModal({
  open,
  handleClose,
  requestData,
  triggerRequestMutate,
}: {
  open: boolean
  handleClose: () => void
  requestData: CashTransferRequestTypes
  triggerRequestMutate: () => void
}) {
  const theme: Theme = useTheme()

  const {
    data: cashTransfers,
    error,
    isValidating,
    mutate: mutateCashTransferList,
  } = useSWR<Paginated<CashTransferResponse>>('/cash-transfer', (url) =>
    axios.get(url).then((res) => res.data)
  )

  const [isButtonClick, setIsButtonClick] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [enableSubmit, setEnableSubmit] = useState<boolean>(false)
  const [editAmount, setEditAmount] = useState<boolean>(false)
  const [checkIcon, setCheckIcon] = useState<boolean>(false)

  const [verifyReferenceNumber, setVerifyReferenceNumber] = useState<string>()
  const [refNumToSend, setRefNumToSend] = useState<string>()
  const dispatch = useDispatch()

  const [updateAmount, setUpdateAmount] = useState<number>(Number(requestData?.amount))

  useEffect(() => {
    setEnableSubmit(false)
    setCheckIcon(false)
    cashTransfers?.data
      .filter((ea) => ea.ref_num === verifyReferenceNumber)
      .map((ea) => {
        if (ea.ref_num === verifyReferenceNumber) {
          if (ea.amount === requestData.amount) {
            setRefNumToSend(ea.ref_num)
            setEnableSubmit(true)
            setCheckIcon(true)

            dispatch(
              setNotification({
                type: NotificationTypes.SUCCESS,
                message: 'Reference Number Found',
              })
            )
            return ea
          }
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: 'Amount of reference number is not valid',
            })
          )
        }

        return ea
      })
  }, [verifyReferenceNumber])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerifyReferenceNumber(e.target.value)
  }

  const handleUpdate = () => {
    setLoading(false)
    axios
      .patch(`/request/${requestData.id}`, {
        amount: Number(updateAmount),
      })
      .then((res) => {
        handleClose()
        dispatch(
          setNotification({
            type: NotificationTypes.SUCCESS,
            message: 'Update Successful',
          })
        )
      })
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: 'Update Unsuccessful',
          })
        )
      })
      .finally(() => {
        setLoading(false)
        handleClose()
        triggerRequestMutate()
      })
  }

  const handleApproved = () => {
    setLoading(true)
    axios
      .patch(`/request/${requestData.id}`, {
        ct_ref: refNumToSend,
        status: RequestStatus.APPROVED,
      })
      .then((res) => {
        handleClose()
        dispatch(
          setNotification({
            type: NotificationTypes.SUCCESS,
            message: 'Reference Number confirmed',
          })
        )
      })
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: 'Reference number is already used',
          })
        )
      })
      .finally(() => {
        setLoading(false)
        handleClose()
        triggerRequestMutate()
      })
  }

  const handleDecline = () => {
    setLoading(false)
    axios
      .patch(`/request/${requestData.id}`, {
        is_declined: true,
      })
      .then((res) => {
        dispatch(
          setNotification({
            type: NotificationTypes.SUCCESS,
            message: 'Request Declined',
          })
        )
        handleClose()
      })
      .catch((err) => {
        throw extractErrorFromResponse(err)
      })
      .finally(() => {
        setLoading(false)
        handleClose()
        triggerRequestMutate()
      })
  }
  return (
    <ModalWrapper
      open={open}
      containerSize="xs"
      onClose={() => {
        setVisible(false)
      }}
    >
      <Paper style={{ padding: 16 }}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <FormLabel>Request Type</FormLabel>
            <Typography variant="h5">{requestData.as}</Typography>
          </Box>
          <Box>
            <IconButton
              onClick={() => {
                handleClose()
              }}
            >
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>
        <Box>
          <Box>
            <Grid item xs={12}>
              <Divider style={{ marginTop: 8, marginBottom: 8 }} />
            </Grid>

            <Paper style={{ padding: 16 }}>
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <FormLabel>Date Requested:</FormLabel>
                  <Typography>
                    {requestData && formatIntoReadableDate(requestData.created_at as Date)}
                  </Typography>
                </Box>
                <Box>
                  <RoleBadge disablePopUp>{requestData.status}</RoleBadge>
                </Box>
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={12}></Grid>
                <Grid item xs={5}>
                  <FormLabel>Requester:</FormLabel>
                  <Typography>{requestData.requester}</Typography>
                </Grid>

                <Grid item xs={7}>
                  <FormLabel>Amount:</FormLabel>
                  {editAmount ? (
                    <>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        defaultValue={requestData.amount}
                        disabled={!editAmount}
                        onChange={(e) => {
                          setUpdateAmount(Number(e.target.value))
                        }}
                      ></TextField>
                    </>
                  ) : (
                    <>
                      <Typography>{requestData.amount}</Typography>
                    </>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormLabel>Description:</FormLabel>
                  <Typography noWrap>{requestData.description}</Typography>
                </Grid>

                <Grid item xs={12}></Grid>
              </Grid>
              {!isButtonClick && (
                <Box pt={2} display="flex" justifyContent="space-evenly">
                  <AsyncButton
                    variant="contained"
                    style={{
                      display:
                        visible ||
                        editAmount ||
                        requestData.status === RequestStatus.APPROVED ||
                        requestData.status === RequestStatus.DECLINED
                          ? 'none'
                          : undefined,
                      background: theme.palette.error.main,
                    }}
                    onClick={() => {
                      handleDecline()
                    }}
                    disabled={requestData.status === RequestStatus.DECLINED}
                  >
                    DECLINE
                  </AsyncButton>

                  {editAmount ? (
                    <>
                      <AsyncButton
                        variant="contained"
                        style={{
                          display:
                            visible ||
                            requestData.status === RequestStatus.APPROVED ||
                            requestData.status === RequestStatus.DECLINED
                              ? 'none'
                              : undefined,

                          background: theme.palette.error.main,
                        }}
                        onClick={() => {
                          setVisible(false)
                          setIsButtonClick(false)
                          setEditAmount(false)
                        }}
                      >
                        CANCEL
                      </AsyncButton>

                      <AsyncButton
                        variant="contained"
                        style={{
                          display:
                            visible ||
                            requestData.status === RequestStatus.APPROVED ||
                            requestData.status === RequestStatus.DECLINED
                              ? 'none'
                              : undefined,

                          background: theme.palette.primary.main,
                        }}
                        onClick={() => {
                          setEditAmount(false)
                          setVisible(true)
                          handleUpdate()
                        }}
                      >
                        UPDATE
                      </AsyncButton>
                    </>
                  ) : (
                    <AsyncButton
                      variant="contained"
                      style={{
                        display:
                          visible ||
                          requestData.status === RequestStatus.APPROVED ||
                          requestData.status === RequestStatus.DECLINED
                            ? 'none'
                            : undefined,

                        background: theme.palette.grey[600],
                      }}
                      onClick={() => {
                        setEditAmount(true)
                      }}
                      disabled={requestData.status === RequestStatus.DECLINED}
                    >
                      EDIT
                    </AsyncButton>
                  )}

                  <AsyncButton
                    disabled={
                      !!(
                        requestData.status === RequestStatus.APPROVED ||
                        requestData.status === RequestStatus.DECLINED
                      )
                    }
                    style={{
                      display:
                        visible ||
                        editAmount ||
                        requestData.status === RequestStatus.APPROVED ||
                        requestData.status === RequestStatus.DECLINED
                          ? 'none'
                          : undefined,

                      backgroundColor: '#ec5b2b',
                    }}
                    onClick={() => {
                      setVisible(true)
                      setIsButtonClick(true)
                    }}
                  >
                    VERIFY
                  </AsyncButton>
                </Box>
              )}

              {isButtonClick && (
                <>
                  <Box pt={2}>
                    <Paper style={{ padding: 16 }}>
                      <Box>
                        <FormLabel>Enter Reference Number</FormLabel>
                        <FormTextField
                          name="ct_ref"
                          onChange={handleChange}
                          InputProps={{
                            endAdornment: checkIcon ? (
                              <InputAdornment position="start">
                                <Check />
                              </InputAdornment>
                            ) : (
                              <Box></Box>
                            ),
                          }}
                        ></FormTextField>
                      </Box>
                      <Box pt={1} display="flex" justifyContent="space-between">
                        <Button
                          variant="contained"
                          onClick={() => {
                            setVisible(false)
                            setIsButtonClick(false)
                          }}
                        >
                          CANCEL
                        </Button>
                        <AsyncButton
                          variant="contained"
                          color="primary"
                          loading={loading}
                          disabled={!enableSubmit}
                          onClick={() => {
                            handleApproved()
                          }}
                        >
                          SUBMIT
                        </AsyncButton>
                      </Box>
                    </Paper>
                  </Box>
                </>
              )}
            </Paper>
          </Box>
        </Box>
      </Paper>
    </ModalWrapper>
  )
}
