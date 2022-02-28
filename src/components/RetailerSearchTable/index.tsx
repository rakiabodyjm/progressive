import { Box, Divider, Paper } from '@material-ui/core'
import router from 'next/router'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { RetailerResponseType, searchRetailer } from '@src/utils/api/retailerApi'
import UsersTable from '../UsersTable'

type SearchRetailerTableProps =
  | {
      dspId: string
      subdistributorId?: never
      role?: string
    }
  | {
      subdistributorId: string
      dspId?: never
      role?: string
    }
  | {
      subdistributorId: string
      dspId: string
      role?: string
    }

export default function RetailerSearchTable({
  dspId,
  subdistributorId,
  role,
}: SearchRetailerTableProps) {
  const [searchDspRetailerQuery, setSearchDspRetailerQuery] = useState(' ')
  const [data, setData] = useState<RetailerResponseType[]>()
  const [metadata, setMetadata] = useState({
    page: 0,
    limit: 100,
  })

  useEffect(() => {
    if (!searchDspRetailerQuery) {
      setSearchDspRetailerQuery(' ')
    } else if (subdistributorId && dspId) {
      searchRetailer(searchDspRetailerQuery, {
        dsp: dspId as string,
        subdistributor: subdistributorId as string,
      }).then((res) => {
        setData(res)
      })
    } else if (!dspId && subdistributorId) {
      searchRetailer(searchDspRetailerQuery, {
        dsp: dspId,
        subdistributor: subdistributorId,
      }).then((res) => {
        setData(res)
      })
    }
  }, [searchDspRetailerQuery, dspId, subdistributorId])
  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()

  return (
    <Box>
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
        <Box p={2}>
          {searchDspRetailerQuery === null && setSearchDspRetailerQuery(' ')}
          {data &&
            (role === 'dsp' || role === null ? (
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
                onRowClick={(e, rowValue) => {
                  router.push({
                    pathname: '/dsp/retailer/[id]',
                    query: {
                      id: rowValue.retailer_id,
                    },
                  })
                }}
                setPage={(page: number) => {
                  setMetadata((prevState) => ({
                    ...prevState,
                    page,
                  }))
                }}
              />
            ) : (
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
                onRowClick={(e, rowValue) => {
                  router.push({
                    pathname: '/subdistributor/retailer/[id]',
                    query: {
                      id: rowValue.retailer_id,
                    },
                  })
                }}
                setPage={(page: number) => {
                  setMetadata((prevState) => ({
                    ...prevState,
                    page,
                  }))
                }}
              />
            ))}
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
const formatRetailersForSubd = (param: RetailerResponseType[]) =>
  param.map(({ id, store_name, e_bind_number, dsp }) => ({
    retailer_id: id,
    store_name,
    e_bind_number,
    dsp: dsp?.dsp_code,
  }))
