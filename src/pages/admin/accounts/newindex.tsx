import { Box, Button, Container, Menu, Paper, Theme, Tooltip, Typography } from '@material-ui/core'
import RoleBadge from '@src/components/RoleBadge'
import UserAccountTypeSelector from '@src/components/UserAccountTypeSelector'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { userDataSelector } from '@src/redux/data/userSlice'

import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useFetchOrSearchAccounts, { Entities } from '@hooks/useFetchOrSearchAccounts'
import { Paginated, PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import UsersTable from '@src/components/UsersTable'
import { LoadingScreen2 } from '@src/components/LoadingScreen'

type Entity = Entities[keyof Entities]
export default function AdminAccountsPage() {
  const [accountType, setAccountType] = useState<UserTypesAndUser>('user')
  const user = useSelector(userDataSelector)
  const [searchQuery, setSearchQuery] = useState<string | undefined>()
  const [paginationParams, setPaginationParams] = useState<PaginateFetchParameters>({
    page: 0,
    limit: 100,
  })

  const { data: entities, loading } = useFetchOrSearchAccounts(accountType, {
    mode: searchQuery ? 'search' : 'get-all',
    paginateOptions: paginationParams,
    searchString: searchQuery,
  })

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
          limit: 100,
          page: 0,
          total: fetchData?.length || 0,
          total_page: 1,
        },
      } as Paginated<Entity>
    }
    return undefined
  }, [entities])

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
          <Box my={4} />
          <UserAccountTypeSelector
            activeUser={accountType}
            onChange={(arg) => {
              setAccountType(arg)
            }}
          />

          {paginationData && (
            <UsersTable
              data={paginationData.data}
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
            />
          )}

          {loading && <LoadingScreen2 />}
        </Box>
      </Paper>
    </Container>
  )
}
