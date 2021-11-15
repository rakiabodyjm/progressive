import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  PaperProps,
  Tooltip,
  Modal,
  Typography,
  useTheme,
  Backdrop,
  Theme,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@material-ui/core'
import { Info, InfoOutlined } from '@material-ui/icons'
import SubdistributorsPage from '@src/pages/subdistributor'
import { UserTypes } from '@src/redux/data/userSlice'
import { toCapsFirst } from '@src/utils/api/common'
import { UserResponse, getUser } from '@src/utils/api/userApi'
import useFetch from '@src/utils/hooks/useFetch'
import useNotification, {
  useErrorNotification,
  useSuccessNotification,
} from '@src/utils/hooks/useNotification'
import { useEffect, useState } from 'react'

import useSWR, { useSWRConfig } from 'swr'
import { makeStyles } from '@material-ui/styles'
import { getWallet, CeasarWalletResponse, createWallet } from '../../utils/api/walletApi'

const useStyles = makeStyles((theme: Theme) => ({
  cancelButton: {
    color: theme.palette.error.main,
  },
}))

export default function WalletSmallCard({
  accountType,
  accountId,
  ...restProps
}: { accountType: UserTypes; accountId: string } & PaperProps) {
  const { data, error, isValidating } = useSWR<CeasarWalletResponse>(
    [accountType, accountId, 'ceasar-wallet'],
    getWallet,
    {
      revalidateOnFocus: false,
    }
  )
  const { mutate } = useSWRConfig()

  const classes = useStyles()

  const dispatchError = useErrorNotification()
  const dispatchSuccess = useSuccessNotification()
  const [walletCreating, setWalletCreating] = useState<boolean>(false)
  const handleCreateWallet = () => {
    setWalletCreating(true)
    setModalOpen(false)
    createWallet({ [accountType]: accountId } as Record<UserTypes, string>)
      .then((res) => {
        console.log('wallet created', res)
        dispatchSuccess(`Ceasar Wallet Created`)
      })
      .catch((err: string[]) => {
        console.log('error', err)
        err.forEach((ea) => dispatchError(ea))
      })
      .finally(() => {
        setWalletCreating(false)
        mutate([accountType, accountId, 'ceasar-wallet'])
      })
  }
  const theme = useTheme()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const handleModalOpen = () => {
    setModalOpen(true)
  }
  const handleModalClose = () => {
    setModalOpen(false)
  }
  const [check, setCheck] = useState({ checkbox1: false, checkbox2: false })
  const { checkbox1, checkbox2 } = check
  const handleCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheck({
      ...check,
      [event.target.name]: event.target.checked,
    })
  }
  const checkAll = [checkbox1, checkbox2].filter((v) => v).length !== 2

  if (!data) {
    return (
      <Paper variant="outlined" {...restProps}>
        <Box p={2}>
          <Grid container>
            <Grid item xs={12}>
              <Typography noWrap variant="h5" style={{}}>
                Wallet
              </Typography>
              <Typography variant="subtitle2" color="primary">
                {toCapsFirst(accountType)} has no wallet
              </Typography>
              <Box my={2}>
                <Divider />
              </Box>
              {walletCreating ? (
                <Box textAlign="center" height={theme.typography.h6.height}>
                  <Paper variant="outlined">
                    <Box p={0.5}>
                      <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
                    </Box>
                  </Paper>
                </Box>
              ) : (
                <Button onClick={handleModalOpen} fullWidth variant="contained" color="primary">
                  Create Wallet
                </Button>
              )}
            </Grid>
            <Modal
              open={modalOpen}
              onClose={() => {
                setModalOpen(false)
              }}
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
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography color="primary" variant="h6">
                    Are You Sure?
                  </Typography>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={checkbox1}
                          name="checkbox1"
                          onChange={handleCheckbox}
                        />
                      }
                      label="Yes, I want to create my Ceasar Wallet"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={checkbox2}
                          name="checkbox2"
                          onChange={handleCheckbox}
                        />
                      }
                      label="Yes, I agree to REALM1000 and Ceasar Coins Terms and Conditions"
                    />
                  </FormGroup>
                </Box>
                <Box p={2}>
                  <Divider />
                </Box>
                <Grid spacing={2} container>
                  <Grid item xs={12} md={12}>
                    <Box p={2}>
                      <Grid spacing={2} container>
                        <Grid item xs={12} md={6}>
                          <Button
                            onClick={handleCreateWallet}
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={checkAll}
                          >
                            I agree
                          </Button>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Button
                            onClick={handleModalClose}
                            fullWidth
                            variant="contained"
                            className={classes.cancelButton}
                          >
                            Cancel
                          </Button>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Modal>
          </Grid>
        </Box>
      </Paper>
    )
  }
  return (
    <Paper variant="outlined" {...restProps}>
      <Box {...(isValidating && { textAlign: 'center' })} p={2}>
        {isValidating ? (
          <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
        ) : (
          <>
            <Grid container>
              <Grid item xs={8}>
                <Typography noWrap variant="h5" style={{}}>
                  Wallet
                </Typography>
                <Typography
                  style={{
                    fontWeight: 700,
                  }}
                  color="primary"
                  variant="body1"
                >
                  🟡
                  <span
                    style={{
                      marginLeft: 8,
                      marginRight: 8,
                    }}
                  >
                    {data.data?.ceasar_coin || 0}
                  </span>
                  <Typography component="span" variant="body1" noWrap>
                    Ceasar Coins
                  </Typography>
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box
                  display="flex"
                  height="100%"
                  justifyContent="flex-end"
                  alignItems="flex-start"
                  pt={0.5}
                >
                  <Typography
                    style={{
                      padding: '2px 8px',
                      border: `1px solid ${theme.palette.primary.main}`,
                      borderRadius: 4,
                    }}
                    color="primary"
                    display="inline"
                    variant="body2"
                  >
                    {data?.account_type.toUpperCase()}
                  </Typography>
                  {/* <Tooltip
                    arrow
                    placement="left"
                    style={{
                      cursor: 'pointer',
                    }}
                    title={<Typography variant="subtitle2">Coming Soon</Typography>}
                  >
                    <InfoOutlined color="primary" />
                  </Tooltip> */}
                </Box>
              </Grid>
            </Grid>

            <div
              style={{
                marginBottom: 16,
              }}
            />
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="h6">Dollar: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="subtitle2"
                >
                  $0.00
                  {/* {data?.retailer?.length || 0} */}
                  {/* {data?} */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="h6">Peso: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="subtitle2"
                >
                  ₱0.00
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Paper>
  )
}
