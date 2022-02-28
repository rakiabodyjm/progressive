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
  TextFieldProps,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { createDsp, CreateDspAccount } from '@src/utils/api/dspApi'
import { MapIdResponseType, SearchMap, searchMap } from '@src/utils/api/mapIdApi'
import {
  getSubdistributor,
  searchSubdistributor,
  SubdistributorResponseType,
} from '@src/utils/api/subdistributorApi'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import validator from 'validator'
import { useDispatch } from 'react-redux'
import { extractErrorFromResponse } from '@src/utils/api/common'
import useNotification from '@src/utils/hooks/useNotification'
import UserAutoComplete from '@src/components/UserAutoComplete'
import AsyncButton from '@src/components/AsyncButton'
const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
}))
export default function CreateDSPAccount({
  modal: modalClose,
  subdistributorId,
}: {
  modal?: () => void
  subdistributorId?: string
}) {
  const activeSubdistributorId = subdistributorId

  const [newDspAccount, setNewDspAccount] = useState<CreateDspAccount>({
    area_id: [],
    dsp_code: '',
    e_bind_number: '',
    subdistributor: '',
    user: '',
  })

  const [errors, setErrors] = useState<Record<keyof CreateDspAccount, string | null>>({
    area_id: null,
    dsp_code: null,
    e_bind_number: null,
    subdistributor: null,
    user: null,
  })
  const classes = useStyles()

  const handleChange = (
    e: unknown | React.ChangeEvent<HTMLInputElement>,
    value?: string | null
  ) => {
    if (typeof e !== 'string') {
      const eTarget = e as ChangeEvent<HTMLInputElement>
      setNewDspAccount((prevState) => ({
        ...prevState,
        [eTarget.target.name]: eTarget.target.value,
      }))
    } else {
      setNewDspAccount((prevState) => ({
        ...prevState,
        [e as keyof CreateDspAccount]: value,
      }))
    }
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

  const dispatchNotif = useNotification()
  const dispatch = useDispatch()
  const setButtonLoading = (param?: false) => {
    setButtonProps((prevState) => ({
      ...prevState,
      loading: typeof param !== 'boolean' ? true : param,
    }))
  }

  const [buttonProps, setButtonProps] = useState<{
    loading: boolean
    disabled: boolean
  }>({
    loading: false,
    disabled: true,
  })
  const handleSubmit = () => {
    setButtonLoading()
    // const checkAreaID = newDspAccount.area_id.length > 0
    // const checkSubdistributor = newDspAccount.subdistributor.length > 0
    const schemaChecker = {
      dsp_code: (value: string) =>
        validator.isLength(newDspAccount.dsp_code, { min: 4 }) || '*DSP Code Required (4+ Letters)',
      e_bind_number: (value: string) =>
        !validator.isEmpty(newDspAccount.e_bind_number) || '*E Bind Number Required',
      // subdistributor: (value: string) => checkSubdistributor || '*Empty Subdistributor',
      // user: (value: string) => !validator.isEmpty(newDspAccount.user) || '*Empty User ID',
      // area_id: (value: any) => checkAreaID || '*Empty Area ID',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = newDspAccount[key as keyof CreateDspAccount]
      const validateResult = validator(valuesToValidate as string)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
      }
    })
    createDsp(newDspAccount as CreateDspAccount)
      .then(() => {
        dispatchNotif({
          type: NotificationTypes.SUCCESS,
          message: `DSP Account Created`,
        })
        if (modalClose) {
          modalClose()
        }
      })
      .catch((err: string[]) => {
        if (Array.isArray(err)) {
          err.forEach((ea) => {
            dispatchNotif({
              message: ea,
              type: NotificationTypes.ERROR,
            })
          })
        } else {
          dispatchNotif({
            message: err,
            type: NotificationTypes.ERROR,
          })
        }
      })
      .finally(() => {
        setButtonLoading(false)
      })
  }
  const { entity: autoLoadSubdistributor, loading: autoLoadSubdistributorLoading } = useFetchEntity(
    'subdistributor',
    subdistributorId
  )
  useEffect(() => {
    if (autoLoadSubdistributor) {
      handleChange('subdistributor', autoLoadSubdistributor?.id)
    }

    // console.log(autoLoadSubdistributor, autoLoadDsp)
  }, [autoLoadSubdistributor])

  return (
    <Paper variant="outlined">
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        p={2}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Create New DSP Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Complete the form to create a new DSP Account
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
                placeholder="DSP Code"
                fullWidth
                size="small"
                value={newDspAccount.dsp_code}
              />

              <Typography
                style={{
                  display: validator.isLength(newDspAccount.dsp_code, { min: 4 })
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
                placeholder="DITO SIM Phone Number"
                fullWidth
                size="small"
                value={newDspAccount.e_bind_number}
              />
              <Typography
                style={{
                  display: !validator.isEmpty(newDspAccount.e_bind_number) ? 'none' : undefined,
                }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.e_bind_number && errors.e_bind_number}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                Area IDs
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
                  setNewDspAccount((prevState) => ({
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
              <Typography
                style={{ display: newDspAccount.area_id.length > 0 ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.area_id && errors.area_id}
              </Typography>
            </Grid>
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
              {/* <Typography
                style={{
                  display: !validator.isEmpty(newDspAccount.subdistributor) ? 'none' : undefined,
                }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.subdistributor && errors.subdistributor}
              </Typography> */}
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                User ID
              </Typography>
              <UserAutoComplete
                onChange={(value) => {
                  handleChange('user', value?.id || null)
                }}
                mutateOptions={(users) => users.filter((ea) => !ea.dsp && !ea.retailer)}
              />
              {/* <Typography
                style={{ display: !validator.isEmpty(newDspAccount.user) ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.user && errors.user}
              </Typography> */}
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" mt={2} gridGap={8} justifyContent="flex-end">
          <AsyncButton
            disabled={!newDspAccount.user || buttonProps.loading}
            onClick={() => {
              handleSubmit()
            }}
            loading={buttonProps.loading}
            // disabled={buttonProps.disabled}
          >
            Confirm
          </AsyncButton>
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

const useFetchEntity = (type: 'dsp' | 'subdistributor', id?: string) => {
  const [entity, setEntity] = useState<SubdistributorResponseType>()
  const [loading, setLoading] = useState<boolean>(false)

  const fetcher = (argType: typeof type) => {
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

function CustomTextField<T extends CreateDspAccount>({
  name,
  ...restProps
}: {
  name: keyof T & string
} & TextFieldProps) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}
