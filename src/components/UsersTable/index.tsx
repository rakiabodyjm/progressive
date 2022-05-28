/* eslint-disable react/no-array-index-key */
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
  BoxProps,
  PaperProps,
  TableCellProps,
  TableHeadProps,
} from '@material-ui/core'
import { grey } from '@material-ui/core/colors'
import { useTheme } from '@material-ui/styles'
import { nanoid } from '@reduxjs/toolkit'
import { formatKeyIntoReadables } from '@src/utils/api/common'
import { useMemo, MouseEvent, Dispatch, SetStateAction, ChangeEvent } from 'react'

export default function UsersTable<T extends Record<any | 'id', any>>({
  data,
  onRowClick,
  hiddenFields = [],
  setPage,
  setLimit,
  page,
  limit,
  total,
  formatTitle,
  renderCell,
  paperProps,
  hidePagination,
  tableCellProps,
  tableHeadProps,
  renderRow,
  ...restProps
}: {
  data: T[]
  onRowClick?: (e: MouseEvent<HTMLElement>, param: T) => void
  hiddenFields?: string[] | (keyof T)[]
  setPage: Dispatch<SetStateAction<number>> | ((arg: number) => void)
  page: number
  limit: number
  total: number
  setLimit: Dispatch<SetStateAction<number>> | ((arg: number) => void)
  formatTitle?: Partial<Record<keyof T, string>>
  renderCell?: Partial<Record<keyof T, (value: T[keyof T]) => JSX.Element>>
  paperProps?: PaperProps
  hidePagination?: true
  tableCellProps?: Partial<Record<keyof T, TableCellProps>>
  tableHeadProps?: Partial<TableHeadProps>
  renderRow?: (param: T) => JSX.Element

  /**
   * Render row according to override
   * Must include cells
   */
  // renderRow?: (arg: T, DefaultRender: typeof TableRow) => JSX.Element
} & BoxProps) {
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
    <Box display="grid" {...restProps}>
      <TableContainer
        component={(props) => (
          <Paper
            {...props}
            variant="outlined"
            {...(paperProps && {
              ...paperProps,
              ...(paperProps?.style && {
                style: {
                  background: theme.palette.type === 'dark' ? grey['800'] : grey['200'],
                  ...paperProps.style,
                },
              }),
            })}
          />
        )}
      >
        <Table
          style={{
            ...(!data || (data.length < 1 && { height: '100%' })),
          }}
        >
          <TableHead {...tableHeadProps}>
            <TableRow>
              {fields?.map((title) => (
                <TableCell
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }}
                  key={title}
                >
                  {(formatTitle && formatTitle[title]) ?? formatKeyIntoReadables(title)}
                </TableCell>
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

            {data.map((row) =>
              renderRow ? (
                renderRow(row)
              ) : (
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
                  {fields?.map((ea, index) => {
                    const renderComponent = renderCell?.[ea] || undefined
                    // if (renderComponent) {
                    //   console.log('caught one ', renderComponent)
                    // }
                    const value = row[ea]
                    return (
                      // eslint-disable-next-line react/no-array-index-key
                      <TableCell
                        key={`${value}-${index}`}
                        {...(tableCellProps ? tableCellProps[ea] : {})}
                      >
                        {renderComponent ? renderComponent(value) : value?.toString() || ''}
                        {/* {typeof value !== 'string'
                          ? (renderComponent && renderComponent(value)) || value?.toString() || ''
                          : value} */}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!hidePagination && (
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
      )}
    </Box>
  )
}
