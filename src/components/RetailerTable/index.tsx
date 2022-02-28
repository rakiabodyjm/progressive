import { Box, Typography } from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import { setNotification } from '@src/redux/data/notificationSlice'
import { DspResponseType, getDsp, getRetailers as getDspRetailers } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'

import { getRetailers } from '@src/utils/api/subdistributorApi'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import { useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'

// function dynamicFetcher(key: 'subdistributor-retailers' | 'dsp-retailers') {
//   if (key === 'dsp-retailers') {
//     return (
//       dspId: string,
//       metadata: {
//         page: number
//         limit: number
//       }
//     ) => getDspRetailers(dspId, metadata)
//   }

//   return (
//     subdistributorId: string,
//     metadata: {
//       page: number
//       limit: number
//     }
//   ) =>
//     getRetailers(subdistributorId, metadata).then(async (res) => ({
//       metadata: res.metadata,
//       data: await Promise.all(formatRetailersForSubd(res.data)),
//     }))
// }

type RetailerTableProps =
  | {
      dspId: string
      subdistributorId?: never
    }
  | {
      subdistributorId: string
      dspId?: never
    }
export default function RetailerTable({ subdistributorId, dspId }: RetailerTableProps) {
  const [metadata, setMetadata] = useState({
    page: 0,
    limit: 100,
  })
  const [retailers, setRetailers] = useState<Paginated<Record<any, any>>>()

  const { data: dspRetailer, error: dspRetailerError } = useSWR(
    dspId ? [dspId, metadata, `dsp-retailers`] : null,
    (id, metadata) =>
      getDspRetailers(id, metadata).then(({ data, metadata }) => ({
        metadata,
        data: formatRetailersForDsp(data),
      }))
  )

  const { data: subdRetailer, error: subdRetailerError } = useSWR(
    subdistributorId ? [subdistributorId, metadata, `subdistributor-retailers`] : null,
    (
      subdId: string,
      meta: {
        page: number
        limit: number
      }
    ) =>
      getRetailers(subdId, meta).then(async (res) => ({
        metadata: res.metadata,
        data: await Promise.all(formatRetailersForSubd(res.data)),
      }))
  )

  useEffect(() => {
    if (dspRetailer) {
      setRetailers(dspRetailer)
    }
    if (subdRetailer) {
      setRetailers(subdRetailer)
    }
  }, [dspRetailer, subdRetailer])

  return (
    <Box
      style={{
        overflow: 'hidden',
      }}
    >
      {retailers && (
        <UsersTable
          data={retailers.data}
          limit={metadata.limit}
          page={metadata.page}
          total={retailers?.metadata.total || 0}
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
          hiddenFields={['subdistributor']}
        />
      )}
    </Box>
  )
}

const formatRetailersForSubd = (param: RetailerResponseType[]) =>
  param.map(async ({ id, store_name, user, dsp, e_bind_number }) => ({
    retailer_id: id,
    user: user.first_name,
    store_name,
    e_bind_number,
    // dsp: await getDsp(dsp.id).then((res) => res.user.first_name),
    dsp: dsp?.dsp_code,
  }))

const formatRetailersForDsp = (param: RetailerResponseType[]) =>
  param.map(({ id, e_bind_number, user, store_name, subdistributor }) => ({
    retailer_id: id,
    e_bind_number,
    user: user?.first_name,
    store_name,
    subdistributor: subdistributor?.name,
  }))
