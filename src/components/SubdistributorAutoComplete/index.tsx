import { CircularProgress, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'
import { searchSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { useEffect, useRef, useState } from 'react'

export default function SubdistributorAutoComplete({
  onChange,
  mutateOptions,
}: {
  onChange: (arg: SubdistributorResponseType) => void
  mutateOptions?: (arg: SubdistributorResponseType[]) => SubdistributorResponseType[]
}) {
  const [query, setQuery] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState<SubdistributorResponseType | undefined>()
  const [usersOptions, setUsersOptions] = useState<SubdistributorResponseType[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      searchSubdistributor(query)
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
        onChange(value as SubdistributorResponseType)
      }}
      defaultValue={
        (Array.isArray(usersOptions) && usersOptions.length > 0 && usersOptions[0]) || undefined
      }
      getOptionSelected={(option, value) => option.id === value.id || false}
      getOptionLabel={(option) => `${option.name}`}
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
