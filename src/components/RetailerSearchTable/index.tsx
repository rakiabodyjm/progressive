import { Box, Divider, Paper } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { RetailerResponseType, searchRetailer } from '@src/utils/api/retailerApi'
import UsersTable from '../UsersTable'

export default function RetailerSearchTable({
  dspId,
  subdistributorId,
}: {
  dspId: string | undefined
  subdistributorId: string | undefined
}) {
  const [searchDspRetailerQuery, setSearchDspRetailerQuery] = useState(' ')
  const [data, setData] = useState<RetailerResponseType[]>()
  const [metadata, setMetadata] = useState({
    page: 0,
    limit: 100,
  })

  useEffect(() => {
    if (!searchDspRetailerQuery) {
      setSearchDspRetailerQuery(' ')
    } else
      searchRetailer(searchDspRetailerQuery, {
        dsp: dspId as string,
        subdistributor: subdistributorId as string,
      }).then((res) => {
        setData(res)
      })
  }, [searchDspRetailerQuery, dspId, subdistributorId])
  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Paper>
            <Box p={2}>
              <FormLabel>Search Retailer</FormLabel>
              <FormTextField
                name="search-retailer"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    setSearchDspRetailerQuery(e.target.value)
                  }, 1500)
                }}
              />
            </Box>
          </Paper>
        </Box>
        <Box my={2}>
          <Divider />
        </Box>
        <Box>
          {searchDspRetailerQuery === null && setSearchDspRetailerQuery(' ')}
          {data && (
            <UsersTable
              data={formatRetailersForDsp(data)}
              limit={metadata.limit}
              page={metadata.page}
              total={data.length}
              setLimit={(limit: number) => {
                setMetadata((prevState) => ({
                  ...prevState,
                  limit,
                }))
              }}
              setPage={(page: number) => {
                setMetadata((prevState) => ({
                  ...prevState,
                  page,
                }))
              }}
            />
          )}
        </Box>
      </Paper>
    </Box>
  )
}
const formatRetailersForDsp = (param: RetailerResponseType[]) =>
  param.map(({ id, e_bind_number, store_name, subdistributor }) => ({
    retailer_id: id,
    e_bind_number,
    store_name,
    subdistributor: subdistributor?.name,
  }))
