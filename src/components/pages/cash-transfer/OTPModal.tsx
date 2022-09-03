import { Box, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined } from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { OTPData } from '@src/utils/types/OTPTypes'
import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

type OtpTypes = {
  code?: string
  id?: string
}

export default function OTPModal({
  open,
  handleClose,
  otpData,
  otpPass,
}: {
  open: boolean
  handleClose: () => void
  otpData?: OTPData
  otpPass: (isPaid: boolean) => void
}) {
  // const { data: fetchOtpData, isValidating: otpDataFetching } = useSWR<Paginated<OTPData>>(
  //   '/otp',
  //   (url) =>
  //     axios
  //       .get(url)
  //       .then((res) => res.data)
  //       .catch((err) => {
  //         extractMultipleErrorFromResponse(err)
  //       }),
  //   { revalidateIfStale: true }
  // )

  // const fetchOtpDataMemoized = useMemo(() => fetchOtpData?.data || null, [fetchOtpData])

  const [loading, setLoading] = useState<boolean>(false)
  const [requestLoading, setRequestLoading] = useState<boolean>(false)

  const [enableSubmit, setEnableSubmit] = useState<boolean>(false)
  const [otpCode, setOtpCode] = useState<OtpTypes>({
    code: '',
  })
  const [otpFiltered, setOtpFiltered] = useState<OTPData>()
  const dispatch = useDispatch()

  const [verifyBtn, setVerifyBtn] = useState<boolean>(false)

  // const checkIfVerified = useCallback(() => {
  //   if (fetchOtpDataMemoized && otpFiltered) {
  //     ('TRUEEEEEEEEEEEEEEEEEEEE')

  //     if (otpFiltered?.verified) {
  //       dispatch(
  //         setNotification({
  //           type: NotificationTypes.SUCCESS,
  //           message: 'OTP Verified',
  //         })
  //       )
  //       otpPass(otpFiltered?.verified)
  //       handleClose()
  //     } else {
  //       dispatch(
  //         setNotification({
  //           type: NotificationTypes.ERROR,
  //           message: 'OTP is not Valid 1',
  //         })
  //       )
  //       setLoading(false)
  //     }
  //   }
  // }, [fetchOtpData, handleClose, otpFiltered?.verified])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOtpCode((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }
  useEffect(() => {
    if (otpCode.code?.length === 6) {
      setEnableSubmit(true)
    } else {
      setEnableSubmit(false)
      setLoading(false)
    }
  }, [otpCode.code])

  // useEffect(() => {
  //   if (otpData?.id && fetchOtpData) {
  //     fetchOtpData.data.filter((ea) => ea.id === otpData?.id).map((ea) => setOtpFiltered(ea))
  //   }
  // }, [fetchOtpData, otpData])

  const verifyOTP = async () => {
    axios
      .patch(`/otp/verify/${otpData?.id}`, { ...otpCode })
      .then((res) => res)
      .catch((err) => extractMultipleErrorFromResponse(err))

    if (verifyBtn) {
      setLoading(true)
      axios.get(`/otp/${otpData?.id}`).then((res) => {
        const otpFetched: OTPData = res.data
        if (otpFetched.verified) {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: 'OTP Verified',
            })
          )
          otpPass(otpFetched.verified)
          setVerifyBtn(false)
          handleClose()
        } else {
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: 'Invalid OTP',
            })
          )
          setLoading(false)
          setVerifyBtn(false)
        }
      })
    }

    // if (otpData?.id === undefined) {
    //   dispatch(
    //     setNotification({
    //       type: NotificationTypes.ERROR,
    //       message: 'OTP is not valid 2',
    //     })
    //   )
    // } else {
    // }
    //   if (otpDataFetching && !otpFiltered?.verified) {
    //     dispatch(
    //       setNotification({
    //         type: NotificationTypes.ERROR,
    //         message: 'OTP is not valid 3',
    //       })
    //     )
    //   }
  }

  return (
    <ModalWrapper open={open} onClose={handleClose} containerSize="xs">
      <Paper
        style={{
          padding: 16,
        }}
        variant="outlined"
      >
        <Box pb={2} display="flex" justifyContent="space-between">
          <Box>
            <FormLabel>Confirmation:</FormLabel>
            <Typography variant="h5"> Enter OTP</Typography>
          </Box>
          <Box>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>
        {otpData ? (
          <>
            <Box>
              <FormTextField name="code" value={otpCode.code} onChange={handleChange} />
            </Box>
            <Box py={2}>
              <Grid container spacing={2}>
                {/* <Grid item xs={6}>
              <AsyncButton fullWidth loading={requestLoading} color="default" onClick={requestOTP}>
                Request OTP
              </AsyncButton>
            </Grid> */}
                <Grid item xs={12}>
                  {verifyBtn ? (
                    <AsyncButton fullWidth loading={loading} onClick={verifyOTP}>
                      Verify Code
                    </AsyncButton>
                  ) : (
                    <AsyncButton
                      fullWidth
                      loading={loading}
                      disabled={!enableSubmit}
                      onClick={() => {
                        verifyOTP()
                        setVerifyBtn(true)
                      }}
                    >
                      Submit Code
                    </AsyncButton>
                  )}
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <LoadingScreen2 />
          </>
        )}
      </Paper>
    </ModalWrapper>
  )
}
