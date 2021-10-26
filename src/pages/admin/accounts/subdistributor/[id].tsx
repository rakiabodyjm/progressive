import { Backdrop, Box, Button, Fade, Modal, Paper, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import EditSubdistributorAccount from '@src/components/pages/subdistributor/EditSubdistributorAccount'
import ViewSubdistributorAccount from '@src/components/pages/subdistributor/ViewSubdistributorAccount'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractErrorFromResponse } from '@src/utils/api/common'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'
import CreateDSPAccount from '@components/pages/dsp/CreateDSPAccount'

function ModalContainer({
  open,
  handleClose,
  children,
}: {
  open: boolean
  handleClose: () => void
  children: JSX.Element
}) {
  return (
    <Modal
      // aria-labelledby="transition-modal-title"
      // aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Fade in={open}>
        <div
          style={{
            maxWidth: 480,
            minWidth: 240,
            width: '100%',
          }}
        >
          {children}
        </div>
      </Fade>
    </Modal>
  )
}

export default function AdminSubdistributorManage() {
  const { query } = useRouter()
  const { id } = query
  // const [subdistributor, setSubdistributor] = useState()
  const dispatch = useDispatch()

  const { data: subdistributor } = useSWR(id as string, (id) =>
    getSubdistributor(id)
      .then((res) => res)
      .catch((err) => {
        dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: err.message,
          })
        )
      })
  )

  const theme: Theme = useTheme()
  const [modalsOpen, setModalsOpen] = useState({
    editSubdistributorModal: false,
    addDspAccountModal: false,
    addRetailerAccountModal: false,
  })
  return (
    <div>
      <Box
        mb={2}
        // position="sticky"
        // top={theme.spacing(9)}
      >
        <Paper variant="outlined">
          <Box
            display="flex"
            style={{
              gap: 16,
            }}
            p={2}
          >
            {/**
             * Edit Subdistributor Account Details
             */}
            <Button
              onClick={() => {
                setModalsOpen((prevState) => ({
                  ...prevState,
                  editSubdistributorModal: true,
                }))
              }}
              variant="outlined"
              color="primary"
            >
              Edit Account Details
            </Button>
            {/**
             *
             */}
            <Button
              onClick={() => {
                setModalsOpen((prevState) => ({
                  ...prevState,
                  addDspAccountModal: true,
                }))
              }}
              variant="outlined"
              color="primary"
            >
              Add DSP Account
            </Button>
            <Button variant="outlined" color="primary">
              Add Retailer Account
            </Button>
          </Box>
        </Paper>
      </Box>
      {id && <ViewSubdistributorAccount subdistributorId={id as string} />}
      {modalsOpen.editSubdistributorModal && subdistributor && (
        <ModalContainer
          handleClose={() => {
            setModalsOpen((prevState) => ({
              ...prevState,
              editSubdistributorModal: false,
            }))
          }}
          open={modalsOpen.editSubdistributorModal}
        >
          <EditSubdistributorAccount subdistributor={subdistributor} />
        </ModalContainer>
      )}
      {modalsOpen.addDspAccountModal && id && (
        <ModalContainer
          handleClose={() => {
            setModalsOpen((prevState) => ({
              ...prevState,
              addDspAccountModal: false,
            }))
          }}
          open={modalsOpen.addDspAccountModal}
        >
          <CreateDSPAccount subdistributorId={id} />
        </ModalContainer>
      )}
    </div>
  )
}
