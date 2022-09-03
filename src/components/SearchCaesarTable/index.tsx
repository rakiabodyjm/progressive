import { Box, Paper } from '@material-ui/core'
import { CaesarWalletResponse, getAllWallet, searchWallet } from '@src/utils/api/walletApi'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { UserTypes } from '@src/redux/data/userSlice'
import FormLabel from '../FormLabel'
import FormTextField from '../FormTextField'
import UsersTable from '../UsersTable'

type SearchCaesarParams = PaginateFetchParameters & {
  searchQuery: string | undefined
}
type GetAllWalletParams = PaginateFetchParameters & {
  account_type?: UserTypes
}
type CaesarMetadata = {
  total_page: number
  page: number
  limit: number
  total: number
}

export default function SearchCaesarTable({
  buttonTrigger,
  customWalletFormat,
  onRowClick,
}: {
  buttonTrigger: number
  customWalletFormat?: (parameter: Partial<CaesarWalletResponse>[]) => void
  onRowClick?: (e: MouseEvent<HTMLElement>, values: unknown) => void
}) {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const dispatchError = useErrorNotification()
  const [searchCaesarQuery, setSearchCaesarQuery] = useState<SearchCaesarParams>({
    searchQuery: '',
  })
  const [getAllCaesarParams, setGetAllCaesarParams] = useState<GetAllWalletParams>({
    page: 0,
    limit: 100,
  })

  const [metadata, setMetaData] = useState<CaesarMetadata>({
    total_page: 0,
    page: 0,
    limit: 0,
    total: 0,
  })
  const [caesarData, setCaesarData] = useState<CaesarWalletResponse[]>([])
  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()
  const paperHeight = 400

  useEffect(() => {
    setIsLoading(true)
    if (searchCaesarQuery.searchQuery === '') {
      getAllWallet(getAllCaesarParams)
        .then((res) => {
          setCaesarData(res.data)
          setMetaData(res.metadata)
        })
        .catch((err: string[]) => {
          err.forEach((ea) => {
            dispatchError(ea)
          })
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      searchWallet(searchCaesarQuery)
        .then((res) => {
          setCaesarData(res.data)
          setMetaData(res.metadata)
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
  }, [searchCaesarQuery, dispatchError, buttonTrigger, getAllCaesarParams])

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
        <Box p={2} py={0}>
          {!isLoading && caesarData && (
            <UsersTable
              data={
                (customWalletFormat && customWalletFormat(caesarData)) ||
                formatWalletData(caesarData)
              }
              limit={metadata.limit}
              page={metadata.page}
              total={metadata.total}
              setLimit={(limit: number) => {
                if (searchCaesarQuery.searchQuery === '') {
                  setGetAllCaesarParams((prevState) => ({
                    ...prevState,
                    limit,
                  }))
                } else {
                  setSearchCaesarQuery((prevState) => ({
                    ...prevState,
                    limit,
                  }))
                }
              }}
              setPage={(page: number) => {
                if (searchCaesarQuery.searchQuery === '') {
                  setGetAllCaesarParams((prevState) => ({
                    ...prevState,
                    page,
                  }))
                } else {
                  setSearchCaesarQuery((prevState) => ({
                    ...prevState,
                    page,
                  }))
                }
              }}
              paperProps={{
                style: {
                  ...(paperHeight && { height: paperHeight! - 50 }),
                },
              }}
              {...(onRowClick && {
                onRowClick,
              })}
            />
          )}
          {isLoading && (
            <Paper variant="outlined">
              <LoadingScreen2
                containerProps={{
                  minHeight: 400,
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
