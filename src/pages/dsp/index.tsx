import {
  Typography,
  Paper,
  Grid,
  Divider,
  Box,
  Tooltip,
  IconButton,
  Fade,
  Container,
  Modal,
  Backdrop,
} from '@material-ui/core'
import DSPSmallCard from '@src/components/DSPSmallCard'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { useState, useEffect, ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getDsp } from '@src/utils/api/dspApi'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import DSPAccountSummaryCard from '@src/components/DSPAccountSummaryCard'
import WalletSmallCard from '@src/components/WalletSmallCard'
import SubdistributorAccountSummaryCard from '@src/components/SubdistributorAccountSummaryCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import RoleBadge from '@src/components/RoleBadge'
import DspTable from '@src/components/DspTable'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import { AddCircleOutlined } from '@material-ui/icons'
import CreateDSPAccount from '@src/components/pages/dsp/CreateDSPAccount'
import DSPSearchTable from '@src/components/DSPSearchTable'

export default function DspPage() {
  const user = useSelector(userDataSelector)
  const [account, setAccount] = useState<UserResponse>()
  const [addDspAccountModal, setAddDspAccountModal] = useState({
    dsp: false,
  })
  const setModalOpen = (modal: keyof typeof addDspAccountModal, isOpen: boolean) => () => {
    setAddDspAccountModal((prevState) => ({
      ...prevState,
      [modal]: isOpen,
    }))
  }
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      getUser(user.user_id as string, {
        cached: false,
      })
        .then(async (res) => {
          if (res?.subdistributor) {
            res.subdistributor = await getSubdistributor(res.subdistributor.id)
          }
          setAccount(res)
        })

        .catch((err) => {
          const error = userApi.extractError(err)
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: error.toString(),
            })
          )
        })
    }
  }, [dispatch, user])

  return (
    <div>
      <Paper
        variant="outlined"
        style={{
          padding: 16,
        }}
      >
        <Grid container>
          <Grid item xs={12}>
            {account &&
              account.roles
                .filter((role) => role === 'subdistributor')
                .map((filtered) => (
                  <RoleBadge key={filtered.toString()}>{filtered.toUpperCase()}</RoleBadge>
                ))}
            <Typography
              style={{
                fontWeight: 600,
              }}
              color="textSecondary"
              noWrap
              variant="h6"
            >
              {user?.first_name}
            </Typography>
            <Typography display="inline" variant="h4">
              DSP Management
            </Typography>
            <Box mb={2} display="flex" justifyContent="flex-end">
              <Tooltip
                title={<Typography variant="subtitle2">Add DSP Account</Typography>}
                arrow
                placement="left"
              >
                <IconButton onClick={setModalOpen('dsp', true)}>
                  {console.log(addDspAccountModal.dsp)}
                  <AddCircleOutlined />
                </IconButton>
              </Tooltip>
            </Box>
            <Divider
              style={{
                margin: '16px 0px',
              }}
            ></Divider>
          </Grid>

          {account?.subdistributor && (
            <>
              <Box my={2}>
                <Divider />
              </Box>
              <Grid spacing={2} container>
                <Grid item xs={12} md={6}>
                  <SubdistributorAccountSummaryCard subdistributor={account.subdistributor} />
                </Grid>

                <Grid container item xs={12} md={6}>
                  <Grid item xs={12} lg={6}>
                    <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Paper variant="outlined">
                    <Box p={2}>
                      <Typography variant="h5">DSP Accounts</Typography>
                      <Typography variant="subtitle2" color="primary">
                        DSP Accounts this Subdistributor owns
                      </Typography>
                    </Box>

                    <DSPSearchTable subdistributorId={account.subdistributor.id} />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      {account?.subdistributor && addDspAccountModal.dsp && (
        <ModalContainer handleClose={setModalOpen('dsp', false)} open={addDspAccountModal.dsp}>
          <CreateDSPAccount
            subdistributorId={account.subdistributor.id as string}
            modal={setModalOpen('dsp', false)}
          />
        </ModalContainer>
      )}
    </div>
  )
}
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
}
