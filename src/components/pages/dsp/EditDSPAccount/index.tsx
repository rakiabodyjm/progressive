import {
  Box,
  Divider,
  Grid,
  Paper,
  TextField,
  Theme,
  Typography,
  IconButton,
  Button,
  TypographyProps,
  CircularProgress,
  PaperProps,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import {
  updateDsp,
  DspRegisterParams,
  DspRegisterParams2,
  DspUpdateType,
} from '@src/utils/api/dspApi'
import { MapIdResponseType, SearchMap, searchMap } from '@src/utils/api/mapIdApi'
import React, { ChangeEvent, useEffect, useRef, useState, useMemo } from 'react'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import validator from 'validator'
import deepEqual from '@src/utils/deepEqual'
import { useDispatch } from 'react-redux'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
import CustomTextField from '@src/components/AutoFormRenderer/CustomTextField'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { SubdistributorResponseType, searchSubdistributor } from '@src/utils/api/subdistributorApi'
const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
}))

interface EditDspAccountFormValues {
  e_bind_number: string
  dsp_code: string
  area_id: any
  subdistributor: any
}
const editableDspFields: (args: DspRegisterParams2) => EditDspAccountFormValues = ({
  area_id,
  dsp_code,
  e_bind_number,
  subdistributor,
}) => ({
  area_id,
  dsp_code,
  e_bind_number,
  subdistributor,
})

export default function CreateDSPAccount({
  modal: modalClose,
  dsp,
  ...restProps
}: {
  modal?: () => void
  dsp: DspRegisterParams2
} & PaperProps) {
  const formValuesRef = useRef({
    ...editableDspFields(dsp),
  })
  const [formValues, setFormValues] = useState<EditDspAccountFormValues>({
    ...editableDspFields(dsp),
  })
  const [formValuesMap, setFormValuesMap] = useState<EditDspAccountFormValues>({
    ...editableDspFields(dsp),
  })
  const [errors, setErrors] = useState<Record<keyof DspRegisterParams, string | null>>({
    area_id: null,
    dsp_code: null,
    e_bind_number: null,
  })
  const classes = useStyles()
  const mapID = String(dsp?.area_id)
  const [mapidQuery, setMapidQuery] = useState({
    search: mapID || '',
    page: 0,
    limit: 100,
  })
  const handleChange = (e: unknown, value?: string | string[] | undefined) => {
    if (typeof e !== 'string') {
      const eTarget = e as ChangeEvent<HTMLInputElement>
      setFormValues((prevState) => ({
        ...prevState,
        [eTarget.target.name]: eTarget.target.value,
      }))
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [e as keyof DspUpdateType]: value,
      }))
    }
  }

  const changes = useMemo(() => {
    const keyChanges: (keyof EditDspAccountFormValues)[] = []

    Object.keys(formValuesRef.current).forEach((key) => {
      const currentKey = key as keyof EditDspAccountFormValues

      if (typeof formValues[currentKey] === 'object') {
        if (!deepEqual(formValues[currentKey] as any, formValuesRef.current[currentKey] as any)) {
          keyChanges.push(currentKey)
        }
      } else if (formValuesRef.current[currentKey] !== formValues[currentKey]) {
        keyChanges.push(currentKey)
      }
    })
    return keyChanges.reduce(
      (accumulator, key) => ({
        [key]: formValues[key as keyof EditDspAccountFormValues],
      }),
      {}
    ) as Partial<EditDspAccountFormValues>
  }, [formValues])

  const [mapIdOptions, setMapidOptions] = useState<MapIdResponseType[]>([])
  const [mapidLoading, setMapidLoading] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>()
  const dispatch = useDispatch()
  useEffect(() => {
    if (timeout.current) {
      clearTimeout(timeout.current)
    }
    timeout.current = setTimeout(
      () =>
        searchMap(mapidQuery)
          .then((res) => {
            setMapidOptions(res)
          })
          .catch((err) => {
            console.error(err)
          })
          .finally(() => {
            setMapidLoading(false)
          }),
      3000
    )
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current)
      }
    }
  }, [mapidQuery])

  const handleEdit = () => {
    const schemaChecker = {
      dsp_code: (value: string) =>
        validator.isLength(formValues.dsp_code, { min: 4 }) || '*Atleast 4 letters DSP Code',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = formValues[key as keyof DspRegisterParams]
      const validateResult = validator(valuesToValidate as string)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })
    if (dsp.id) {
      updateDsp(changes, dsp.id)
        .then((res) => {
          dispatch(
            setNotification({
              type: NotificationTypes.SUCCESS,
              message: 'DSP Account Updated',
            })
          )
          setErrors({
            area_id: '',
            dsp_code: '',
            e_bind_number: '',
          })
          if (modalClose) {
            modalClose()
          }
        })
        .catch((err) => {
          dispatch({
            type: NotificationTypes.ERROR,
            message: err.message,
          })
        })
    }
  }
  return (
    <Paper variant="outlined">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleEdit()
        }}
        p={2}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Edit DSP Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit DSP Account Details
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
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />
        <Box>
          <Grid spacing={2} container>
            <Grid item xs={4}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                DSP Code
              </Typography>

              <TextField
                variant="outlined"
                name="dsp_code"
                onChange={handleChange}
                fullWidth
                size="small"
                value={formValues.dsp_code}
              />

              <Typography
                style={{
                  display: validator.isLength(
                    formValues.dsp_code,
                    { min: 4 } || formValues.dsp_code
                  )
                    ? 'none'
                    : undefined,
                }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.dsp_code && errors.dsp_code}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                E Bind Number
              </Typography>
              <TextField
                variant="outlined"
                name="e_bind_number"
                onChange={handleChange}
                fullWidth
                size="small"
                value={formValues.e_bind_number}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography color="primary" component="label" variant="body2">
                  Area ID
                </Typography>
                <SimpleMultipleAutoComplete
                  initialQuery={{ limit: 100, page: 0, search: '' } as SearchMap}
                  fetcher={(q) => searchMap(q).then((res) => res)}
                  onChange={(areaIds: MapIdResponseType[]) => {
                    setFormValues((prevState) => ({
                      ...prevState,
                      area_id: areaIds.map((ea) => ea.area_id),
                    }))
                  }}
                  getOptionLabel={(option) => `${option.area_name}, ${option.parent_name}`}
                  tagLabel={(option) => `${option.area_name}`}
                  querySetter={(previousQuery, keryboardEvent) => ({
                    ...previousQuery,
                    search: keryboardEvent,
                  })}
                  getOptionSelected={(value1, value2) => value1.area_id === value2.area_id}
                />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                Subdistributor
              </Typography>
              <SimpleAutoComplete<SubdistributorResponseType, string>
                initialQuery=""
                fetcher={(q) => searchSubdistributor(q || ' ')}
                getOptionLabel={(option) => option.name}
                getOptionSelected={(val1, val2) => val1.id === val2.id}
                querySetter={(arg, inputValue) => inputValue}
                onChange={(value) => {
                  handleChange('subdistributor', value?.id || undefined)
                }}
                defaultValue={formValues.subdistributor || undefined}
              />
            </Grid>
          </Grid>
        </Box>
        <Box mt={2} display="flex" gridGap={8} justifyContent="flex-end">
          <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleEdit()
            }}
            color="primary"
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}
function useFetchEntity(arg0: string, subdistributorId: any): { entity: any; loading: any } {
  throw new Error('Function not implemented.')
}
