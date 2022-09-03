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
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextFieldComponent, { FormTextFieldProps } from '@src/components/FormTextField'
import { createAsset, CreateAssetDto } from '@src/utils/api/assetApi'
import validator from 'validator'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'

import { ChangeEvent, useEffect, useState } from 'react'
import { Autocomplete } from '@material-ui/lab'
import { toCapsFirst } from '@src/utils/api/common'

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

export default function CreateAsset({
  modal,
  revalidateFunction,
}: {
  modal?: () => void
  revalidateFunction?: () => void
}) {
  const classes = useStyles()
  const [asset, setAsset] = useState<CreateAssetDto>({
    name: '',
    code: '',
    description: '',
    srp_for_dsp: 0,
    srp_for_retailer: 0,
    srp_for_subd: 0,
    srp_for_user: 0,
    unit_price: 0,
    approval: undefined,
    whole_number_only: false,
  })

  /**
   *
   * Won't be handling 'approval'
   * value from AutoComplete
   */
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
    createAsset(asset)
      .then(() => {
        dispatchSuccess('Asset created')
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

  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Add New Asset
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create New Asset to be consumed by Subdistributor, DSP, Retailer and User
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
                />
              </Grid>
              <Grid item xs={7}>
                <FormLabel>Name</FormLabel>
                <FormTextField
                  onChange={handleChange}
                  placeholder="Regular Load"
                  name="name"
                  errors={errors}
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
                renderOption={(option) => toCapsFirst(option)}
                onChange={(event, value) => {
                  const newValue = value.length > 0 ? value : undefined
                  setAsset(
                    (prevState) =>
                      ({
                        ...prevState,
                        approval: newValue,
                      } as CreateAssetDto)
                  )
                }}
                value={asset.approval}
              />
            </Box>
            <Box>
              <FormLabel>Whole Number Only</FormLabel>
              <Select
                onChange={(e) => {
                  setAsset((prev) => ({
                    ...prev,
                    whole_number_only: e.target.value === 'true',
                  }))
                }}
                className={classes.select}
                defaultValue="false"
                variant="outlined"
                fullWidth
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
        <Box display="flex" justifyContent="flex-end">
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
  ...props
}: {
  errors: ValidatorObjectType<CreateAssetDto> | undefined
} & FormTextFieldProps<CreateAssetDto>) {
  return (
    <>
      <FormTextFieldComponent<CreateAssetDto> name={name} {...props} />

      {errors && errors[name] && (
        <Typography color="error" variant="caption">
          {errors[name]}
        </Typography>
      )}
    </>
  )
}
