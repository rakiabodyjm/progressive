import {
  Backdrop,
  Box,
  Container,
  Divider,
  Fade,
  Grid,
  IconButton,
  Modal,
  Paper,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { AddCircleOutlined } from '@material-ui/icons'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { setNotification, NotificationTypes } from '@src/redux/data/notificationSlice'
import { userDataSelector } from '@src/redux/data/userSlice'
import { getDsp } from '@src/utils/api/dspApi'
import { getSubdistributor } from '@src/utils/api/subdistributorApi'
import userApi, { getUser, UserResponse } from '@src/utils/api/userApi'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import AccountSummaryCard from '../AccountSummaryCard'
import DSPSearchTable from '../DSPSearchTable'
import DSPSmallCard from '../DSPSmallCard'
import CreateDSPAccount from '../pages/dsp/CreateDSPAccount'
import CreateRetailerAccount from '../pages/retailer/CreateRetailerAccount'
import RetailerSearchTable from '../RetailerSearchTable'
import RoleBadge from '../RoleBadge'
import SubdistributorSmallCard from '../SubdistributorSmallCard'

export default function AccountManagement({
  accountAs,
  accountGet,
  accountRole,
}: {
  accountAs: string | undefined
  accountGet: string | undefined
  accountRole: string
}) {
  const user = useSelector(userDataSelector)
  const [account, setAccount] = useState<UserResponse>()
  const [addAccountModal, setAddAccountModal] = useState({
    dsp: false,
    retailer: false,
  })
  const setModalOpen = (modal: keyof typeof addAccountModal, isOpen: boolean) => () => {
    setAddAccountModal((prevState) => ({
      ...prevState,
      [modal]: isOpen,
    }))
  }

  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  useEffect(() => {
    if (user) {
      setLoading(true)
      getUser(user.user_id as string, {
        cached: false,
      })
        .then(async (res) => {
          if (res?.dsp && accountGet === user.retailer_id) {
            res.dsp = await getDsp(res.dsp.id)
          }
          if (res?.subdistributor && accountGet === user.dsp_id) {
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
        .finally(() => {
          setLoading(false)
        })
    }
  }, [dispatch, user, accountGet])

  const [userRole, setUserRole] = useState<string>()
  useEffect(() => {
    user?.roles.filter((role) => role === 'dsp').map((filtered) => setUserRole(filtered))
  }, [user?.roles])
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
              accountAs === user?.subdistributor_id &&
              account.roles
                .filter((role) => role === 'subdistributor')
                .map((filtered) => (
                  <RoleBadge key={filtered.toString()}>{filtered.toUpperCase()}</RoleBadge>
                ))}
            {account &&
              accountAs === user?.dsp_id &&
              account.roles
                .filter((role) => role === 'dsp')
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
            {accountGet === user?.dsp_id && accountRole === 'dsp' && (
              <Typography display="inline" variant="h4">
                DSP Management
              </Typography>
            )}
            {accountGet === user?.retailer_id && accountRole === 'retailer' && (
              <Typography display="inline" variant="h4">
                Retailer Management
              </Typography>
            )}
            {accountGet === user?.dsp_id && accountRole === 'dsp' && (
              <Box mb={2} display="flex" justifyContent="flex-end">
                <Tooltip
                  title={<Typography variant="subtitle2">Add DSP Account</Typography>}
                  arrow
                  placement="left"
                >
                  <IconButton onClick={setModalOpen('dsp', true)}>
                    <AddCircleOutlined />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            {accountGet === user?.retailer_id && accountRole === 'retailer' && (
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
            )}
            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
          </Grid>
          {!loading ? (
            <>
              {account?.subdistributor && accountAs === user?.subdistributor_id && (
                <>
                  <Box my={2}>
                    <Divider />
                  </Box>
                  <Grid spacing={2} container>
                    <Grid item xs={12} md={6}>
                      <AccountSummaryCard account={account} role={account.subdistributor.id} />
                    </Grid>

                    <Grid container item xs={12} md={6}>
                      <Grid item xs={12} lg={6}>
                        <SubdistributorSmallCard subdistributorId={account.subdistributor.id} />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      {accountGet === user?.dsp_id && accountRole === 'dsp' && (
                        <Paper variant="outlined">
                          <Box p={2}>
                            <Typography variant="h5">DSP Accounts</Typography>
                            <Typography variant="subtitle2" color="primary">
                              DSP Accounts this Subdistributor services
                            </Typography>
                          </Box>
                          <DSPSearchTable subdistributorId={account.subdistributor.id} />
                        </Paper>
                      )}
                      {accountGet === user?.retailer_id && accountRole === 'retailer' && (
                        <Paper variant="outlined">
                          <Box p={2}>
                            <Typography variant="h5">Retailer Accounts</Typography>
                            <Typography variant="subtitle2" color="primary">
                              Retailer Accounts this Subdistributor services
                            </Typography>
                          </Box>
                          <RetailerSearchTable subdistributorId={account.subdistributor.id} />
                        </Paper>
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
              {account?.dsp && accountAs === user?.dsp_id && (
                <>
                  <Box my={2}>
                    <Divider />
                  </Box>
                  <Grid spacing={2} container>
                    <Grid item xs={12} md={6}>
                      <AccountSummaryCard account={account} role={account.dsp.id} />
                    </Grid>

                    <Grid container item xs={12} md={6}>
                      <Grid item xs={12} lg={6}>
                        <DSPSmallCard dspId={account.dsp.id} />
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined">
                        <Box p={2}>
                          <Typography variant="h5">Retailer Accounts</Typography>
                          <Typography variant="subtitle2" color="primary">
                            Retailer Accounts this DSP Services
                          </Typography>
                        </Box>
                        <RetailerSearchTable
                          dspId={account.dsp.id}
                          subdistributorId={account.dsp.subdistributor.id}
                          role={userRole}
                        />
                        {/* <RetailerTable dspId={account.dsp.id} /> */}
                      </Paper>
                    </Grid>
                  </Grid>
                </>
              )}
            </>
          ) : (
            <LoadingScreen2
              containerProps={{
                minHeight: 480,
                width: '100%',
              }}
            />
          )}
        </Grid>
      </Paper>
      {account?.dsp &&
        addAccountModal.retailer &&
        accountGet === user?.retailer_id &&
        accountRole === 'retailer' && (
          <ModalContainer
            handleClose={setModalOpen('retailer', false)}
            open={addAccountModal.retailer}
          >
            <CreateRetailerAccount
              dspId={account.dsp?.id as string}
              subdistributorId={account.dsp.subdistributor.id as string}
              modal={setModalOpen('retailer', false)}
            />
          </ModalContainer>
        )}
      {account?.subdistributor && addAccountModal.dsp && accountRole === 'dsp' && (
        <ModalContainer handleClose={setModalOpen('dsp', false)} open={addAccountModal.dsp}>
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
