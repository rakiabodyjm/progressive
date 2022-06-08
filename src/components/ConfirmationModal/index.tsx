import { Box, Divider, IconButton, Paper, Typography } from '@material-ui/core'
import { CloseOutlined, Info, MonetizationOn } from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import ModalWrapper from '@src/components/ModalWrapper'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import React, { useCallback } from 'react'

export default function ConfirmationModal({
  open,
  handleClose,
  submitFunction,
  ctData,
  renderProps,
}: {
  open: boolean
  handleClose: () => void
  submitFunction: () => void
  ctData?: Partial<CashTransferResponse>
  renderProps?: (param: typeof ctData) => JSX.Element
}) {
  const submit = useCallback(() => {
    submitFunction()
  }, [submitFunction])
  return (
    <ModalWrapper open={open} onClose={handleClose} containerSize="xs">
      <Paper style={{ padding: 16 }} variant="outlined">
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Loan Payment</Typography>
            {/* <FormLabel>Confirmation</FormLabel> */}
            <Typography variant="body2">Confirmation</Typography>
          </Box>
          {/* <Box>
            <MonetizationOn style={{ fontSize: 72 }} color="primary" />
          </Box> */}

          <Box>
            <IconButton onClick={handleClose}>
              <CloseOutlined />
            </IconButton>
          </Box>
        </Box>
        <Box my={2}>
          <Divider />
        </Box>
        <Box>
          <Box display="flex" justifyContent="flex-start">
            <Box pr={2}>
              <Info />
            </Box>
            <Box pb={2}>
              <Typography variant="body2">
                Please review your transaction before confirming.
              </Typography>
            </Box>
          </Box>

          {renderProps && ctData && renderProps(ctData)}
        </Box>
        <Box display="flex" mt={2} justifyContent="flex-end">
          <AsyncButton
            // loading={loading}
            // disabled={loading}
            color="primary"
            variant="contained"
            onClick={submit}
          >
            Confirm
          </AsyncButton>
        </Box>
      </Paper>
    </ModalWrapper>
  )
}
