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
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { createDspAccount, CreateDspAccount } from '@src/utils/api/dspApi'
import { MapIdResponseType, SearchMap, searchMap } from '@src/utils/api/mapIdApi'
import { searchSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import React, { ChangeEvent, useEffect, useState } from 'react'
import useNotification from '@src/utils/hooks/useNotification'
import { NotificationTypes } from '@src/redux/data/notificationSlice'
import validator from 'validator'
const useStyles = makeStyles((theme: Theme) => ({
  formLabel: {
    color: theme.palette.primary.main,
  },
  errorLabel: {
    color: theme.palette.error.main,
  },
}))
export default function EditDSPAccountV2({
  modal: modalClose,
  subdistributorId,
}: {
  modal?: () => void
  subdistributorId?: SubdistributorResponseType
}) {
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
    const checkAreaID = newDspAccount.area_id.length > 0
    const checkSubdistributor = newDspAccount.subdistributor.length > 0
    const schemaChecker = {
      dsp_code: (value: string) =>
        validator.isLength(newDspAccount.dsp_code, { min: 3 }) || 'Atleast 4 letters DSP Code',
      e_bind_number: (value: string) =>
        validator.isMobilePhone(newDspAccount.e_bind_number) || 'Invalid E Bind Number',
      subdistributor: (value: string) =>
        !validator.isEmpty(newDspAccount.subdistributor) || 'Empty Subdistributor',
      user: (value: string) => checkSubdistributor || 'Empty User ID',
      area_id: (value: string) => checkAreaID || 'Empty User ID',
    }
    Object.keys(schemaChecker).forEach((key) => {
      const validator = schemaChecker[key as keyof typeof schemaChecker]
      const valuesToValidate = newDspAccount[key as keyof CreateDspAccount]
      const validateResult = validator(valuesToValidate as keyof typeof schemaChecker)
      if (validateResult) {
        setErrors((prevState) => ({
          ...prevState,
          [key]: validateResult,
        }))
        setIsSubmitted(true)
      } else setIsSubmitted(true)
    })
  }
  const { subdistributor } = newDspAccount

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
  const handleSubmit = () => {
    console.log(newDspAccount)
    createDspAccount(newDspAccount as CreateDspAccount)
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

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const activeSubdistributorId = subdistributorId

  useEffect(() => {
    if (activeSubdistributorId) {
      console.log('With ID passed')
      setDisplaySubdistributor(true)
    } else {
      console.log('Without ID passed')
      setDisplaySubdistributor(false)
    }
  }, [activeSubdistributorId])
  const [displaySubdistributor, setDisplaySubdistributor] = useState<boolean>()

  // useEffect(() => {
  //   const schemaChecker = {
  //     dsp_code: (value: string) => !validator.isEmpty(value) && 'Invalid DSP Code',
  //     e_bind_number: (value: string) => !validator.isMobilePhone(value) && 'Invalid E Bind Number',
  //   }
  //   Object.keys(schemaChecker).forEach((key) => {
  //     const validator = schemaChecker[key as keyof typeof schemaChecker]
  //     const valuesToValidate = dsp[key as keyof CreateDspAccount]
  //     const validateResult = validator(valuesToValidate)
  //     if (validateResult) {
  //       setErrors((prevState) => ({
  //         ...prevState,
  //         [key]: validateResult,
  //       }))
  //     }
  //   })
  // }, [dsp])

  useEffect(() => {
    console.log(errors)
  }, [errors])

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
        <Box display="flex" alignItems="center" justifyContent="space-between">
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
                onClick={() => {
                  modalClose()
                }}
                style={{
                  padding: 4,
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
                value={newDspAccount.dsp_code}
              />

              <Typography
                style={{ display: !isSubmitted ? 'none' : undefined }}
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
                value={newDspAccount.e_bind_number}
              />
              <Typography
                style={{ display: !isSubmitted ? 'none' : undefined }}
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
                style={{ display: !isSubmitted ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.area_id && errors.area_id}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TypographyLabel>Subdistributor</TypographyLabel>

              <TextField
                style={{ display: !displaySubdistributor ? 'none' : undefined }}
                variant="outlined"
                name="user"
                onChange={handleChange}
                fullWidth
                size="small"
                value={activeSubdistributorId}
              />

              {!displaySubdistributor && (
                <SimpleAutoComplete<SubdistributorResponseType, string>
                  initialQuery=""
                  fetcher={(q) => searchSubdistributor(q || ' ')}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(val1, val2) => val1.id === val2.id}
                  querySetter={(arg, inputValue) => inputValue}
                  onChange={(value) => {
                    console.log(value?.id)
                    console.log(newDspAccount)
                    handleChange('subdistributor', value?.id)
                  }}
                />
              )}
              <Typography
                style={{ display: !isSubmitted ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.subdistributor && errors.subdistributor}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography className={classes.formLabel} component="label" variant="body2">
                User ID
              </Typography>
              <TextField
                variant="outlined"
                name="user"
                onChange={handleChange}
                fullWidth
                size="small"
                value={newDspAccount.user}
              />
              <Typography
                style={{ display: !isSubmitted ? 'none' : undefined }}
                className={classes.errorLabel}
                component="label"
                variant="caption"
              >
                {errors.user && errors.user}
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box display="flex" gridGap={8} justifyContent="flex-end" p={2}>
          <Button
            variant="contained"
            type="submit"
            onClick={(e) => {
              e.preventDefault()
              handleSubmit()
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
