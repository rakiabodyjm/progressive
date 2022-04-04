import SimpleAutoComplete, { SimpleAutoCompleteProps } from '@src/components/SimpleAutoComplete'
import SimpleMultipleAutoComplete from '@src/components/SimpleMultipleAutoComplete'
import { CaesarWalletResponse, searchWalletV2 } from '@src/utils/api/walletApi'
import { useEffect } from 'react'

const ToCaesarAutoComplete = ({
  onChange,
  ...restProps
}: {
  onChange: (param: CaesarWalletResponse) => void
} & Partial<SimpleAutoCompleteProps<CaesarWalletResponse, string | undefined>>) => (
  <>
    <SimpleAutoComplete<CaesarWalletResponse, string | undefined>
      {...restProps}
      initialQuery={undefined}
      querySetter={(_, inputValue) => {
        console.log('inputValue', inputValue, typeof inputValue)
        return inputValue
      }}
      fetcher={(params) =>
        searchWalletV2({
          page: 0,
          limit: 100,
          searchQuery: params && params?.length > 0 ? params : undefined,
        })
          .then((res) => {
            console.log('res', res.data)
            return res.data
          })
          .catch((err) => {
            console.log('error', err)
            return []
          })
      }
      onChange={onChange}
      getOptionLabel={(option) => option.description}
      getOptionSelected={(val1, val2) => val1.id === val2.id}
    />
  </>
)

export default ToCaesarAutoComplete
