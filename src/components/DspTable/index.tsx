import { Box, Typography } from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import { DspResponseType } from '@src/utils/api/dspApi'
import { getDsps } from '@src/utils/api/subdistributorApi'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function DspTable({ subdistributorId }: { subdistributorId: string }) {
  const [metadata, setMetadata] = useState({
    page: 0,
    limit: 100,
  })

  const { data: dsps, error: dspsError } = useSWR(
    [subdistributorId, metadata, 'subdistributor-dsps'],
    getDsps
  )

  return (
    <div>
      {dsps && (
        <UsersTable
          data={formatDsp(dsps?.data)}
          limit={metadata.limit}
          page={metadata.page}
          total={dsps.metadata.total}
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
    </div>
  )
}

const formatDsp = (param: DspResponseType[]) =>
  param.map(({ id, user, dsp_code, e_bind_number, area_id }) => ({
    dsp_id: id,
    user: user.first_name,
    dsp_code,
    e_bind_number,
    area_id: area_id.map((ea) => ea.area_name).join(', '),
  }))
