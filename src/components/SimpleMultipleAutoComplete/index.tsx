import { Chip, CircularProgress, TextField } from '@material-ui/core'
import { Autocomplete, AutocompleteProps } from '@material-ui/lab'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'

export default function SimpleMultipleAutoComplete<T, U>({
  onChange,
  mutateOptions,
  fetcher,
  querySetter,
  initialQuery,
  defaultValue,
  getOptionSelected,
  getOptionLabel,
  tagLabel,
  overrideTimeout,
  ...restProps
}: {
  onChange: (arg: T[]) => void
  mutateOptions?: (arg: T[]) => T[]
  initialQuery: U
  querySetter: (arg: U, inputValue: string) => U
  fetcher: (arg: U) => Promise<T[]>
  defaultValue?: T
  getOptionSelected: (arg: T, value: T) => boolean
  getOptionLabel: (option: T) => string
  tagLabel: (option: T) => string
  overrideTimeout?: number
} & Omit<Partial<AutocompleteProps<T, true, undefined, undefined>>, 'onChange'>) {
  const [options, setOptions] = useState<T[]>([])
  const [value, setValue] = useState<T[]>([])
  const [map, setMap] = useState<T[]>([])
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
          setOptions(mutateOptions ? mutateOptions(res) : [...value, ...res])
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
  }, [query, value, overrideTimeout])

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <Autocomplete
      multiple
      options={options}
      onInputChange={(_, inputValue) => {
        setLoading(true)
        setQuery((prevState) => querySetter(prevState, inputValue))
      }}
      onChange={(_, value) => {
        setValue(() => [...value])
        // onChange(value as unknown as T)
      }}
      value={value}
      //   defaultValue={defaultValue || undefined}
      getOptionSelected={getOptionSelected}
      getOptionLabel={getOptionLabel}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip
            label={tagLabel(option)}
            {...getTagProps({ index })}
            // disabled={fixedOptions.indexOf(option) !== -1}
          />
        ))
      }
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
        />
      )}
      {...restProps}
    />
  )
}
