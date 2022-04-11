import { Box, Typography } from '@material-ui/core'
import SimpleAutoComplete, { SimpleAutoCompleteProps } from '@src/components/SimpleAutoComplete'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'

const searchCaesarBank = (searchString?: string) =>
  axios
    .get(`/cash-transfer/caesar-bank`, {
      ...(searchString && {
        params: {
          search: searchString,
        },
      }),
    })
    .then((res) => res.data.data as CaesarBank[])

const ToCaesarBankAutoComplete = ({
  filter,
  onChange,
  ...restProps
}: {
  filter?: (param: CaesarBank[]) => CaesarBank[]
  onChange: (arg: CaesarBank) => void
} & Partial<SimpleAutoCompleteProps<CaesarBank, string | undefined>>) => (
  <SimpleAutoComplete<CaesarBank, string | undefined>
    initialQuery={undefined}
    fetcher={(params) => searchCaesarBank(params).then((res) => (filter ? filter(res) : res))}
    getOptionLabel={(option) => `${option.description} - ${option.caesar.description}`}
    renderOption={(option) => (
      <Box display="flex" flexDirection="column">
        <Typography display="block" variant="body2">{`${option.description}`}</Typography>
        <Typography variant="caption" color="primary">
          {option.caesar.description}{' '}
        </Typography>
      </Box>
    )}
    getOptionSelected={(val1, val2) => val1.id === val2.id}
    querySetter={(param, input) => input}
    onChange={onChange}
    {...restProps}
  />
)

export default ToCaesarBankAutoComplete
