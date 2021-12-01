import { Box, Divider, Paper } from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { RetailerResponseType, searchRetailer } from '@src/utils/api/retailerApi'
import { getDsp } from '@src/utils/api/dspApi'

type SubdiRetailerTableProps =
  | {
      dspId: string
      subdistributorId?: never
    }
  | {
      subdistributorId: string
      dspId?: never
    }

export default function SubdiRetailerSearchTable({
  dspId,
  subdistributorId,
}: SubdiRetailerTableProps) {
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
        dsp: dspId,
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
              data={formatRetailersForSubd(data)}
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
        {/** https://v4.mui.com/components/tables/#table */}
        {/** Try to be as much as possible close to our original design */}
        {/** You can use UsersTable as guide */}
        {/** You can't use UsersTable fully since it requires pagination data */}
      </Paper>
    </Box>
  )
}
const formatRetailersForSubd = (param: RetailerResponseType[]) =>
  param.map(({ id, store_name, e_bind_number, dsp }) => ({
    retailer_id: id,
    store_name,
    e_bind_number,
    dsp: dsp.dsp_code,
  }))
