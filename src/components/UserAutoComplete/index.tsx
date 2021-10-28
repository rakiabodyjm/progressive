import { CircularProgress, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
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
}) {
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<UserResponse | undefined>()
  const [usersOptions, setUsersOptions] = useState<UserResponse[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      searchUser(query)
        .then((res) => {
<<<<<<< HEAD
=======
          console.log(res)
>>>>>>> jake
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
        defaultValue || undefined
      }
      getOptionSelected={(option, value) => option.id === value.id || false}
      getOptionLabel={(option) => `${option.last_name}, ${option.first_name}`}
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
