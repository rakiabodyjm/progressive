import { Box, Divider, Paper } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { DspResponseType, searchDsp } from '@src/utils/api/dspApi'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import UsersTable from '../UsersTable'

export default function DSPSearchTable({ subdistributorId }: { subdistributorId: string }) {
  const [searchDspQuery, setSearchDspQuery] = useState(' ')
  const [data, setData] = useState<DspResponseType[]>()
  const [metadata, setMetadata] = useState({
    page: 0,
    limit: 100,
  })

  useEffect(() => {
    if (!searchDspQuery) {
      setSearchDspQuery(' ')
    } else
      searchDsp(searchDspQuery, { subdistributor: subdistributorId }).then((res) => {
        setData(res)
      })
  }, [searchDspQuery, subdistributorId])

  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Paper>
            <Box p={2}>
              <FormLabel>Search DSP</FormLabel>
              <FormTextField
                name="search-dsp"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  timeoutRef.current = setTimeout(() => {
                    setSearchDspQuery(e.target.value)
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
          {searchDspQuery === null && setSearchDspQuery(' ')}
          {data && (
            <UsersTable
              data={formatDsp(data)}
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
const formatDsp = (param: DspResponseType[]) =>
  param.map(({ id, user, dsp_code, e_bind_number, area_id }) => ({
    dsp_id: id,
    user: user.first_name,
    dsp_code,
    e_bind_number,
    area_id: area_id.map((ea) => ea.area_name).join(', '),
  }))
