import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextFieldComponent, { FormTextFieldProps } from '@src/components/FormTextField'
import {
  Asset,
  createAsset,
  CreateAssetDto,
  deleteAsset,
  updateAsset,
} from '@src/utils/api/assetApi'
import validator from 'validator'
import useNotification, {
  useErrorNotification,
  useSuccessNotification,
} from '@src/utils/hooks/useNotification'

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Autocomplete } from '@material-ui/lab'
import { toCapsFirst } from '@src/utils/api/common'
import { UserTypes } from '@src/redux/data/userSlice'
import AsyncButton from '@src/components/AsyncButton'
import ModalWrapper from '@src/components/ModalWrapper'
import { NotificationTypes } from '@src/redux/data/notificationSlice'

const useStyles = makeStyles((theme: Theme) => ({
  formContainer: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
  select: {
    '& .MuiOutlinedInput-input': {
      padding: 8,
      paddingRight: 32,
    },
  },
}))

export default function EditAsset({
  modal,
  revalidateFunction,
  asset: assetProps,
}: {
  asset: Asset
  modal?: () => void
  // function from parent component to refresh data
  revalidateFunction?: () => void
}) {
  const classes = useStyles()

  const [asset, setAsset] = useState<CreateAssetDto>({
    ...assetProps,
    approval: assetProps?.approval ? (JSON.parse(assetProps.approval) as UserTypes[]) : undefined,
  })

  const assetRef = useRef(assetProps)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, Number(e.target.value))
    setAsset((prevState) => ({
      ...prevState,
      [e.target.name]: numberKeys.includes(e.target.name as typeof numberKeys[number])
        ? Number(e.target.value)
        : e.target.value,
    }))
  }

  const dispatchSuccess = useSuccessNotification()
  const dispatchError = useErrorNotification()

  const [errors, setErrors] = useState<ValidatorObjectType<CreateAssetDto> | undefined>()

  const handleSubmit = () => {
    setIsSubmitted(true)
    checkForErrors()
      .then(() => {
        postAsset()
      })
      .catch((err) => {
        setErrors(err)
      })
  }

  useEffect(() => {
    if (isSubmitted) {
      checkForErrors()
        .then(() => {
          setErrors(undefined)
          setIsSubmitted(false)
        })
        .catch((err) => {
          setErrors(err)
        })
    }
  }, [asset])

  const postAsset = () => {
    const assetDiff = Object.entries(assetRef.current).reduce(
      (diff, [keyOriginal, valueOriginal]) => {
        if (asset[keyOriginal as keyof CreateAssetDto] !== valueOriginal) {
          return {
            ...diff,
            [keyOriginal]: asset[keyOriginal as keyof CreateAssetDto],
          }
        }
        return diff
      },
      {} as Partial<CreateAssetDto>
    )

    updateAsset(assetProps.id, assetDiff)
      .then(() => {
        dispatchSuccess(`Asset Updated`)
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
        setIsSubmitted(false)
      })
  }

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

  const checkForErrors = () =>
    new Promise((resolve, reject) => {
      const errors = Object.entries(validatorObject).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key as keyof CreateAssetDto]: value(
            asset[key as keyof Omit<CreateAssetDto, 'approval' | 'whole_number_only'>]
          ),
        }),
        {} as ValidatorObjectType<CreateAssetDto>
      )

      let errorFound = false
      Object.values(errors).forEach((ea) => {
        if (ea !== null) {
          errorFound = true
        }
      })
      if (errorFound) {
        reject(errors)
      } else {
        resolve(null)
      }
    })

  // const theme: Theme = useTheme()
  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Edit Asset
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Modify Asset to be consumed by Subdistributor, DSP, Retailer and User
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

        <Grid spacing={2} container>
          <Grid className={classes.formContainer} item xs={12} sm={4}>
            <Box>
              <FormLabel>Unit Price</FormLabel>
              <FormTextField
                onChange={handleChange}
                name="unit_price"
                placeholder="Per Unit Price"
                type="number"
                inputProps={{
                  min: 1,
                  step: 0.2,
                }}
                errors={errors}
                defaultValue={asset.unit_price}
              />
            </Box>
            <Box>
              <FormLabel>SRP ( Subdistributor )</FormLabel>
              <FormTextField
                onChange={handleChange}
                type="number"
                inputProps={{
                  min: 1,
                  step: 0.2,
                }}
                name="srp_for_subd"
                placeholder="SRP for SUBD"
                errors={errors}
                defaultValue={asset.srp_for_subd}
              />
            </Box>
            <Box>
              <FormLabel>SRP ( DSP )</FormLabel>
              <FormTextField
                onChange={handleChange}
                type="number"
                inputProps={{
                  min: 1,
                  step: 0.2,
                }}
                name="srp_for_dsp"
                placeholder="SRP for DSP"
                errors={errors}
                defaultValue={asset.srp_for_dsp}
              />
            </Box>

            <Box>
              <FormLabel>SRP ( Retailer )</FormLabel>
              <FormTextField
                onChange={handleChange}
                type="number"
                inputProps={{
                  min: 1,
                  step: 0.2,
                }}
                name="srp_for_retailer"
                placeholder="SRP for Retailer"
                errors={errors}
                defaultValue={asset.srp_for_retailer}
              />
            </Box>

            <Box>
              <FormLabel>SRP ( User )</FormLabel>
              <FormTextField
                onChange={handleChange}
                type="number"
                inputProps={{
                  min: 1,
                  step: 0.2,
                }}
                name="srp_for_user"
                placeholder="SRP for User"
                errors={errors}
                defaultValue={asset.srp_for_user}
              />
            </Box>
          </Grid>

          <Grid className={classes.formContainer} item xs={12} sm={8}>
            <Grid
              style={{
                marginBottom: 0,
                marginTop: -8,
              }}
              container
              spacing={2}
            >
              <Grid item xs={5}>
                <FormLabel>Code</FormLabel>
                <FormTextField
                  onChange={handleChange}
                  placeholder="e.g. R-1000 or R1000"
                  name="code"
                  errors={errors}
                  defaultValue={asset.code}
                />
              </Grid>
              <Grid item xs={7}>
                <FormLabel>Name</FormLabel>
                <FormTextField
                  onChange={handleChange}
                  placeholder="Regular Load"
                  name="name"
                  errors={errors}
                  defaultValue={asset.name}
                />
              </Grid>
            </Grid>

            <Box>
              <FormLabel>Description</FormLabel>
              <FormTextField
                onChange={handleChange}
                placeholder="Product Description e.g. REALM1000 Load"
                name="description"
                multiline
                minRows={4.4}
                errors={errors}
                defaultValue={asset.description}
              />
            </Box>
            <Box>
              <FormLabel>Approval</FormLabel>
              <Autocomplete
                multiple
                options={['dsp', 'subdistributor', 'retailer']}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    name="approval"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                value={asset?.approval || undefined}
                renderOption={(option) => toCapsFirst(option)}
                onChange={(_, value) => {
                  const newValue = value.length > 0 ? value : []
                  console.log(newValue)
                  setAsset((prevState) => ({
                    ...prevState,
                    approval: newValue as UserTypes[],
                  }))
                }}
              />
            </Box>
            <Box>
              <FormLabel>Whole Number Only</FormLabel>
              <Select
                onChange={(e) => {
                  console.log(e)
                  setAsset((prev) => ({
                    ...prev,
                    whole_number_only: e.target.value === 'true',
                  }))
                }}
                className={classes.select}
                // defaultValue={(asset.whole_number_only === true).toString()}
                variant="outlined"
                fullWidth
                value={(asset.whole_number_only === true).toString()}
              >
                <MenuItem value="false">
                  <Typography variant="body1">
                    FALSE{' - '}
                    <Typography component="span" color="textSecondary">
                      ( e.g. 4.5 pcs will be 4.5pcs )
                    </Typography>
                  </Typography>
                </MenuItem>
                <MenuItem value="true">
                  <Typography variant="body1">
                    TRUE{' - '}
                    <Typography component="span" color="textSecondary">
                      ( e.g. 4.5 pcs will be 5pcs )
                    </Typography>
                  </Typography>
                </MenuItem>
              </Select>
            </Box>
          </Grid>
        </Grid>
        <Box my={2}>
          <Divider />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <DeleteButton
            assetId={assetProps.id}
            revalidateFunction={revalidateFunction!}
            modal={modal}
          />
          <Button
            {...(isSubmitted && { disabled: true })}
            onClick={handleSubmit}
            variant="contained"
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

const numberKeys = [
  'srp_for_dsp',
  'srp_for_retailer',
  'srp_for_subd',
  'srp_for_user',
  'unit_price',
] as const

type ValidationResult = string[] | null
type ValidatorFunction<T> = (value: T[keyof T]) => ValidationResult
type ValidatorObjectType<T> = Record<keyof T, ValidatorFunction<T>>
const validatorObject: ValidatorObjectType<Omit<CreateAssetDto, 'approval' | 'whole_number_only'>> =
  {
    code: (value) => {
      const errors = []

      if (validator.isEmpty(value.toString())) {
        errors.push('Should not be empty')
      }
      if (
        !validator.isLength(value.toString(), {
          min: 0,
          max: 16,
        })
      ) {
        errors.push('Should have characters at max 16 characters')
      }
      return returnErrors(errors)
    },
    description: (value) => {
      const errors = []
      if (validator.isEmpty(value.toString())) {
        errors.push('Should not be empty')
      }
      if (
        !validator.isLength(value.toString(), {
          min: 0,
          max: 255,
        })
      ) {
        errors.push('Should have characters at min 0 and max 255 characters')
      }

      return returnErrors(errors)
    },
    name: (value) => {
      const errors = []
      if (validator.isEmpty(value.toString())) {
        errors.push('Should not be empty')
      }
      if (
        !validator.isLength(value.toString(), {
          min: 0,
          max: 26,
        })
      ) {
        errors.push('Should have characters at min 0 and max 255 characters')
      }

      return returnErrors(errors)
    },
    ...numberKeys.reduce(
      (acc, key) => ({
        ...acc,
        [key]: (value: number) => {
          const errors = []
          if (
            validator.isEmpty(value.toString(), {
              ignore_whitespace: true,
            })
          ) {
            errors.push('Should not be empty')
          }
          if (value === 0) {
            errors.push('Should be greater than 0')
          }
          return returnErrors(errors)
        },
      }),
      {} as Record<typeof numberKeys[number], (arg: string | number) => string[] | null>
    ),
  }

function returnErrors(params: string[]): string[] | null {
  return params.length > 0 ? params : null
}

function FormTextField({
  errors,
  name,
  defaultValue,
  ...props
}: {
  defaultValue: CreateAssetDto[keyof CreateAssetDto]
  errors: ValidatorObjectType<CreateAssetDto> | undefined
} & FormTextFieldProps<CreateAssetDto>) {
  return (
    <>
      <FormTextFieldComponent name={name} defaultValue={defaultValue} {...props} />

      {errors && errors[name] && (
        <Typography color="error" variant="caption">
          {errors[name]}
        </Typography>
      )}
    </>
  )
}

function DeleteButton({
  revalidateFunction,
  assetId,
  modal,
}: {
  revalidateFunction: () => void
  assetId: string
  modal?: () => void
}) {
  const theme = useTheme()
  const dispatchNotif = useNotification()
  const [confirmationModalOpen, setConfirmationModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const handleDelete = useCallback(() => {
    setLoading(true)
    deleteAsset(assetId)
      .then((res) => {
        dispatchNotif({
          type: NotificationTypes.SUCCESS,
          message: `Asset succesfully Deleted`,
        })
      })
      .catch((err: string[]) => {
        err.forEach((ea) => {
          dispatchNotif({
            type: NotificationTypes.ERROR,
            message: ea,
          })
        })
      })
      .finally(() => {
        setLoading(false)
        handleConfirmationModalIsOpen(false)()
        revalidateFunction()
        if (modal) {
          modal()
        }
      })
  }, [assetId])

  const handleConfirmationModalIsOpen = useCallback(
    (state: boolean) => () => {
      setConfirmationModalOpen(state)
    },
    []
  )

  return (
    <>
      <AsyncButton
        style={{
          background: theme.palette.error.main,
          color: theme.palette.getContrastText(theme.palette.error.main),
        }}
        variant="contained"
        onClick={handleConfirmationModalIsOpen(true)}
        // onClick={handleDelete}
      >
        Delete
      </AsyncButton>
      <ModalWrapper
        containerSize="xs"
        open={confirmationModalOpen}
        onClose={handleConfirmationModalIsOpen(false)}
      >
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Are you Sure you want to delete?</Typography>
            <Box my={2}>
              <Divider />
            </Box>
            <Typography variant="body2">
              Deleting this will disable this as an option for creating inventory items
            </Typography>
            <Box my={2}>
              <Divider />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <AsyncButton
                color="default"
                onClick={handleConfirmationModalIsOpen(false)}
                variant="contained"
              >
                Cancel
              </AsyncButton>
              <AsyncButton onClick={handleDelete} loading={loading} disabled={loading}>
                Confirm
              </AsyncButton>
            </Box>
          </Box>
        </Paper>
      </ModalWrapper>
    </>
  )
}
