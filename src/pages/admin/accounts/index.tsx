import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { UserRoles, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { DspResponseType, searchDsp } from '@src/utils/api/dspApi'
import { RetailerResponseType, searchRetailer } from '@src/utils/api/retailerApi'
import { searchSubdistributor, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import userApi, { searchUser, UserResponse } from '@src/utils/api/userApi'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import { useState, useEffect, useCallback, ChangeEvent, useRef } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useRouter } from 'next/router'
import LoadingScreen from '@src/components/LoadingScreen'
import { makeStyles } from '@material-ui/styles'
import { AddCircleOutlined } from '@material-ui/icons'
import AddAccountModal from '@components/AddAccountModal'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'

export type UserTypesAndUser = UserTypes

type EntityTypesUnion =
  | UserResponse
  | DspResponseType
  | RetailerResponseType
  | SubdistributorResponseType
  | AdminResponseType

type EntityFormatter<T> = (
  entityFormatterArg: T
) => Partial<Record<keyof T, Partial<T> | any>> & { user_id: string }
const userTypes: UserTypesAndUser[] = [...Object.values(UserRoles)].reverse() as UserTypesAndUser[]

const formatUsers: EntityFormatter<UserResponse> = ({
  id,
  first_name,
  last_name,
  phone_number,
  address1,
  address2,
  email,
  username,
  created_at,
  updated_at,
  roles,
}) => ({
  id,
  user_id: id,
  name: `${last_name}, ${first_name}`,
  phone_number,
  email,
  address1,
  accounts: (roles && roles.length > 0 && roles.join(', ').toUpperCase()) || '',
})
const formatDsp: EntityFormatter<DspResponseType> = ({
  id,
  area_id,
  dsp_code,
  e_bind_number,
  user,
}) => ({
  id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  user_id: user?.id,
  area_id:
    (area_id && Array.isArray(area_id) && area_id.map((ea) => ea.area_name).join(', ')) || '',
  dsp_code,
  e_bind_number,
})

const formatAdmin: EntityFormatter<AdminResponseType> = ({ id, name, user }) => ({
  id,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  name,
})

const formatRetailer: EntityFormatter<RetailerResponseType> = ({
  id,
  e_bind_number,
  store_name,
  subdistributor,
  dsp,
  user,
}) => ({
  id,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  store_name,
  e_bind_number,
  subdistributor_name: subdistributor?.name,
  dsp_name: dsp?.dsp_code || '',
})

const formatSubdistributor: EntityFormatter<SubdistributorResponseType> = ({
  name,
  area_id,
  user,
}) => ({
  name,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  area_id: area_id?.area_name || '',
})

const formatter = {
  admin: formatAdmin,
  dsp: formatDsp,
  retailer: formatRetailer,
  subdistributor: formatSubdistributor,
  user: formatUsers,
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {},
  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    '& .user-type-title': {
      textAlign: 'right',
    },

    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
      '& .user-type-container': {
        alignSelf: 'flex-end',
      },
    },
    [theme.breakpoints.down('sm')]: {
      alignItems: 'center',

      '& .user-type-container': {
        alignSelf: 'center',
        marginTop: 16,

        '& .user-type-title': {
          textAlign: 'center',
        },
        '& .user-type-button-group': {
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
        },
      },
    },
  },
}))
export default function AdminAccountsPage() {
  const [activeUserType, setActiveUserType] = useState<UserTypesAndUser>('user')
  const classes = useStyles()
  const formatSelector = useCallback(
    // eslint-disable-next-line func-names
    function (arg: EntityTypesUnion[]) {
      return arg.map((ea) =>
        formatter[activeUserType](
          ea as UserResponse &
            DspResponseType &
            AdminResponseType &
            RetailerResponseType &
            SubdistributorResponseType
        )
      )
    },
    [activeUserType]
  )
  const dispatch = useDispatch()
  const [users, setUsers] = useState<EntityTypesUnion[] | null>()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [addAccountModalOpen, setAddAccountModalOpen] = useState<boolean>(false)
  const router = useRouter()

  const [paginatedParams, setPaginatedParams] = useState<Paginated<EntityTypesUnion>['metadata']>({
    limit: 100,
    page: 0,
    total: 0,
    total_page: 0,
  })

  const setLimit = (param: number) => {
    setPaginatedParams((prevState) => ({
      ...prevState,
      limit: param,
    }))
  }
  const setPage = (param: number) => {
    setPaginatedParams((prevState) => ({
      ...prevState,
      page: param,
    }))
  }
  const [searchString, setSearchString] = useState('')

  useEffect(() => {
    setIsLoading(true)
    if (searchString === '') {
      axios
        .get(`${activeUserType}/`, {
          params: {
            ...paginatedParams,
          },
        })
        .then(async ({ data }: { data: Paginated<EntityTypesUnion> }) => {
          setPaginatedParams({
            ...data.metadata,
          })
          if (data.data.length < 1) {
            setUsers(null)
            return
          }
          setUsers(data.data)
        })
        .catch((err) => {
          const message = userApi.extractError(err)
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: typeof message !== 'string' ? 'Error Fetching Users' : message,
            })
          )
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      searchFunctions[activeUserType](searchString)
        .then((res) => {
          setPaginatedParams({
            limit: 100,
            page: 0,
            total_page: 0,
            total: res.length,
          })
          setSearchData(
            res as (UserResponse &
              DspResponseType &
              AdminResponseType &
              RetailerResponseType &
              SubdistributorResponseType)[]
          )
        })
        .catch((err) => {
          const message = userApi.extractError(err)
          dispatch(
            setNotification({
              type: NotificationTypes.ERROR,
              message: typeof message !== 'string' ? 'Error Fetching Users' : message,
            })
          )
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [activeUserType, searchString])

  const [searchData, setSearchData] = useState<
    (UserResponse &
      DspResponseType &
      AdminResponseType &
      RetailerResponseType &
      SubdistributorResponseType)[]
  >([])

  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()

  return (
    <Container
      className={classes.root}
      style={{
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <Box className={classes.headerContainer}>
        <Typography
          variant="h4"
          style={{
            fontWeight: 700,
          }}
          className="title"
        >
          Account Management
        </Typography>
        <div className="user-type-container">
          <Typography color="textSecondary" className="user-type-title">
            Select User Type
          </Typography>
          <Box className="user-type-button-group">
            {userTypes.map((userType: UserTypesAndUser) => (
              <Button
                variant={activeUserType === userType ? 'contained' : 'outlined'}
                key={userType}
                style={{
                  margin: 4,
                }}
                onClick={() => {
                  setActiveUserType(userType)
                }}
                color={activeUserType === userType ? 'primary' : undefined}
              >
                {userType === 'user' ? 'all' : userType}
              </Button>
            ))}
          </Box>
        </div>
      </Box>
      <Box mt={8} />
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Tooltip
          title={<Typography variant="subtitle2">Add User Account</Typography>}
          arrow
          placement="left"
        >
          <IconButton
            onClick={() => {
              setAddAccountModalOpen(true)
            }}
          >
            <AddCircleOutlined />
          </IconButton>
        </Tooltip>
      </Box>
      <Box mb={2}>
        <Paper variant="outlined">
          <Box p={2}>
            <FormLabel>Search: </FormLabel>
            <FormTextField
              name="search-retailer"
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if (timeoutRef.current) {
                  clearTimeout(timeoutRef.current)
                }
                timeoutRef.current = setTimeout(() => {
                  setSearchString(e.target.value)
                }, 1500)
              }}
            />
          </Box>
        </Paper>
      </Box>

      {!isLoading && users && (
        <UsersTable
          onRowClick={(e, rowValue) => {
            router.push({
              pathname: '/admin/accounts/[id]',
              query: {
                id: rowValue.user_id,
              },
            })
          }}
          data={searchString.length > 1 ? formatSelector(searchData) : formatSelector(users)}
          hiddenFields={['id', 'user_id']}
          limit={paginatedParams.limit}
          page={paginatedParams.page}
          total={paginatedParams.total}
          setLimit={setLimit}
          setPage={setPage}
        />
      )}
      {isLoading && (
        <Paper variant="outlined">
          <LoadingScreen
            style={{
              height: 480,
            }}
          />
        </Paper>
      )}

      {addAccountModalOpen && (
        <AddAccountModal
          open={addAccountModalOpen}
          handleClose={() => setAddAccountModalOpen(false)}
        />
      )}
    </Container>
  )
}
const searchFunctions = {
  user: (searchString: string) => searchUser(searchString),
  admin: (searchString: string) => searchUser(searchString),
  dsp: (searchString: string) => searchDsp(searchString),
  subdistributor: (searchString: string) => searchSubdistributor(searchString),
  retailer: (searchString: string) => searchRetailer(searchString),
}
