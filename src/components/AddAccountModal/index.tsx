import {
  Backdrop,
  Box,
  Button,
  Container,
  Divider,
  Fade,
  Modal,
  Paper,
  Typography,
} from '@material-ui/core'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const CreateDSPAccount = dynamic(() => import('@components/pages/dsp/CreateDSPAccount'))
const CreateSubdistributorAccount = dynamic(
  () => import('@components/pages/subdistributor/CreateSubdistributorAccount')
)
const CreateUserAccount = dynamic(() => import('@src/components/pages/user/CreateUserAccount'))

const CreateRetailerAccount = dynamic(
  () => import('@components/pages/retailer/CreateRetailerAccount')
)
export default function AddAccountModal({
  open,
  handleClose,
}: {
  open: boolean
  handleClose: () => void
}) {
  const [modalsOpen, setModalsOpen] = useState({
    user: false,
    subdistributor: false,
    dsp: false,
    retailer: false,
  })
  const setSpecificModalOpen = (arg: keyof typeof modalsOpen, arg2: boolean) => () => {
    setModalsOpen((prevState) => ({
      ...prevState,
      [arg]: arg2,
    }))
  }

  return (
    <>
      <Modal
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
          <Container
            maxWidth="xs"
            style={{
              padding: 0,
            }}
          >
            <Paper variant="outlined">
              <Box p={2}>
                <Typography color="primary" variant="h6">
                  Add Account
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Select which Account type to add
                </Typography>
                <Divider
                  style={{
                    marginTop: 16,
                    marginBottom: 16,
                  }}
                />
                <Box display="grid" gridGap={16}>
                  {Object.keys(modalsOpen).map((key) => (
                    <Button
                      key={key}
                      onClick={() => {
                        setModalsOpen((prevState) => ({
                          ...prevState,
                          [key]: true,
                        }))
                      }}
                      fullWidth
                      color="primary"
                      variant="outlined"
                    >
                      Add {key}
                    </Button>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Container>
        </Fade>
      </Modal>
      <ModalWrapper handleClose={setSpecificModalOpen('user', false)} open={modalsOpen.user}>
        <Box>
          <Paper variant="outlined">
            <CreateUserAccount
              modal={() => {
                setModalsOpen((prevState) => ({
                  ...prevState,
                  user: false,
                }))
              }}
            />
          </Paper>
        </Box>
      </ModalWrapper>
      <ModalWrapper
        handleClose={setSpecificModalOpen('subdistributor', false)}
        open={modalsOpen.subdistributor}
      >
        <CreateSubdistributorAccount modal={setSpecificModalOpen('subdistributor', false)} />
      </ModalWrapper>
      <ModalWrapper handleClose={setSpecificModalOpen('dsp', false)} open={modalsOpen.dsp}>
        <CreateDSPAccount modal={setSpecificModalOpen('dsp', false)} />
      </ModalWrapper>
      <ModalWrapper
        open={modalsOpen.retailer}
        handleClose={setSpecificModalOpen('retailer', false)}
      >
        <CreateRetailerAccount modal={setSpecificModalOpen('retailer', false)} />
      </ModalWrapper>
    </>
  )
}

const ModalWrapper = ({
  open,
  handleClose,
  children,
}: {
  open: boolean
  handleClose: () => void
  children: JSX.Element
}) => (
  <Modal
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
      <Container
        maxWidth="sm"
        style={{
          padding: 0,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {children}
      </Container>
    </Fade>
  </Modal>
)
