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
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
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
import { extractErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import { Autocomplete } from '@material-ui/lab'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
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
}
const editableDspFields: (
  args: DspRegisterParams | DspRegisterParams2
) => EditDspAccountFormValues = ({ area_id, dsp_code, e_bind_number }) => ({
  area_id,
  dsp_code,
  e_bind_number,
})

export default function CreateDSPAccount({
  modal: modalClose,
  dsp,
  ...restProps
}: {
  modal?: () => void
  dsp: DspRegisterParams2
} & PaperProps) {
  const activeDSPId = dsp.id
  const formValuesRef = useRef({
    ...editableDspFields(dsp),
  })
  const [formValues, setFormValues] = useState<EditDspAccountFormValues>({
    ...editableDspFields(dsp),
  })
  const [editDspAccount, setEditDspAccount] = useState<DspUpdateType>({
    area_id: [],
    dsp_code: '',
    e_bind_number: '',
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

  const changes = useMemo(() => {
    /**
     * Get changes based on formValuesRef
     */
    const keyChanges: string[] = []

    Object.keys(formValuesRef.current).forEach((key) => {
      const currentKey = key as keyof EditDspAccountFormValues

      if (typeof editDspAccount[currentKey] === 'object') {
        if (
          !deepEqual(editDspAccount[currentKey] as any, formValuesRef.current[currentKey] as any)
        ) {
          keyChanges.push(currentKey)
          console.log(' if keychanges', keyChanges)
        }
      } else if (formValuesRef.current[currentKey] !== editDspAccount[currentKey]) {
        keyChanges.push(currentKey)
        console.log(' else keychanges', keyChanges)
      }
    })

    return keyChanges.reduce(
      (accumulator, key) => ({
        [key]: editDspAccount[key as keyof EditDspAccountFormValues],
      }),
      {}
    ) as Partial<EditDspAccountFormValues>
    // return changes
  }, [editDspAccount])

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
    console.log(editDspAccount)
    const schemaChecker = {
      dsp_code: (value: string) =>
        validator.isLength(editDspAccount.dsp_code, { min: 4 }) || '*Atleast 4 letters DSP Code',
      e_bind_number: (value: string) =>
        validator.isMobilePhone(editDspAccount.e_bind_number) || '*Invalid E Bind Number',
      // subdistributor: (value: string) => checkSubdistributor || '*Empty Subdistributor',
      // user: (value: string) => !validator.isEmpty(editDspAccount.user) || '*Empty User ID',
      // area_id: (value: any) => checkAreaID || '*Empty Area ID',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = editDspAccount[key as keyof DspRegisterParams]
      const validateResult = validator(valuesToValidate as string)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })
    console.log(dsp.id)
    console.log('update', formatUpdateValues(changes))
    if (dsp.id) {
      const { dsp_code, e_bind_number, area_id } = editDspAccount
      updateDsp(formatUpdateValues(changes), dsp.id)
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

  useEffect(() => {
    if (activeDSPId) {
      console.log('With ID passed')
      console.log(activeDSPId)
      setEditDspAccount((prevState) => ({
        ...prevState,
        e_bind_number: formValues.e_bind_number,
        dsp_code: formValues.dsp_code,
        area_id: formValues.area_id,
      }))
    } else {
      console.log('Without ID passed')
      console.log(activeDSPId)
    }
  }, [activeDSPId, formValues])

  useEffect(() => {
    console.log('errors', errors)
    console.log('formvalues', formValues)
    console.log('editDspAccount', editDspAccount)
  }, [errors, formValues, editDspAccount])
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
                onChange={(e) => {
                  setFormValues((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }))
                  setEditDspAccount((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }))
                }}
                fullWidth
                size="small"
                value={formValues.dsp_code}
              />

              <Typography
                style={{
                  display: validator.isLength(editDspAccount.dsp_code, { min: 4 })
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
                onChange={(e) => {
                  setFormValues((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }))
                  setEditDspAccount((prevState) => ({
                    ...prevState,
                    [e.target.name]: e.target.value,
                  }))
                }}
                fullWidth
                size="small"
                value={formValues.e_bind_number}
              />
              <Typography
                style={{
                  display: validator.isMobilePhone(editDspAccount.e_bind_number)
                    ? 'none'
                    : undefined,
                }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.e_bind_number && errors.e_bind_number}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography color="primary" component="label" variant="body2">
                  Area ID
                </Typography>
                <SimpleMultipleAutoComplete
                  /**
                   * Initial value needed by searchMap async function
                   */
                  initialQuery={{ limit: 100, page: 0, search: '' } as SearchMap}
                  /**
                   * searchMap async function with the initialQuery as 'q'
                   */
                  fetcher={(q) => searchMap(q).then((res) => res)}
                  /**
                   * onChange event of AutoComplete
                   */
                  onChange={(areaIds: MapIdResponseType[]) => {
                    setEditDspAccount((prevState) => ({
                      ...prevState,
                      area_id: areaIds.map((ea) => ea.area_id),
                    }))
                  }}
                  /**
                   * This is how options are previewed as selections
                   */
                  getOptionLabel={(option) => `${option.area_name}, ${option.parent_name}`}
                  /**
                   * This is how options are previewed as selected
                   */
                  tagLabel={(option) => `${option.area_name}`}
                  /**
                   * setting the query parameter according to keyboard onChange event
                   */
                  querySetter={(previousQuery, keryboardEvent) => ({
                    ...previousQuery,
                    search: keryboardEvent,
                  })}
                  /**
                   * equality test for AutoComplete to know which options are selected
                   */
                  getOptionSelected={(value1, value2) => value1.area_id === value2.area_id}
                />
              </Box>
            </Grid>
            {/* <Grid item xs={12}>
              <TypographyLabel>Subdistributor</TypographyLabel>

              <TextField
                variant="outlined"
                name="subdistributor"
                fullWidth
                size="small"
                value={activeSubdistributorId}
              /> */}

            {/* {!displaySubdistributor && (
                <SimpleAutoComplete<SubdistributorResponseType, string>
                  initialQuery=""
                  fetcher={(q) => searchSubdistributor(q || ' ')}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(val1, val2) => val1.id === val2.id}
                  querySetter={(arg, inputValue) => inputValue}
                  onChange={(value) => {
                    handleChange('subdistributor', value?.id)
                  }}
                />
              )} */}
            {/* <Typography
                style={{
                  display: !validator.isEmpty(editDspAccount.subdistributor) ? 'none' : undefined,
                }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.subdistributor && errors.subdistributor}
              </Typography> */}
            {/* </Grid> */}
            {/* <Grid item xs={12}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                User ID
              </Typography>
              <TextField
                variant="outlined"
                name="user"
                onChange={handleChange}
                fullWidth
                size="small"
                value={editDspAccount.user}
              />
              <Typography
                style={{ display: !validator.isEmpty(editDspAccount.user) ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.user && errors.user}
              </Typography>
            </Grid> */}
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

const formatUpdateValues = (args: Partial<EditDspAccountFormValues>): Partial<DspUpdateType> =>
  ({
    ...args,
    ...(args?.area_id && { area_id: args.area_id.area_id }),
  } as Partial<DspUpdateType>)
