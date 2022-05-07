/* eslint-disable no-redeclare */
import {
  Box,
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
  createInventory,
  CreateInventory as CreateInventoryPost,
} from '@src/utils/api/inventoryApi'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Asset, searchAsset } from '@src/utils/api/assetApi'
import { useSelector } from 'react-redux'
import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import {
  getWalletById,
  CaesarWalletResponse,
  getWallet,
  searchWallet,
  SearchWalletParams,
} from '@src/utils/api/walletApi'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { useRouter } from 'next/router'
import { grey } from '@material-ui/core/colors'
import useSWR from 'swr'
import AsyncButton from '@src/components/AsyncButton'
import CustomTextField from '@src/components/AutoFormRenderer/CustomTextField'
import { searchUser, UserResponse } from '@src/utils/api/userApi'

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
  caesarId,
}: {
  modal?: () => void
  revalidateFunction?: () => void
  caesarId?: string
}) {
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
  const [inventory, setInventory] = useState<Partial<CreateInventoryPost>>({
    asset: undefined,
    caesar: caesarId || undefined,
    quantity: undefined,
  })

  const [assetQuery, setAssetQuery] = useState('')
  const {
    data: assetChoices,
    isValidating: assetChoicesLoading,
    error,
  } = useSWR([assetQuery, 'search-asset'], searchAsset)

  useEffect(() => {
    if (error) {
      dispatchError(error.message)
    }
    console.log('inventory', inventory)
  }, [error, inventory])

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
    createInventory(inventory as Required<CreateInventoryPost>)
      .then((res) => {
        dispatchSuccess(`Created Inventory for ${res.caesar.description}`)
      })
      .catch((err: string[]) => {
        err.forEach((ea) => {
          dispatchError(ea)
        })
      })
      .finally(() => {
        if (revalidateFunction) {
          revalidateFunction()
        }
        setButtonLoading(false)
      })
  }

  useEffect(() => {
    if (!selectedAsset || !inventory.quantity || !inventory.caesar) {
      setButtonDisabled()
    } else {
      setButtonDisabled(false)
    }
  }, [selectedAsset, inventory])

  useEffect(() => {
    setInventory((prevState) => ({
      ...prevState,
      asset: selectedAsset?.id || undefined,
    }))
  }, [selectedAsset])

  const { data: caesarLoaded } = useSWR(inventory.caesar || caesarId || null, getWalletById)

  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Add New Inventory
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add Inventory Items to this account to be sold to SUBD | DSP | RETAILER
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
            <Grid item xs={12} md={6} lg={6}>
              <Paper
                style={{
                  height: '100%',
                }}
                variant="outlined"
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  height="100%"
                  p={1}
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

                  <Paper
                    style={{
                      maxHeight: 257,
                      flexGrow: 1,
                      overflowY: 'auto',
                      margin: `${theme.spacing(1)}px 0`,
                    }}
                    variant="outlined"
                  >
                    {assetChoices &&
                      !assetChoicesLoading &&
                      [...assetChoices].map((ea, index) => (
                        <ListItem
                          style={{
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            ...(ea.id === selectedAsset?.id && {
                              background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                            }),
                          }}
                          // eslint-disable-next-line react/no-array-index-key
                          key={`${ea.id} ${index}`}
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
                    {assetChoicesLoading && (
                      <Box
                        display="flex"
                        flexDirection="column"
                        height="100%"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Box mb={2} />
                        <CircularProgress size={48} thickness={4} />
                      </Box>
                    )}
                  </Paper>

                  <Box pb={1}>
                    <FormLabel variant="body2">Caesar Account:</FormLabel>
                    {/**
                     * Only render if caesarId is present on router query and caesar
                     * is loaded based on that caesarId
                     *
                     * or if there's no need for caesarId
                     */}
                    {((caesarLoaded && caesarId) || !caesarId) && (
                      <SimpleAutoComplete<CaesarWalletResponse, SearchWalletParams>
                        initialQuery={{
                          page: 0,
                          limit: 100,
                          searchQuery: '',
                        }}
                        onChange={(e) => {
                          setInventory((prevState) => ({
                            ...prevState,
                            caesar: e?.id ?? undefined,
                          }))
                        }}
                        fetcher={(query) =>
                          searchWallet(query)
                            .then((res) => res.data)
                            .catch((err) => {
                              console.log('Caesar Account Search Error: ', err)
                              return []
                            })
                        }
                        querySetter={(initialQuery, inputValue) => ({
                          ...initialQuery,
                          searchQuery: inputValue,
                        })}
                        getOptionSelected={(arg1, arg2) =>
                          arg1 && arg2 ? arg1.id === arg2.id : false
                        }
                        getOptionLabel={(caesar) => caesar?.description}
                        defaultValue={caesarLoaded}
                      />
                    )}
                  </Box>
                </Box>
              </Paper>
            </Grid>
            <Grid
              style={{
                flexGrow: 1,
              }}
              item
              xs={12}
              md={6}
              lg={6}
            >
              <Paper
                style={{
                  height: '100%',
                }}
                variant="outlined"
              >
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
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                    <Grid item container xs={12}>
                      <FormLabel variant="body2">Quantity: </FormLabel>
                      <FormTextField
                        type="number"
                        name="quantity"
                        inputProps={{
                          min: 1,
                          step: 0.2,
                          // style: {
                          //   paddingTop: 6,
                          //   paddingBottom: 6,
                          // },
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

function renderNullOrSelect(arg: string | number | undefined): string | number | JSX.Element {
  if (!arg) {
    return (
      <Typography component="i" variant="caption" color="textSecondary">
        Select Asset First...
      </Typography>
    )
  }
  return arg
}
