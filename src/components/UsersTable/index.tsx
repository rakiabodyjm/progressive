import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  TablePagination,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import { nanoid } from '@reduxjs/toolkit'
import userApi from '@src/utils/api/userApi'
import {
  MouseEventHandler,
  useEffect,
  useMemo,
  MouseEvent,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react'

export default function UsersTable<T extends Record<any | 'id', any>>({
  data,
  onRowClick,
  hiddenFields = [],
  setPage,
  setLimit,
  page,
  limit,
  total,
}: {
  data: T[]
  onRowClick?: (e: MouseEvent<HTMLElement>, param: T) => void
  hiddenFields?: string[] | (keyof T)[]
  setPage: Dispatch<SetStateAction<number>> | ((arg: number) => void)
  page: number
  limit: number
  total: number
  setLimit: Dispatch<SetStateAction<number>> | ((arg: number) => void)
}) {
  /**
   * get fields based off of one of the data items
   */
  const fields = useMemo(() => {
    if (data && data.length > 0) {
      const fieldExtracted = Object.keys(data[0])
      if (!hiddenFields) {
        return fieldExtracted
      }
      return fieldExtracted.filter((field) => !hiddenFields.includes(field as string & keyof T))
    }
    return null
  }, [data, hiddenFields])
  const theme: Theme = useTheme()

  return (
    <Box maxHeight="80vh" display="grid">
      <TableContainer
        component={(props) => (
          <Paper
            {...props}
            style={{ background: theme.palette.type === 'dark' ? grey['800'] : grey['200'] }}
            variant="outlined"
          />
        )}
      >
        <Table>
          <TableHead>
            <TableRow>
              {fields?.map((title) => (
                <TableCell key={title}>{userApi.formatKeyIntoReadables(title)}</TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {!data ||
              (data.length < 1 && (
                <TableRow
                  style={{
                    background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                  }}
                >
                  <TableCell
                    style={{
                      padding: theme.spacing(2),
                      textAlign: 'center',
                    }}
                  >
                    <Typography color="textSecondary" variant="h6">
                      No Data Found
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            {data.map((row) => (
              <TableRow
                onClick={(e: MouseEvent<HTMLElement>) => {
                  if (onRowClick) {
                    onRowClick(e, row)
                  }
                }}
                style={{
                  cursor: 'pointer',
                }}
                key={(row?.id as string) || nanoid()}
                hover
              >
                {Object.entries(row).map(
                  ([key, value], index) =>
                    !hiddenFields.includes(key) && (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableCell key={`${value}${index}`}>
                        {typeof value !== 'string' ? value?.toString() || '' : value}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 250, 500]}
        count={total}
        rowsPerPage={limit}
        page={page}
        onPageChange={(_, page) => {
          setPage(page)
        }}
        onRowsPerPageChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          setLimit(Number(e.target.value))
        }}
        component="div"
      />
    </Box>
  )
}
