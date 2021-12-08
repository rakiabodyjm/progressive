import {
  Box,
  Divider,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Button,
  IconButton,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { Autocomplete } from '@material-ui/lab'
import AestheticObjectFormRenderer from '@src/components/ObjectFormRendererV2'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { MapIdResponseType, searchMap } from '@src/utils/api/mapIdApi'
import type {
  SubdistributorResponseType,
  SubdistributorUpdateType,
} from '@src/utils/api/subdistributorApi'
import { updateSubdistributor } from '@src/utils/api/subdistributorApi'
import { UserResponse } from '@src/utils/api/userApi'
import deepEqual from '@src/utils/deepEqual'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import useSWR from 'swr'

interface EditSubdistributorAccountFormValues {
  e_bind_number: string
  name: string
  zip_code: string
  id_type: string
  id_number: string
  area_id?: MapIdResponseType
  // user: UserResponse
}
const editableSubdistributorFields: (
  args: SubdistributorResponseType
) => EditSubdistributorAccountFormValues = ({
  e_bind_number,
  name,
  zip_code,
  id_type,
  id_number,
  area_id,
  user,
}) => ({
  e_bind_number,
  name,
  zip_code,
  id_type,
  id_number,
  area_id,
  // user: user.id,
})

export default function EditSubdistributorAccount({
  subdistributor,
  modal,
}: {
  subdistributor: SubdistributorResponseType
  modal?: () => void
}) {
  const formValuesRef = useRef({
    ...editableSubdistributorFields(subdistributor),
  })
  const [formValues, setFormValues] = useState<EditSubdistributorAccountFormValues>({
    ...editableSubdistributorFields(subdistributor),
  })

  const [mapidQuery, setMapidQuery] = useState({
    search: subdistributor?.area_id?.area_name || '',
    page: 0,
    limit: 100,
  })

  const changes = useMemo(() => {
    /**
     * Get changes based on formValuesRef
     */
    const keyChanges: string[] = []

    Object.keys(formValuesRef.current).forEach((key) => {
      const currentKey = key as keyof EditSubdistributorAccountFormValues

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
        [key]: formValues[key as keyof EditSubdistributorAccountFormValues],
      }),
      {}
    ) as Partial<EditSubdistributorAccountFormValues>
    // return changes
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
  return (
    <Paper variant="outlined">
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Edit Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Edit Subdistributor Account Details
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
        <Divider
          style={{
            marginTop: 8,
            marginBottom: 8,
          }}
        />
        <Box>
          <AestheticObjectFormRenderer
            highlight="key"
            variant="outlined"
            onChange={(e) => {
              setFormValues((prevState) => ({
                ...prevState,
                [e.target.name]: e.target.value,
              }))
            }}
            fields={formValues}
            spacing={2}
          />
          <Box>
            <Typography color="primary" component="label" variant="body2">
              Map ID
            </Typography>
            <Autocomplete
              /**
               * onChange equivalence to TextField
               */
              onInputChange={(e, inputValue) => {
                setMapidLoading(true)
                setMapidQuery((prevState) => ({
                  ...prevState,
                  search: inputValue,
                }))
              }}
              /**
               * on select of one of the options
               */
              onChange={(e, value) => {
                setFormValues((prevState) => ({
                  ...prevState,
                  area_id: value as MapIdResponseType,
                }))
                // console.log(value)
              }}
              defaultValue={subdistributor?.area_id || null}
              /**
               * equality check for selected value and options
               */
              getOptionSelected={(option, value) => option.area_name === value?.area_name}
              /**
               * render input
               */
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Area"
                  /**
                   * params are fixed, override size
                   */
                  size="small"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {mapidLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              options={mapIdOptions}
              getOptionLabel={(option) =>
                `${option.area_name}${option.parent_name ? `, ${option.parent_name}` : ''}`
              }
            />
          </Box>
        </Box>
        <Box
          style={{
            padding: 8,
            marginTop: 16,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={() => {
              // console.log('Changes', changes)
              if (subdistributor.id) {
                updateSubdistributor(subdistributor.id, formatUpdateValues(changes))
                  .then((res) => {
                    dispatch(
                      setNotification({
                        type: NotificationTypes.SUCCESS,
                        message: 'Subdistributor Account Updated',
                      })
                    )
                  })
                  .catch((err) => {
                    dispatch(
                      setNotification({
                        type: NotificationTypes.ERROR,
                        message: err.message,
                      })
                    )
                  })
              }
              // console.log(formValues)
            }}
            color="primary"
            variant="contained"
          >
            CONFIRM
          </Button>
        </Box>
      </Box>
    </Paper>
  )
}

const formatUpdateValues = (
  args: Partial<EditSubdistributorAccountFormValues>
): Partial<SubdistributorUpdateType> =>
  ({
    ...args,
    ...(args?.area_id && { area_id: args.area_id.area_id }),
  } as Partial<SubdistributorUpdateType>)
