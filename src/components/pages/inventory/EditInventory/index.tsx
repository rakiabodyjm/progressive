/* eslint-disable no-redeclare */
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField, { FormTextFieldProps } from '@src/components/FormTextField'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'

import {
  getInventory,
  Inventory,
  UpdateInventory,
  updateInventory,
} from '@src/utils/api/inventoryApi'
import {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  useContext,
  Dispatch,
  SetStateAction,
  createContext,
  Suspense,
} from 'react'
import { Asset } from '@src/utils/api/assetApi'
import { useRouter } from 'next/router'
// import { isNumberString } from 'class-validator'
import AsyncButton from '@src/components/AsyncButton'
import AssetDisplay from '@src/components/pages/inventory/EditInventory/AssetDisplay'

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    '& > .MuiPaper-outlined': {
      height: '100%',
    },
  },
}))

export default function EditInventory({
  inventoryId,
  modal,
  revalidateFunction,
  isAdmin,
}: {
  inventoryId: Inventory['id']
  modal?: () => void
  revalidateFunction?: () => void
  isAdmin?: true
}) {
  const classes = useStyles()
  // const { query } = useRouter()
  // const { isAdmin } = query
  const [inventory, setInventory] = useState<Partial<UpdateInventory>>({
    // asset: '',
    // caesar: '',
    quantity: 0,
    unit_price: 0,
    description: '',
    name: '',
    srp_for_dsp: 0,
    srp_for_retailer: 0,
    srp_for_subd: 0,
    srp_for_user: 0,
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
          const {
            unit_price,
            description,
            name,
            srp_for_dsp,
            srp_for_retailer,
            srp_for_subd,
            srp_for_user,
            quantity,
            asset,
            caesar,
          } = res
          setSelectedAsset(asset)
          setInventory({
            unit_price,
            description,
            name,
            srp_for_dsp,
            srp_for_retailer,
            srp_for_subd,
            srp_for_user,
            quantity,
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

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    // setInventory((prevState) => ({
    //   ...prevState,
    //   [e.target.name]: isNumberString(e.target.value) ? Number(e.target.value) : e.target.value,
    // }))
  }
  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Edit Inventory Item
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Modify Inventory Item of this Account
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
        {selectedAsset ? <AssetDisplay selectedAsset={selectedAsset} /> : <CircularProgress />}
        <Box my={1}>
          <Divider />
        </Box>

        <Paper variant="outlined">
          <Box p={2}>
            <Typography variant="body1" color="primary">
              Inventory
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Modify desired name shown to buyers and their pricing
            </Typography>
            <Box my={1}>
              <Divider />
            </Box>
            <Grid
              container
              style={{
                alignItems: 'stretch',
              }}
              spacing={1}
            >
              <Grid item xs={6} className={classes.formContainer}>
                <Paper variant="outlined">
                  <Box p={1}>
                    <Grid container spacing={1}>
                      {!!isAdmin && (
                        <>
                          <Grid container spacing={1}>
                            <Grid item xs={7}>
                              <FormLabel variant="body2">Quantity: </FormLabel>
                              <NumberTextField
                                onChange={onChange}
                                name="quantity"
                                value={inventory.quantity}
                              />
                            </Grid>
                          </Grid>
                          <Box py={1}>
                            <Divider />
                          </Box>
                        </>
                      )}
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <FormLabel variant="body2">Unit Price: </FormLabel>
                          <CustomTextField
                            onChange={onChange}
                            name="unit_price"
                            value={inventory.unit_price}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <FormLabel variant="body2">SRP Subd: </FormLabel>
                          <NumberTextField
                            onChange={onChange}
                            name="srp_for_subd"
                            value={inventory.srp_for_subd}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormLabel variant="body2">SRP DSP: </FormLabel>
                          <NumberTextField
                            onChange={onChange}
                            name="srp_for_dsp"
                            value={inventory.srp_for_dsp}
                          />
                        </Grid>
                      </Grid>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <FormLabel variant="body2">SRP Retailer: </FormLabel>
                          <NumberTextField
                            onChange={onChange}
                            name="srp_for_retailer"
                            value={inventory.srp_for_retailer}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <FormLabel variant="body2">SRP User: </FormLabel>
                          <NumberTextField
                            onChange={onChange}
                            name="srp_for_user"
                            value={inventory.srp_for_user}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Box>
                </Paper>
              </Grid>

              <Grid className={classes.formContainer} item xs={6}>
                <Paper variant="outlined">
                  <Box p={1}>
                    <Grid item xs={12}>
                      <FormLabel>Name: </FormLabel>
                      <CustomTextField name="name" value={inventory.name} onChange={onChange} />
                    </Grid>
                    <Grid item xs={12}>
                      <FormLabel>Description: </FormLabel>
                      <CustomTextField
                        multiline
                        name="description"
                        value={inventory.description}
                        onChange={onChange}
                        rows={5}
                      />
                    </Grid>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Paper>
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
    </Paper>
  )
}

const NumberTextField = ({ ...restProps }: FormTextFieldProps<Partial<UpdateInventory>>) => (
  <CustomTextField
    type="number"
    inputProps={{
      min: 1,
      step: 0.2,
      style: {
        paddingTop: 6,
        paddingBottom: 6,
      },
    }}
    fullWidth
    {...restProps}
  />
)

const CustomTextField = ({ ...restProps }: FormTextFieldProps<Partial<UpdateInventory>>) => (
  <FormTextField
    inputProps={{
      style: {
        paddingTop: 6,
        paddingBottom: 6,
      },
    }}
    {...restProps}
  />
)
