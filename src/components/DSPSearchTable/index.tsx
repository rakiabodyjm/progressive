import { Box, Divider, Paper } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import UsersTable from '@src/components/UsersTable'
import { searchDsp } from '@src/utils/api/dspApi'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

export default function DSPSearchTable() {
  const [searchDspQuery, setSearchDspQuery] = useState(' ')

  const {
    data: dsps,
    error: dspsError,
    isValidating,
  } = useSWR([searchDspQuery, '/dsp-search'], searchDsp)

  useEffect(() => {
    console.log(dsps)
    console.error(dspsError)
  }, [dspsError, dsps])

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
        <Box>{dsps && <pre>{JSON.stringify(dsps, null, 2)}</pre>}</Box>
        {/** Create table here */}
        {/** https://v4.mui.com/components/tables/#table */}
        {/** Try to be as much as possible close to our original design */}
        {/** You can use UsersTable as guide */}
        {/** You can't use UsersTable fully since it requires pagination data */}
      </Paper>
    </Box>
  )
}
