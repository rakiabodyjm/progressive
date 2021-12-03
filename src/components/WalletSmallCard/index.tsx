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
import { UserTypes } from '@src/redux/data/userSlice'
import { toCapsFirst } from '@src/utils/api/common'
import useNotification, {
  useErrorNotification,
  useSuccessNotification,
} from '@src/utils/hooks/useNotification'
import { useState } from 'react'

import useSWR, { useSWRConfig } from 'swr'
import { makeStyles } from '@material-ui/styles'
import { getWallet, CeasarWalletResponse, createWallet } from '../../utils/api/walletApi'
import RoleBadge from '../RoleBadge'

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
        // err.forEach((ea) => dispatchError(ea))
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
      <Paper variant="outlined" {...restProps} style={{ height: 153 }}>
        <Box p={2}>
          <Grid container>
            <Grid item xs={8}>
              <Typography noWrap variant="h5" style={{}}>
                Wallet
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Box
                display="flex"
                height="100%"
                justifyContent="flex-end"
                alignItems="flex-start"
                pt={0.5}
                whiteSpace="noWrap"
              >
                <RoleBadge
                  style={{
                    marginRight: 4,
                  }}
                  display="inline"
                  uppercase
                >
                  {accountType}
                </RoleBadge>
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
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="primary">
                {toCapsFirst(accountType)} has no wallet
              </Typography>
              <Box my={2}>
                <Divider />
              </Box>
              {walletCreating ? (
                <Box textAlign="center">
                  <Box p={0.5} pb={1}>
                    <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
                  </Box>
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
                  <Box pb={2} pt={2}>
                    <Divider />
                  </Box>
                  <Grid spacing={2} container>
                    <Grid item xs={12} md={12}>
                      <Grid spacing={2} container>
                        <Grid item xs={12} md={6}>
                          <Button onClick={handleModalClose} fullWidth variant="contained">
                            Cancel
                          </Button>
                        </Grid>
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
                      </Grid>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Modal>
          </Grid>
        </Box>
      </Paper>
    )
  }
  return (
    <Paper variant="outlined" {...restProps} style={{ height: 153 }}>
      <Box {...(isValidating && { textAlign: 'center' })} p={2} pt={1}>
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
                    whiteSpace: 'nowrap',
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
                  whiteSpace="noWrap"
                >
                  <RoleBadge
                    style={{
                      marginRight: 4,
                    }}
                    display="inline"
                    uppercase
                  >
                    {data?.account_type}
                  </RoleBadge>
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
