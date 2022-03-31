import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  PaperProps,
  Typography,
  useTheme,
  Theme,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from '@material-ui/core'
import { UserTypes } from '@src/redux/data/userSlice'
import { toCapsFirst } from '@src/utils/api/common'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'

import useSWR, { useSWRConfig } from 'swr'
import { makeStyles } from '@material-ui/styles'
import dynamic from 'next/dynamic'
import CustomTextField from '@src/components/AutoFormRenderer/CustomTextField'
import { getWallet, CaesarWalletResponse, createWallet } from '../../utils/api/walletApi'
import RoleBadge from '../RoleBadge'

// const useStyles = makeStyles((theme: Theme) => ({
//   cancelButton: {
//     color: theme.palette.error.main,
//   },
// }))
const ModalWrapper = dynamic(() => import(`@components/ModalWrapper`))
export default function WalletSmallCard({
  accountType,
  accountId,
  ...restProps
}: { accountType: UserTypes; accountId: string } & PaperProps) {
  const { data, error, isValidating } = useSWR<CaesarWalletResponse>(
    [accountType, accountId, 'caesar-wallet'],
    getWallet,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
      dedupingInterval: 30000,
      errorRetryInterval: 60000,
    }
  )
  const { mutate } = useSWRConfig()

  const dispatchError = useErrorNotification()
  const dispatchSuccess = useSuccessNotification()
  const [walletCreating, setWalletCreating] = useState<boolean>(false)

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

  const [createCaesarPassword, setCreateCaesarPassword] = useState<string>('')

  const [passwordErrors, setPasswordErrors] = useState<undefined | string>()
  const validatePassword = (password: string) =>
    new Promise((res, rej) => {
      if (password.length < 8) {
        rej(new Error(`Password must be at least 8 characters`))
      }
      res(undefined)
    })
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const handleCreateWallet = () => {
    setWalletCreating(true)
    setIsSubmitted(true)
    validatePassword(createCaesarPassword)
      .then(() => {
        createWallet({ [accountType]: accountId, password: createCaesarPassword } as Record<
          UserTypes,
          string
        > & { password: string })
          .then((res) => {
            console.log('wallet created', res)
            dispatchSuccess(`Caesar Wallet Created`)
            setModalOpen(false)
          })
          .catch((err: string[]) => {
            err.forEach((ea) => {
              dispatchError(ea)
            })
          })
          .finally(() => {
            setWalletCreating(false)
            mutate([accountType, accountId, 'caesar-wallet'])
          })
      })
      .catch((err) => {
        setPasswordErrors(err.message)
      })
  }

  useEffect(() => {
    if (isSubmitted) {
      validatePassword(createCaesarPassword)
        .then((res) => {
          setPasswordErrors(res as string)
        })
        .catch((err) => {
          setPasswordErrors(err.message)
        })
        .finally(() => {})
    }
  }, [createCaesarPassword])

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
            <ModalWrapper
              open={modalOpen}
              onClose={() => {
                setModalOpen(false)
              }}
              containerSize="xs"
            >
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">Create Caesar Wallet</Typography>
                  <Typography variant="body2" color="primary">
                    Agree to the terms to create and link Caesar Wallet to{' '}
                    {`${accountType.toUpperCase()} `}
                    Account
                  </Typography>
                  <Box my={2}>
                    <Divider />
                  </Box>
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
                      label={
                        <Typography variant="body2">
                          Yes, I want to create my Caesar Wallet
                        </Typography>
                      }
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
                      label={
                        <Typography variant="body2">
                          Yes, I agree to REALM1000 and Caesar Coins Terms and Conditions
                        </Typography>
                      }
                    />
                    {!Object.values(check).some((ea) => ea === false) && (
                      <Box>
                        <Box py={2}>
                          <Divider />
                        </Box>

                        <Typography color="primary" variant="body2">
                          Caesar Coin Password
                        </Typography>

                        <Box pt={1}>
                          <TextField
                            variant="outlined"
                            size="small"
                            placeholder="Input Password"
                            fullWidth
                            onChange={(e) => {
                              setCreateCaesarPassword(e.target.value)
                            }}
                            error={!!passwordErrors}
                            helperText={passwordErrors}
                            type="password"
                          />
                        </Box>
                      </Box>
                    )}
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
            </ModalWrapper>
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
                    {data.data?.caesar_coin || 0}
                  </span>
                  <Typography component="span" variant="body1" noWrap>
                    Caesar Coins
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
                <Typography variant="body1">Dollar: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="caption"
                >
                  ${data?.data?.dollar.toFixed(2)}
                  {/* {data?.retailer?.length || 0} */}
                  {/* {data?} */}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">Peso: </Typography>
                <Typography
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                  variant="caption"
                >
                  ₱{data?.data?.peso}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Paper>
  )
}
