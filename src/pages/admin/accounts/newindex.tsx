import { Box, Button, Container, Menu, Paper, Theme, Tooltip, Typography } from '@material-ui/core'
import RoleBadge from '@src/components/RoleBadge'
import UserAccountTypeSelector from '@src/components/UserAccountTypeSelector'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { userDataSelector } from '@src/redux/data/userSlice'

import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import useFetchOrSearchAccounts, { Entities } from '@hooks/useFetchOrSearchAccounts'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import UsersTable from '@src/components/UsersTable'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import { IS_ISO31661_ALPHA_2 } from 'class-validator'
import { DspResponseType } from '@src/utils/api/dspApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { UserResponse } from '@src/utils/api/userApi'
import { useRouter } from 'next/router'
import AddUserModal from '@src/components/AddAccountModal/AddUserModal'
import { useSWRConfig } from 'swr'

type Entity = Entities[keyof Entities]

type EntityTypesUnion =
  | UserResponse
  | DspResponseType
  | RetailerResponseType
  | SubdistributorResponseType
  | AdminResponseType

export default function AdminAccountsPage() {
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const [accountType, setAccountType] = useState<UserTypesAndUser>('user')
  const user = useSelector(userDataSelector)
  const [searchQuery, setSearchQuery] = useState<string | undefined>()
  const [paginationParams, setPaginationParams] = useState<PaginateFetchParameters>({
    page: 0,
    limit: 100,
  })

  const {
    data: entities,
    loading,
    mutateKey,
  } = useFetchOrSearchAccounts(accountType, {
    mode: searchQuery ? 'search' : 'get-all',
    paginateOptions: paginationParams,
    searchString: searchQuery,
  })
  const mutateValue = useCallback(() => {
    mutate(mutateKey)
  }, [mutate, mutateKey])

  const paginationData = useMemo(() => {
    if (entities) {
      let fetchData: Paginated<Entity> | Entity[]

      fetchData = entities as Paginated<Entity>
      if (fetchData?.data) {
        return fetchData
      }
      fetchData = entities as Entity[]

      return {
        data: entities,
        metadata: {
          limit: paginationParams.limit,
          page: paginationParams.page,
          total: fetchData?.length || 0,
          total_page: 1,
        },
      } as Paginated<Entity>
    }
    return undefined
  }, [entities, paginationParams.limit, paginationParams.page])

  const timeoutRef = useRef<undefined | ReturnType<typeof setTimeout>>()

  const formatSelector = useCallback(
    // eslint-disable-next-line func-names
    function (arg: Entities[typeof accountType][]) {
      return arg.map((ea) => {
        const functionToUse = formatter[accountType]
        // @ts-ignore
        return functionToUse(ea)
        // formatter[accountType](ea as Entities[typeof accountType])
      })
    },
    [accountType]
  )

  return (
    <Container maxWidth="lg" disableGutters>
      <Paper variant="outlined">
        <Box p={2}>
          <Box>
            <Box>
              <RoleBadge display="block" uppercase>
                Admin
              </RoleBadge>
              <Typography color="textSecondary" noWrap variant="h6">
                {user?.first_name}
              </Typography>
            </Box>
            <Typography variant="h4">Account Management</Typography>
            <Typography variant="body1" color="primary">
              Create Account Types or Link User Accounts to Subdistributor | DSP | Retailer
            </Typography>
          </Box>
          <Box mb={2} display="flex" justifyContent="flex-end">
            <AddUserModal mutateValue={mutateValue} />
          </Box>

          <Box my={4} />
          <UserAccountTypeSelector
            activeUser={accountType}
            onChange={(arg) => {
              setAccountType(arg)
            }}
          />
          <Paper
            style={{
              marginTop: 5,
              marginBottom: 5,
            }}
          >
            <Box mb={2}>
              <Box p={2}>
                <FormLabel>Search: </FormLabel>
                <FormTextField
                  name="search-retailer"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (timeoutRef.current) {
                      clearTimeout(timeoutRef.current)
                    }
                    timeoutRef.current = setTimeout(() => {
                      setSearchQuery(e.target.value)
                    }, 1500)
                  }}
                />
              </Box>
            </Box>
          </Paper>

          {paginationData && (
            <UsersTable
              data={formatSelector(paginationData.data)}
              limit={paginationData.metadata.limit}
              page={paginationData.metadata.page}
              total={paginationData.metadata.total}
              setLimit={(limit: number) => {
                setPaginationParams((prevState) => ({
                  ...prevState,
                  limit,
                }))
              }}
              setPage={(page: number) => {
                setPaginationParams((prev) => ({
                  ...prev,
                  page,
                }))
              }}
              hiddenFields={['user_id']}
              onRowClick={(e, rowValue) => {
                router.push({
                  pathname: '/admin/accounts/[id]',
                  query: {
                    id: rowValue.user_id,
                  },
                })
              }}
            />
          )}

          {loading && <LoadingScreen2 />}
        </Box>
      </Paper>
    </Container>
  )
}
const formatUsers = ({
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
}: UserResponse) => ({
  id,
  user_id: id,
  name: `${last_name}, ${first_name}`,
  phone_number,
  email,
  address: address1,
  accounts: (roles && roles.length > 0 && roles.join(', ').toUpperCase()) || '',
})
const formatDsp = ({ id, area_id, dsp_code, e_bind_number, user }: DspResponseType) => ({
  id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  user_id: user?.id,
  area_id:
    (area_id && Array.isArray(area_id) && area_id.map((ea) => ea.area_name).join(', ')) || '',
  dsp_code,
  e_bind_number,
})

const formatAdmin = ({ id, name, user }: AdminResponseType) => ({
  id,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  name,
})

const formatRetailer = ({
  id,
  e_bind_number,
  store_name,
  subdistributor,
  dsp,
  user,
}: RetailerResponseType) => ({
  id,
  user_id: user?.id,
  user: user ? `${user.last_name}, ${user.first_name}` : '',
  store_name,
  e_bind_number,
  subdistributor_name: subdistributor?.name,
  dsp_name: dsp?.dsp_code || '',
})

const formatSubdistributor = ({ name, area_id, user }: SubdistributorResponseType) => ({
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
