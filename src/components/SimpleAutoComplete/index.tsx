import { CircularProgress, TextField, TextFieldProps } from '@material-ui/core'
import { Autocomplete, AutocompleteProps } from '@material-ui/lab'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function SimpleAutoComplete<T, U>({
  onChange,
  mutateOptions,
  fetcher,
  querySetter,
  initialQuery,
  defaultValue,
  getOptionSelected,
  getOptionLabel,
  inputProps,
  ...restProps
}: {
  onChange: (arg: T) => void
  mutateOptions?: (arg: T[]) => T[]
  initialQuery: U
  querySetter: (arg: U, inputValue: string) => U
  fetcher: (arg: U) => Promise<T[]>
  defaultValue?: T
  getOptionSelected: (arg: T, value: T) => boolean
  getOptionLabel: (option: T) => string
  inputProps?: TextFieldProps
} & Omit<Partial<AutocompleteProps<T, undefined, undefined, undefined>>, 'onChange'>) {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [query, setQuery] = useState(initialQuery)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const dispatch = useDispatch()
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      fetcher(query)
        .then((res) => {
          setOptions(mutateOptions ? mutateOptions(res) : res)
        })
        .catch((err) => {
          console.error(err)
          extractMultipleErrorFromResponse(err).forEach((error) => {
            dispatch(
              setNotification({
                type: NotificationTypes.ERROR,
                message: error,
              })
            )
          })
        })
        .finally(() => {
          setLoading(false)
        })
    })
  }, [query])
  return (
    <Autocomplete
      options={options}
      onInputChange={(_, inputValue) => {
        setLoading(true)
        setQuery((prevState) => querySetter(prevState, inputValue))
      }}
      onChange={(_, value) => {
        onChange(value as T)
      }}
      defaultValue={defaultValue || undefined}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading || !options ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          {...inputProps}
        />
      )}
      {...restProps}
    />
  )
}
