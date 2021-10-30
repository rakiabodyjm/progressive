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
import UserAutoComplete from '@src/components/UserAutoComplete'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { CreateRetailer, createRetailer } from '@src/utils/api/retailerApi'
import {
  getDsps,
  getSubdistributor,
  searchSubdistributor,
  SubdistributorResponseType,
} from '@src/utils/api/subdistributorApi'
import useNotification from '@src/utils/hooks/useNotification'
import React, { ChangeEvent, useEffect, useState } from 'react'

export default function CreateRetailerAccount({
  modal: modalClose,
  subdistributorId,
  dspId,
}: {
  modal?: () => void
  subdistributorId?: string
  dspId?: string
}) {
  const [newRetailerAccount, setNewRetailerAccount] = useState<
    Record<keyof CreateRetailer, string | null>
  >({
    store_name: '',
    e_bind_number: '',
    id_type: '',
    id_number: '',
    user: null,
    subdistributor: null,
    dsp: null,
  })

  const { entity: autoLoadDsp, loading: autoLoadDspLoading } = useFetchEntity('dsp', dspId)

  const { entity: autoLoadSubdistributor, loading: autoLoadSubdistributorLoading } = useFetchEntity(
    'subdistributor',
    subdistributorId
  )
  useEffect(() => {
    if (autoLoadSubdistributor) {
      handleChange('subdistributor', autoLoadSubdistributor?.id)
    }
    if (autoLoadDsp) {
      handleChange('dsp', autoLoadDsp?.id)
    }
    // console.log(autoLoadSubdistributor, autoLoadDsp)
  }, [autoLoadSubdistributor, autoLoadDsp])

  const handleChange = (e: unknown | ChangeEvent<HTMLInputElement>, value?: string | null) => {
    if (typeof e !== 'string') {
      const eTarget = e as ChangeEvent<HTMLInputElement>
      setNewRetailerAccount((prevState) => ({
        ...prevState,
        [eTarget.target.name]: eTarget.target.value,
      }))
    } else {
      setNewRetailerAccount((prevState) => ({
        ...prevState,
        [e as keyof CreateRetailer]: value,
      }))
    }
  }
  const { subdistributor } = newRetailerAccount

  const [dspOptions, setDspOptions] = useState<DspResponseType[] | undefined>()
  useEffect(() => {
    /**
     * Fetch only if there is not dspId given
     */
    if (subdistributor && !dspId) {
      getDsps(subdistributor)
        .then((res) => {
          setDspOptions(res.data)
        })
        .catch((err) => {
          console.error(err)
        })
    }
    if (dspId && autoLoadDsp) {
      setDspOptions([autoLoadDsp as DspResponseType])
    }
  }, [subdistributor, dspId, autoLoadDsp])

  const dispatchNotif = useNotification()

  const handleSubmit = () => {
    createRetailer(newRetailerAccount as CreateRetailer)
      .then(() => {
        dispatchNotif({
          type: NotificationTypes.SUCCESS,
          message: `Retailer Account Created`,
        })
        if (modalClose) {
          modalClose()
        }
      })
      .catch((err: string[]) => {
        err.forEach((ea) => {
          const timeout = setTimeout(() => {
            dispatchNotif({
              type: NotificationTypes.ERROR,
              message: ea,
            })
            clearTimeout(timeout)
          }, 300)
        })
      })
  }
  return (
    <Paper variant="outlined">
      <Box
        component="form"
        onSubmit={(e) => {
          e?.preventDefault()
          handleSubmit()
        }}
        p={2}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography color="primary" variant="h6">
              Create New Retailer Account
            </Typography>
            <Typography color="textSecondary" variant="body2">
              Complete the form to Create a new Retailer Account
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
            />
          </Grid>
          <Grid item xs={5}>
            <TypographyLabel noWrap>E Bind Number / Phone Number: </TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              placeholder="DITO SIM Phone Number"
              name="e_bind_number"
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
            />
          </Grid>
          <Grid item xs={6}>
            <TypographyLabel>ID Number</TypographyLabel>
            <CustomTextField
              onChange={handleChange}
              name="id_number"
              placeholder="ID Number: e.g. B01-12-345678"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TypographyLabel>Subdistributor</TypographyLabel>
            {(subdistributorId && autoLoadSubdistributor) || !subdistributorId ? (
              <SimpleAutoComplete<SubdistributorResponseType, string>
                initialQuery=""
                fetcher={(q) => searchSubdistributor(q || ' ')}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(val1, val2) => val1.id === val2.id}
                querySetter={(arg, inputValue) => inputValue}
                onChange={(value) => {
                  handleChange('subdistributor', value?.id || null)
                }}
                defaultValue={autoLoadSubdistributor as SubdistributorResponseType}
                disabled={subdistributorId ? true : undefined}
              />
            ) : (
              <CustomTextField name="subdistributor" disabled />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TypographyLabel>Subdistributor DSP</TypographyLabel>

            {newRetailerAccount.subdistributor && dspOptions ? (
              <Autocomplete<DspResponseType>
                options={dspOptions}
                getOptionLabel={(option) =>
                  `${option.dsp_code} - ${option.user.last_name}, ${option.user.first_name}`
                }
                getOptionSelected={(val1, val2) => val1.id === val2.id}
                onChange={(_, value) => handleChange('dsp', value?.id || null)}
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
                defaultValue={(autoLoadDsp as DspResponseType) || null}
                disabled={autoLoadDsp ? true : undefined}
              />
            ) : (
              <CustomTextField
                name="subdistributor"
                disabled
                onClick={() => {
                  dispatchNotif({
                    message: `Select Subdistributor First`,
                    type: NotificationTypes.WARNING,
                  })
                }}
              />
            )}
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TypographyLabel>Link to User:</TypographyLabel>
            <UserAutoComplete
              onChange={(value) => {
                handleChange('user', value?.id || null)
              }}
              mutateOptions={(users) => users.filter((ea) => !ea.retailer)}
            />
          </Grid>
        </Grid>
        <Box display="flex" mt={2} justifyContent="flex-end">
          <Button
            onClick={() => {
              handleSubmit()
            }}
            color="primary"
            variant="contained"
          >
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

// const CustomTextField = ({ name, ...restProps }: { name: string } & TextFieldProps) => (

// )
const useFetchEntity = (type: 'dsp' | 'subdistributor', id?: string) => {
  const [entity, setEntity] = useState<DspResponseType | SubdistributorResponseType>()
  const [loading, setLoading] = useState<boolean>(false)

  const fetcher = (argType: typeof type) => {
    if (argType === 'dsp') {
      return getDsp
    }
    if (argType === 'subdistributor') {
      return getSubdistributor
    }

    throw new Error('useFetch entity must have type DSP | Subdistributor')
  }
  useEffect(() => {
    if (type && id) {
      setLoading(true)
      fetcher(type)(id)
        .then((res) => {
          setEntity(res)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [type, id])

  return {
    loading,
    entity,
  }
}

function CustomTextField<T extends CreateRetailer>({
  name,
  ...restProps
}: {
  name: keyof T & string
} & TextFieldProps) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}
