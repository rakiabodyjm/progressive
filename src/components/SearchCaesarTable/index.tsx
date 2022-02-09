import { Box, Paper } from '@material-ui/core'
import {
  CaesarWalletResponse,
  getWallet,
  getWalletById,
  searchWallet,
} from '@src/utils/api/walletApi'
import LoadingScreen from '@src/components/LoadingScreen'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import FormLabel from '../FormLabel'
import FormTextField from '../FormTextField'
import UsersTable from '../UsersTable'

type SearchCaesarParams = PaginateFetchParameters & {
  searchQuery: string
}
type CaesarMetadata = {
  total_page: number
  page: number
  limit: number
  total: number
}

export default function SearchCaesarTable() {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatchError = useErrorNotification()
  const [searchCaesarQuery, setSearchCaesarQuery] = useState<SearchCaesarParams>({
    searchQuery: '',
  })
  const [metadata, setMetaData] = useState<CaesarMetadata>({
    total_page: 0,
    page: 0,
    limit: 0,
    total: 0,
  })
  const [caesarData, setCaesarData] = useState<CaesarWalletResponse[]>([])
  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()
  useEffect(() => {
    setIsLoading(true)
    if (!searchCaesarQuery) {
      setSearchCaesarQuery({
        searchQuery: '',
      })
    } else {
      searchWallet(searchCaesarQuery)
        .then((res) => {
          setCaesarData(res.data)
          console.log(res)
        })
        .catch((err: string[]) => {
          err.forEach((ea) => {
            dispatchError(ea)
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [dispatchError, searchCaesarQuery])

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <FormLabel>Search Caesar Wallet</FormLabel>
          <FormTextField
            name="search-caesar"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
              timeoutRef.current = setTimeout(() => {
                setSearchCaesarQuery({
                  searchQuery: e.target.value,
                })
              }, 1500)
            }}
          />
        </Box>
        <Box p={2}>
          {!isLoading && caesarData && (
            <UsersTable
              data={formatWalletData(caesarData)}
              limit={metadata.limit}
              page={metadata.page}
              total={metadata.total}
              setLimit={(limit: number) => {
                setCaesarData((prevState) => ({
                  ...prevState,
                  limit,
                }))
              }}
              setPage={(page: number) => {
                setCaesarData((prevState) => ({
                  ...prevState,
                  page,
                }))
              }}
            />
          )}
          {isLoading && (
            <Paper variant="outlined">
              <LoadingScreen
                style={{
                  height: 480,
                }}
              />
            </Paper>
          )}
        </Box>
      </Paper>
    </Box>
  )
}
const formatWalletData = (param: CaesarWalletResponse[]) =>
  param.map(({ description, data }) => ({
    description,
    caesar_coin: data?.caesar_coin,
    peso: data?.peso,
    dollar: data?.dollar,
  }))
