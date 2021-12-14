/* eslint-disable no-redeclare */
import {
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'

import {
  getInventory,
  Inventory,
  UpdateInventory,
  updateInventory,
} from '@src/utils/api/inventoryApi'
import { useEffect, useRef, useState } from 'react'
import { Asset, searchAsset } from '@src/utils/api/assetApi'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import { CaesarWalletResponse, getWallet } from '@src/utils/api/walletApi'

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))

export default function EditInventory({
  inventoryId,
  modal,
  revalidateFunction,
}: {
  inventoryId: Inventory['id']
  modal?: () => void
  revalidateFunction?: () => void
}) {
  const [inventory, setInventory] = useState<UpdateInventory>({
    // asset: '',
    // caesar: '',
    quantity: 0,
  })

  const [buttonProps, setButtonProps] = useState<{
    loading: boolean
    disabled: boolean
  }>({
    loading: false,
    disabled: true,
  })

  const dispatchError = useErrorNotification()
  const dispatchSuccess = useSuccessNotification()
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>()
  useEffect(() => {
    if (inventoryId) {
      getInventory(inventoryId)
        .then((res) => {
          setSelectedAsset(res.asset)
          setInventory({
            quantity: res.quantity,
          })
        })
        .catch((err) => {
          dispatchError(err)
        })
    }
  }, [inventoryId])

  const handleSubmit = () => {
    setButtonLoading()
    updateInventory(inventoryId, {
      ...inventory,
    })
      .then((res) => {
        dispatchSuccess(res.message)
        if (revalidateFunction) {
          revalidateFunction()
        }
      })
      .catch((err) => {
        err.forEach((ea: string) => {
          dispatchError(ea)
        })
      })
      .finally(() => {
        setButtonLoading(false)
      })
  }

  const setButtonLoading = (param?: false) => {
    setButtonProps((prevState) => ({
      ...prevState,
      loading: typeof param !== 'boolean' ? true : param,
    }))
  }

  const setButtonDisabled = (param?: false) => {
    setButtonProps((prevState) => ({
      ...prevState,
      //   disabled: !!(param === undefined || param === true),
      disabled: typeof param !== 'boolean' ? true : param,
    }))
  }

  useEffect(() => {
    if (!selectedAsset) {
      setButtonDisabled()
    } else {
      setButtonDisabled(false)

      setInventory((prevState) => ({
        ...prevState,
        asset: selectedAsset.id,
      }))
    }
  }, [selectedAsset])

  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Edit Inventory of this Admin
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Only the quantity field can be edited
            </Typography>
          </Box>
          <Box>
            {modal && (
              <IconButton
                style={{
                  padding: 4,
                }}
                onClick={() => {
                  modal()
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>

        <Box my={2}>
          <Divider />
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Paper variant="outlined">
                <Box height="100%" p={2}>
                  <Typography variant="body1" color="primary">
                    Asset
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Modify Quantity of this selected Inventory
                  </Typography>

                  <Box my={1}>
                    <Divider />
                  </Box>

                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <FormLabel variant="body2">Name:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.name)}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel variant="body2">Description:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(
                          selectedAsset?.description &&
                            `${selectedAsset?.description.slice(0, 95)}...`
                        )}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel variant="body2">Unit Price:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.unit_price)}
                      </FormLabel>
                    </Grid>

                    <Grid item xs={6}>
                      <FormLabel variant="body2">SRP Subd:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.srp_for_subd)}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <FormLabel variant="body2">SRP DSP:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.srp_for_dsp)}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <FormLabel variant="body2">SRP Retailer:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.srp_for_retailer)}
                      </FormLabel>
                    </Grid>
                    <Grid item xs={6}>
                      <FormLabel variant="body2">SRP User:</FormLabel>
                      <FormLabel color="inherit" variant="caption">
                        {renderNullOrSelect(selectedAsset?.srp_for_user)}
                      </FormLabel>
                    </Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box p={2}>
                  <FormLabel variant="body2">Quantity: </FormLabel>
                  <FormTextField
                    type="number"
                    name="quantity"
                    inputProps={{
                      min: 1,
                      step: 0.2,
                      style: {
                        paddingTop: 6,
                        paddingBottom: 6,
                      },
                    }}
                    style={{
                      marginTop: 4,
                    }}
                    fullWidth
                    onChange={(e) => {
                      setInventory((prevState) => ({
                        ...prevState,
                        quantity: Number(e.target.value),
                      }))
                    }}
                    value={inventory.quantity}
                    // defaultValue={inventory.quantity}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
          <Box py={2}>
            <Divider />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <AsyncButton
              onClick={() => {
                handleSubmit()
              }}
              loading={buttonProps.loading}
              disabled={buttonProps.disabled}
            >
              Confirm
            </AsyncButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

const AsyncButton = ({
  loading,
  disabled,
  ...restProps
}: { disabled?: boolean; loading?: boolean } & ButtonProps) => {
  const theme = useTheme()
  return (
    <Button
      color="primary"
      variant="contained"
      {...(loading && {
        endIcon: (
          <CircularProgress
            style={{
              height: 16,
              width: 16,
              color: theme.palette.getContrastText(theme.palette.primary.main),
            }}
            thickness={5}
          />
        ),
      })}
      disabled={loading || disabled}
      {...restProps}
    >
      {restProps.children}
    </Button>
  )
}

function renderNullOrSelect(arg: string | number | undefined): string | number | JSX.Element {
  if (!arg) {
    return <i>Select Asset First...</i>
  }
  return arg
}
