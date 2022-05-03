import { Box, Typography } from '@material-ui/core'
import SimpleAutoComplete, { SimpleAutoCompleteProps } from '@src/components/SimpleAutoComplete'
import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import axios from 'axios'
import type { CaesarWalletResponse } from '@api/walletApi'

export const searchCaesarBank = (
  searchString?: string,
  additionalParams?: {
    ceasar?: CaesarWalletResponse['id']
    bank?: CaesarBank['id']
  }
) =>
  axios
    .get(`/cash-transfer/caesar-bank`, {
      ...(searchString && {
        params: {
          search: searchString,
          ...additionalParams,
        },
      }),
    })
    .then((res) => res.data.data as CaesarBank[])

const ToCaesarBankAutoComplete = ({
  filter,
  onChange,
  additionalParams,
  ...restProps
}: {
  filter?: (param: CaesarBank[]) => CaesarBank[]
  onChange: (arg: CaesarBank) => void
  additionalParams?: {
    ceasar: CaesarWalletResponse['id']
  }
} & Partial<SimpleAutoCompleteProps<CaesarBank, string | undefined>>) => (
  <SimpleAutoComplete<CaesarBank, string | undefined>
    initialQuery={undefined}
    fetcher={(params) => searchCaesarBank(params).then((res) => (filter ? filter(res) : res))}
    getOptionLabel={(option) =>
      `${option.description} - ${option.caesar?.description || ''} ${
        option?.account_number ? `- ${option.account_number}` : ''
      }`
    }
    renderOption={(option) => (
      <Box display="flex" flexDirection="column">
        <Typography display="block" variant="body2">{`${option.description}`}</Typography>
        <Typography variant="caption" color="primary">
          {option.caesar.description}{' '}
        </Typography>
        {option?.account_number && (
          <Typography variant="caption" color="textSecondary">
            {option?.account_number.slice(0, 26)}
          </Typography>
        )}
      </Box>
    )}
    getOptionSelected={(val1, val2) => val1.id === val2.id}
    querySetter={(param, input) => input}
    onChange={onChange}
    {...restProps}
  />
)

export default ToCaesarBankAutoComplete
