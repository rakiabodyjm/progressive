/* eslint-disable no-redeclare */
import {
  Box,
  Button,
  ButtonBaseTypeMap,
  ButtonProps,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
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
  adminAcquireInventory,
  CreateInventory as CreateInventoryPost,
} from '@src/utils/api/inventoryApi'
import { useEffect, useRef, useState } from 'react'
import { Asset, searchAsset } from '@src/utils/api/assetApi'
import { useSelector } from 'react-redux'
import { userDataSelector } from '@src/redux/data/userSlice'
import { CeasarWalletResponse, getWallet } from '@src/utils/api/walletApi'

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))

export default function CreateInventory({
  modal,
  revalidateFunction,
}: {
  modal?: () => void
  revalidateFunction?: () => void
}) {
  const classes = useStyles()
  const [inventory, setInventory] = useState<CreateInventoryPost>({
    asset: '',
    // ceasar: '',
    quantity: 0,
  })

  const [assetChoices, setAssetChoices] = useState<Asset[] | undefined>()
  const [assetQuery, setAssetQuery] = useState('')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      searchAsset(assetQuery)
        .then((res) => {
          setAssetChoices(res)
        })
        .catch((err) => {
          console.error(err)
        })
    }, 500)
  }, [assetQuery])

  const user = useSelector(userDataSelector)

  const theme = useTheme()
  const [buttonProps, setButtonProps] = useState<{
    loading: boolean
    disabled: boolean
  }>({
    loading: false,
    disabled: true,
  })

  const dispatchSuccess = useSuccessNotification()
  const dispatchError = useErrorNotification()
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>()

  const handleSubmit = () => {
    setButtonLoading()
    adminAcquireInventory(inventory)
      .then((res) => {
        dispatchSuccess('Inventory for ADMIN Added')
        if (revalidateFunction) {
          revalidateFunction()
        }
      })
      .catch((err: string[]) => {
        err.forEach((ea) => {
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
              Add New Inventory to Admin
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add Inventory Items to Admin to be sold to SUBD | DSP | RETAILER
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
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
              item
              xs={6}
            >
              <Box>
                <FormLabel variant="body2">Search:</FormLabel>
                <FormTextField
                  name="searchQuery"
                  onChange={(e) => {
                    setAssetQuery(e.target.value)
                  }}
                  placeholder="Search Assets"
                />
              </Box>
              <Box my={1} />
              <Box
                style={{
                  flexGrow: 1,
                }}
              >
                <Paper
                  style={{
                    height: 335,
                    overflowY: 'auto',
                  }}
                  variant="outlined"
                >
                  {assetChoices &&
                    assetChoices.map((ea, index) => (
                      <ListItem
                        style={{
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'flex-start',
                        }}
                        key={`${ea.id}`}
                        button
                        onClick={() => {
                          setSelectedAsset(ea)
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: 600,
                          }}
                          noWrap
                          color="primary"
                        >
                          {ea.code}
                        </Typography>
                        <Typography variant="caption">{ea.name}</Typography>
                      </ListItem>
                    ))}
                </Paper>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Paper variant="outlined">
                <Box height="100%" p={2}>
                  <Typography variant="body1" color="primary">
                    Selected Asset
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Search and Select one of the assets to add to your admin inventory
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
                    <Grid item container xs={12}>
                      <Grid item xs={12}>
                        <FormLabel variant="body2">Quantity: </FormLabel>
                      </Grid>
                      <Grid item xs={12}>
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
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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

const AsyncButton = ({ loading, disabled, ...restProps }: { loading?: boolean } & ButtonProps) => {
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
