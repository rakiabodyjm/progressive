import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Paper,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { DspResponseType } from '@src/utils/api/dspApi'
import {
  CreateRetailer,
  RetailerResponseType,
  updateRetailer,
  UpdateRetailer,
} from '@src/utils/api/retailerApi'
import {
  getDsps,
  searchSubdistributor,
  SubdistributorResponseType,
} from '@src/utils/api/subdistributorApi'
import useNotification from '@src/utils/hooks/useNotification'
import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import validator from 'validator'

function reduceRetailer(arg: RetailerResponseType): UpdateRetailer {
  return {
    store_name: arg.store_name,
    e_bind_number: arg.e_bind_number,
    id_type: arg.id_type,
    id_number: arg.id_number,
    subdistributor: arg.subdistributor.id,
    dsp: arg.dsp.id,
  }
}
export default function EditRetailerAccount({
  modal: modalClose,
  retailer: retailerProps,
}: {
  modal?: () => void
  retailer: RetailerResponseType
}) {
  const retailerPropsDefault = useRef<RetailerResponseType>(retailerProps)
  const updateRetailerDefault = useRef<UpdateRetailer>(reduceRetailer(retailerProps))

  const [retailer, setRetailer] = useState<UpdateRetailer>(reduceRetailer(retailerProps))

  const handleChange = (e: unknown, value?: string | string[] | undefined) => {
    if (typeof e !== 'string') {
      const eTarget = e as ChangeEvent<HTMLInputElement>
      setRetailer((prevState) => ({
        ...prevState,
        [eTarget.target.name]: eTarget.target.value,
      }))
    } else {
      setRetailer((prevState) => ({
        ...prevState,
        [e as keyof UpdateRetailer]: value,
      }))
    }
  }

  const [dspOptions, setDspOptions] = useState<DspResponseType[]>([])

  const dispatchNotif = useNotification()

  useEffect(() => {
    if (retailer?.subdistributor) {
      setDspOptions([])
      getDsps(retailer?.subdistributor)
        .then((res) => {
          setDspOptions(res.data)
        })
        .catch((err) => {
          dispatchNotif({
            type: NotificationTypes.ERROR,
            message: err.message,
          })
        })
    } else {
      setDspSelected(undefined)
    }
    if (!retailer.subdistributor) {
      setRetailer((prevState) => ({
        ...prevState,
        dsp: undefined,
      }))
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retailer.subdistributor])

  const [dspSelected, setDspSelected] = useState<RetailerResponseType['dsp'] | undefined>(
    retailerProps.dsp
  )

  const handleSubmit = useCallback(() => {
    const changes = Object.entries(updateRetailerDefault.current).reduce((acc, [key, value]) => {
      if (retailer[key as keyof typeof updateRetailerDefault.current] !== value) {
        return {
          ...acc,
          [key]: retailer[key as keyof typeof retailer],
        }
      }
      return acc
    }, {})

    updateRetailer(retailerProps.id, changes)
      .then((res) => {
        dispatchNotif({
          type: NotificationTypes.SUCCESS,
          message: `Retailer Updated`,
        })
        // close and Trigger rerender
        if (modalClose) {
          console.log('executing modalclose')
          modalClose()
        }
      })
      .catch((err: string[]) => {
        err.forEach((error) => {
          dispatchNotif({
            type: NotificationTypes.ERROR,
            message: error,
          })
        })
      })
  }, [modalClose, retailer, retailerProps.id])

  return (
    <Paper variant="outlined">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography color="primary" variant="h6">
              Edit Retailer Account
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Edit Retailer Account Details
            </Typography>
          </Box>
          <Box>
            {modalClose && (
              <IconButton
                style={{
                  padding: 4,
                }}
                onClick={() => {
                  modalClose()
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>

        <Divider
          style={{
            margin: '16px 0',
          }}
        />
        <Grid spacing={2} container>
          <Grid item xs={7}>
            <TypographyLabel>Store Name: </TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              placeholder="Name of Store"
              name="store_name"
              defaultValue={retailerPropsDefault.current?.store_name || ''}
            />
          </Grid>
          <Grid item xs={5}>
            <TypographyLabel noWrap>E Bind Number / Phone Number: </TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              placeholder="DITO SIM Phone Number"
              name="e_bind_number"
              defaultValue={retailerPropsDefault?.current?.e_bind_number || ''}
            />
          </Grid>
        </Grid>

        <Grid spacing={2} container>
          <Grid item xs={6}>
            <TypographyLabel>ID Type: </TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              placeholder={`LTO Driver's License, Passport...`}
              name="id_type"
              defaultValue={retailerPropsDefault.current?.id_type || ''}
            />
          </Grid>
          <Grid item xs={6}>
            <TypographyLabel>ID Number</TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              name="id_number"
              placeholder="ID Number: e.g. B01-12-345678"
              defaultValue={retailerPropsDefault.current?.id_number || ''}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TypographyLabel>Subdistributor</TypographyLabel>
            {retailer ? (
              <SimpleAutoComplete<SubdistributorResponseType, string>
                initialQuery=""
                fetcher={(q) => searchSubdistributor(q || ' ')}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(val1, val2) => val1.id === val2.id}
                querySetter={(arg, inputValue) => inputValue}
                onChange={(value) => {
                  handleChange('subdistributor', value?.id || undefined)
                }}
                defaultValue={retailerPropsDefault.current?.subdistributor || undefined}
              />
            ) : (
              <CustomTextField name="subdistributor" disabled />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TypographyLabel>Subdistributor DSP</TypographyLabel>

            {retailer?.dsp && dspOptions?.length > 0 && retailer.subdistributor ? (
              <Autocomplete<DspResponseType>
                options={dspOptions}
                getOptionLabel={(option) => `${option.dsp_code}`}
                getOptionSelected={(val1, val2) => val1.id === val2.id}
                onChange={(_, value) => handleChange('dsp', value?.id || undefined)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )}
                value={dspSelected}
              />
            ) : (
              <CustomTextField
                name="subdistributor"
                disabled
                onClick={() => {
                  dispatchNotif({
                    message:
                      retailer?.subdistributor && dspOptions?.length === 0
                        ? `Subdistributor doesn't have DSP's`
                        : `Select Subdistributor First`,
                    type: NotificationTypes.WARNING,
                  })
                }}
              />
            )}
          </Grid>
        </Grid>

        <Box display="flex" mt={2} justifyContent="flex-end">
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Confirm
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

const TypographyLabel = ({
  children,
  ...restProps
}: { children: TypographyProps['children'] } & TypographyProps<'label'>) => (
  <Typography
    display="block"
    color="primary"
    component="label"
    variant="body2"
    noWrap
    {...restProps}
  >
    {children}
  </Typography>
)

function CustomTextField<T extends CreateRetailer>({
  name,
  ...restProps
}: {
  name: keyof T & string
} & TextFieldProps) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}

function customValidator(key: '', value: string[] | string) {
  const schemaValidators = {
    store_name: (val: string) =>
      validator.isLength(val, {
        max: 26,
        min: 3,
      })
        ? undefined
        : 'Store Name must be between 3 and 26 characters',

    e_bind_number: (val: string) =>
      !validator.isMobilePhone(val) ? undefined : `Invalid Phone number format`,
  }
}
