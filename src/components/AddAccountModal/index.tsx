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
// import CreateDSPAccountV2 from '@src/components/pages/dsp/CreateDSPAccountV2'
// import CreateSubdistributorAccount from '@src/components/pages/subdistributor/CreateSubdistributorAccount'
import dynamic from 'next/dynamic'
import { useState } from 'react'
// import CreateUserAccount from '../pages/user/CreateUserAccount'

const CreateDSPAccountV2 = dynamic(() => import('@components/pages/dsp/CreateDSPAccountV2'))
const CreateSubdistributorAccount = dynamic(
  () => import('@components/pages/subdistributor/CreateSubdistributorAccount')
)
const CreateUserAccount = dynamic(() => import('@components/pages/user/CreateUserAccount'))
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
      <ModalWrapper
        handleClose={() => {
          setModalsOpen((prevState) => ({
            ...prevState,
            user: false,
          }))
        }}
        open={modalsOpen.user}
      >
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
        handleClose={() => {
          setModalsOpen((prevState) => ({
            ...prevState,
            subdistributor: false,
          }))
        }}
        open={modalsOpen.subdistributor}
      >
        <CreateSubdistributorAccount modal={setSpecificModalOpen('subdistributor', false)} />
      </ModalWrapper>
      <ModalWrapper
        handleClose={() => {
          setModalsOpen((prevState) => ({
            ...prevState,
            dsp: false,
          }))
        }}
        open={modalsOpen.dsp}
      >
        <CreateDSPAccountV2 />
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
