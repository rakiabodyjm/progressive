import { Box, Button, ButtonGroup, Container, Paper, Theme, Typography } from '@material-ui/core'
import UsersTable from '@src/components/UsersTable'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { UserRoles, UserTypes } from '@src/redux/data/userSlice'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { DspResponseType } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { getRetailerCount, SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import userApi, { UserResponse } from '@src/utils/api/userApi'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { useMemo, useState, useEffect, useCallback, MouseEvent } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { useRouter } from 'next/router'
import LoadingScreen from '@src/components/LoadingScreen'
import { makeStyles } from '@material-ui/styles'
export type UserTypesAndUser = UserTypes | 'user'

type EntityTypesUnion =
  | UserResponse
  | DspResponseType
  | RetailerResponseType
  | SubdistributorResponseType
  | AdminResponseType

type EntityFormatter<T> = (
  entityFormatterArg: T
) => Partial<Record<keyof T, Partial<T> | any>> & { user_id: string }
const userTypes: UserTypesAndUser[] = [
  ...Object.values(UserRoles),
  'user',
].reverse() as UserTypesAndUser[]

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
  id_type,
  id_number,
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
  // dsp,
  // retailer,
  area_id,
  user,
}) => ({
  name,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  area_id: area_id?.area_name || '',
  // retailers: retailer?.length || 0,
  // dsps: dsp?.length || 0,
})

const formatter = {
  admin: formatAdmin,
  dsp: formatDsp,
  retailer: formatRetailer,
  subdistributor: formatSubdistributor,
  user: formatUsers,
}

// const fetcher: Record<UserTypesAndUser, (params) => any>{
//   admin,
//   dsp,
//   retailer,
//   subdistributor,
//   user,
// }
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

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(`${activeUserType}/`, {
        params: {
          ...paginatedParams,
        },
      })
      .then(async ({ data }: { data: Paginated<EntityTypesUnion> }) => {
        setIsLoading(false)
        setPaginatedParams({
          ...data.metadata,
        })
        if (data.data.length < 1) {
          setUsers(null)
          return
        }

        /**
         * if Subdistributor, show number of retailers
         */

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
  }, [activeUserType, paginatedParams.page, paginatedParams.limit])

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
          variant="h3"
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
          {/* <ButtonGroup disableElevation variant="outlined"> */}
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
          data={formatSelector(users)}
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
    </Container>
  )
}
