import {
  Typography,
  Paper,
  Grid,
  Divider,
  Box,
  Modal,
  Backdrop,
  Fade,
  Container,
  Tooltip,
  IconButton,
} from '@material-ui/core'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import RoleBadge from '@src/components/RoleBadge'
import RetailerTable from '@src/components/RetailerTable'
import { getDsp } from '@src/utils/api/dspApi'
import { AddCircleOutlined } from '@material-ui/icons'
import CreateRetailerAccount from '@src/components/pages/retailer/CreateRetailerAccount'
import SubdistributorAccountSummaryCard from '@src/components/SubdistributorAccountSummaryCard'
import SubdistributorSmallCard from '@src/components/SubdistributorSmallCard'
import RetailerSearchTable from '@src/components/RetailerSearchTable'

export default function RetailersPage() {
  const user = useSelector(userDataSelector)
  const [account, setAccount] = useState<UserResponse>()
  const [addRetailerAccountModal, setAddRetailerAccountModal] = useState({
    retailer: false,
  })
  const setModalOpen = (modal: keyof typeof addRetailerAccountModal, isOpen: boolean) => () => {
    setAddRetailerAccountModal((prevState) => ({
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
          if (res?.dsp) {
            res.dsp = await getDsp(res.dsp.id)
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
              Retailer Management
            </Typography>
            <Box mb={2} display="flex" justifyContent="flex-end">
              <Tooltip
                title={<Typography variant="subtitle2">Add Retailer Account</Typography>}
                arrow
                placement="left"
              >
                <IconButton onClick={setModalOpen('retailer', true)}>
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
                      <Typography variant="h5">Retailer Accounts</Typography>
                      <Typography variant="subtitle2" color="primary">
                        Retailer Accounts this Subdistributor Services
                      </Typography>
                    </Box>
                    <RetailerSearchTable subdistributorId={account.subdistributor.id} />
                    {/* <RetailerTable subdistributorId={account.subdistributor.id} /> */}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
      {account?.subdistributor && addRetailerAccountModal.retailer && (
        <ModalContainer
          handleClose={setModalOpen('retailer', false)}
          open={addRetailerAccountModal.retailer}
        >
          <CreateRetailerAccount
            dspId={account.dsp?.id as string}
            subdistributorId={account.subdistributor.id as string}
            modal={setModalOpen('retailer', false)}
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
