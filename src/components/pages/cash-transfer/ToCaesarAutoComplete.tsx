import SimpleAutoComplete, { SimpleAutoCompleteProps } from '@src/components/SimpleAutoComplete'
import { CaesarWalletResponse, searchWalletV2 } from '@src/utils/api/walletApi'
import deepEqual from '@src/utils/deepEqual'
import { memo } from 'react'

const ToCaesarAutoComplete = memo(
  function ToCaesarAutoCompleteOriginal({
    onChange,
    filter,
    ...restProps
  }: {
    onChange: (param: CaesarWalletResponse) => void
    filter?: (arg: CaesarWalletResponse[]) => CaesarWalletResponse[]
  } & Partial<SimpleAutoCompleteProps<CaesarWalletResponse, string | undefined>>) {
    return (
      <>
        <SimpleAutoComplete<CaesarWalletResponse, string | undefined>
          {...restProps}
          initialQuery={undefined}
          querySetter={(_, inputValue) => inputValue}
          fetcher={(params) =>
            searchWalletV2({
              page: 0,
              limit: 100,
              searchQuery: params && params?.length > 0 ? params : undefined,
            })
              .then((res) => (filter ? filter(res.data) : res.data))
              .catch((err) => [])
          }
          onChange={onChange}
          getOptionLabel={(option) => option.description}
          getOptionSelected={(val1, val2) => val1.id === val2.id}
        />
      </>
    )
  },
  (prevProps, nextProps) => deepEqual(prevProps, nextProps)
)

export default ToCaesarAutoComplete
