import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Theme,
  Typography,
} from '@material-ui/core'
import { grey, red } from '@material-ui/core/colors'
import { CloseOutlined } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import ModalWrapper from '@src/components/ModalWrapper'
import RequestModal from '@src/components/RequestModal'
import RoleBadge from '@src/components/RoleBadge'
import UsersTable from '@src/components/UsersTable'
import CashTransfer from '@src/pages/admin/topup'
import { userDataSelector } from '@src/redux/data/userSlice'
import {
  extractMultipleErrorFromResponse,
  formatIntoReadableDate,
  objectToURLQuery,
} from '@src/utils/api/common'
import {
  CashTransferRequestTypes,
  CashTransferResponse,
  RequestStatus,
} from '@src/utils/types/CashTransferTypes'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useSWR from 'swr'

const useStyles = makeStyles((theme: Theme) => ({
  gridContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}))

export default function RequestPage() {
  const paperHeight = 600
  const theme: Theme = useTheme()

  const user = useSelector(userDataSelector)
  const isAuthorizedForViewingBalances = useMemo(
    () => user && user.roles.some((ea) => ['ct-operator', 'ct-admin', 'admin'].includes(ea)),
    [user]
  )
  const [query, setQuery] = useState<PaginateFetchParameters & { searchQuery?: string }>({
    limit: 100,
    page: 0,
    searchQuery: undefined,
    // ...(!isAuthorizedForViewingBalances && {
    //   account_type: 'retailer',
    // }),
  })
  const setQueryState = useCallback(
    (param: keyof typeof query) => (value: typeof query[keyof typeof query]) => {
      setQuery((prev) => ({
        ...prev,
        [param]: value,
      }))
    },
    []
  )
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>()

  const classes = useStyles()

  const {
    data: pendingRequest,
    mutate: requestMutate,
    isValidating,
  } = useSWR<Paginated<CashTransferRequestTypes>>(`/request?is_declined=false`, (url) =>
    axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => {
        throw extractMultipleErrorFromResponse(err)
      })
  )
  const [paginated, setPaginated] = useState({
    limit: 100,
    page: 0,
  })

  const totalSummaryData = useMemo(
    () => [pendingRequest?.data.filter((ea) => ea.status === RequestStatus.PENDING)],
    [pendingRequest]
  )

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [rowData, setRowData] = useState<CashTransferRequestTypes>()

  return (
    <>
      <Paper variant="outlined">
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h4">Request Summary Table</Typography>
              <Typography variant="body2" color="primary">
                This section the admin can see all of the request transactions of all users
              </Typography>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row-reverse"></Box>
          <Box textAlign="end"></Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Box>
            <Grid container spacing={2} className={classes.gridContainer}>
              {/* <Grid item xs={12}>
                sm={7} md={6} lg={4} xl={2}
                <FormTextField
                  placeholder="Search"
                  name="search"
                  onChange={(e) => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                    timeoutRef.current = setTimeout(() => {
                      setQuery((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }))
                    }, 500)
                  }}
                />
              </Grid> */}
            </Grid>
            <Box pt={1}>
              <Paper style={{ padding: 16 }}>
                {pendingRequest && pendingRequest.data && !isValidating ? (
                  <UsersTable
                    data={formatSummaryTable(pendingRequest.data)}
                    page={paginated.page}
                    limit={paginated.limit}
                    setPage={(page: number) => {
                      setPaginated((prev) => ({
                        ...prev,
                        page,
                      }))
                    }}
                    setLimit={(limit: number) => {
                      setPaginated((prev) => ({
                        ...prev,
                        limit,
                      }))
                    }}
                    paperProps={{
                      style: {
                        ...(paperHeight && { height: paperHeight! - 50 }),
                      },
                    }}
                    total={pendingRequest.metadata.total}
                    hiddenFields={['id', 'deleted_at', 'created_at', 'updated_at']}
                    tableHeadProps={{
                      style: {
                        position: 'sticky',
                        top: 0,
                        background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
                      },
                    }}
                    tableCellProps={{
                      reference_number: {
                        style: {
                          width: '30%',
                        },
                      },
                    }}
                    renderCell={{
                      status: (value) => (
                        <Box display="flex" flexWrap="wrap">
                          <RoleBadge disablePopUp>{value}</RoleBadge>
                        </Box>
                      ),
                    }}
                    // renderRow={({ amount, description, as, from, to, reference_number }) => (
                    //   <>
                    //     <Box>
                    //       <Paper>
                    //         <Box p={2}>
                    //           <Typography>{amount}</Typography>
                    //         </Box>
                    //       </Paper>
                    //     </Box>
                    //   </>
                    // )}
                    onRowClick={(rowData, data) => {
                      setIsOpen(true)
                      setRowData(data)
                    }}
                  />
                ) : (
                  <LoadingScreen2 />
                )}
              </Paper>
            </Box>
          </Box>
        </Box>
      </Paper>
      {isOpen && (
        <RequestModal
          open={isOpen}
          handleClose={() => {
            setIsOpen(false)
          }}
          requestData={rowData as CashTransferRequestTypes}
          triggerRequestMutate={() => {
            requestMutate()
          }}
        />
      )}
    </>
  )
}
const formatSummaryTable = (param: CashTransferRequestTypes[]) =>
  param
    .filter((ea) => ea.status === RequestStatus.PENDING)
    .map(({ id, amount, as, caesar_bank, description, status, created_at }) => ({
      reference_number: id,
      id,
      as,
      description: description || '<No Description>',
      amount,
      requester: caesar_bank?.description || 'ERROR',
      status,
      created_at,
    }))
