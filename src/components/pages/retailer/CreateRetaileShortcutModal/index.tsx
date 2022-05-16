import { Box, Chip, Divider, Grid, IconButton, Paper, Typography } from '@material-ui/core'
import { AddOutlined, CloseOutlined } from '@material-ui/icons'
import { BasePickerProps } from '@material-ui/pickers/typings/BasePicker'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { userDataSelector } from '@src/redux/data/userSlice'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

export default function CreateRetailerShortcutModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [visible, setVisible] = useState<boolean>(false)
  const user = useSelector(userDataSelector)
  console.log(user)

  return (
    <ModalWrapper open={open} onClose={onClose} containerSize="xs">
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
          <Grid spacing={2} container>
            <Grid item xs={6}>
              <FormLabel> First Name</FormLabel>
              <FormTextField name="first-name"></FormTextField>
            </Grid>
            <Grid item xs={6}>
              <FormLabel> Last Name</FormLabel>
              <FormTextField name="last-name"></FormTextField>
            </Grid>
            <Grid item xs={6}>
              <FormLabel> Phone Number</FormLabel>
              <FormTextField name="phone-number"></FormTextField>
            </Grid>
            <Grid item xs={12}>
              <FormLabel> Address</FormLabel>
              <FormTextField name="address"></FormTextField>
            </Grid>
          </Grid>
          <Box>
            <Divider
              style={{
                margin: '16px 0',
              }}
            />
          </Box>
        </>
      </Paper>
    </ModalWrapper>
  )
}
