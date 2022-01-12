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
  overrideTimeout,
  ...restProps
}: {
  /**
   * What to do when value is Changed
   */
  onChange: (arg: T) => void
  /**
   * if selection will be mutated
   */
  mutateOptions?: (arg: T[]) => T[]
  /**
   * Initial query parameters passed into fetcher
   */
  initialQuery: U
  /**
   * How query parameter for fetcher according to inputValue
   */
  querySetter: (arg: U, inputValue: string) => U
  /**
   * Fetcher parameter responsible for populating data into autoComplete
   */
  fetcher: (arg: U) => Promise<T[]>
  /**
   * default set value
   */
  defaultValue?: T
  /**
   * Equality check for multiple values against selected value
   */
  getOptionSelected: (arg: T, value: T) => boolean
  /**
   * Label to be rendered
   */
  getOptionLabel: (option: T) => string
  /**
   * Override timeout milliseconds
   */
  overrideTimeout?: number
  inputProps?: TextFieldProps
} & Omit<Partial<AutocompleteProps<T, undefined, undefined, undefined>>, 'onChange'>) {
  const [options, setOptions] = useState<T[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [query, setQuery] = useState(initialQuery)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const dispatch = useDispatch()
  const defaultValueRef = useRef<T | undefined>(defaultValue)

  useEffect(() => {
    setLoading(true)
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
    }, overrideTimeout || 500)
  }, [query])
  return (
    <Autocomplete
      options={options}
      onInputChange={(_, inputValue) => {
        setQuery((prevState) => querySetter(prevState, inputValue))
      }}
      onChange={(_, value) => {
        onChange(value as T)
      }}
      defaultValue={defaultValueRef?.current || undefined}
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
