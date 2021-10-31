import { CircularProgress, TextField } from '@material-ui/core'
import { Autocomplete, AutocompleteProps } from '@material-ui/lab'
import { searchUser, UserResponse } from '@src/utils/api/userApi'
import { useEffect, useRef, useState } from 'react'

export default function UserAutoComplete({
  onChange,
  mutateOptions,
  defaultValue,
}: {
  onChange: (arg: UserResponse) => void
  mutateOptions?: (arg: UserResponse[]) => UserResponse[]
  defaultValue?: UserResponse
} & Partial<Omit<AutocompleteProps<UserResponse, undefined, undefined, undefined>, 'onChange'>>) {
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [usersOptions, setUsersOptions] = useState<UserResponse[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  const defaultValueRef = useRef(defaultValue)
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      searchUser(query)
        .then((res) => {
          setUsersOptions(mutateOptions ? mutateOptions(res) : res)
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }, 1500)
  }, [query])
  return (
    <Autocomplete
      options={
        usersOptions && Array.isArray(usersOptions) && usersOptions.length > 0 ? usersOptions : []
      }
      onInputChange={(_, inputValue) => {
        setLoading(true)
        setQuery(inputValue)
      }}
      onChange={(_, value) => {
        // setValue(value)
        onChange(value as UserResponse)
      }}
      defaultValue={
        // (Array.isArray(usersOptions) && usersOptions.length > 0 && usersOptions[0]) || undefined
        defaultValueRef?.current || undefined
      }
      getOptionSelected={(option, value) => option.id === value.id || false}
      getOptionLabel={(option) =>
        `${option.last_name}, ${option.first_name} - ${option.id.split('-')[0]}`
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
                {loading || !usersOptions ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
