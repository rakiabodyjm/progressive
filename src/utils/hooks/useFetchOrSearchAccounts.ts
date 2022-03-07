import { getAllRetailer, RetailerResponseType, searchRetailer } from '@src/utils/api/retailerApi'
import { DspResponseType, getAllDsp, searchDsp } from '@src/utils/api/dspApi'
import { getAllUsers, searchUser, UserResponse } from '@src/utils/api/userApi'
import { AdminResponseType, getAllAdmin, searchAdmin } from '@src/utils/api/adminApi'
import useSWR from 'swr'
import { useMemo } from 'react'
import { PaginateFetchParameters, Paginated } from '../types/PaginatedEntity'
import {
  SubdistributorResponseType,
  getAllSubdistributor,
  searchSubdistributor,
} from '../api/subdistributorApi'
import { UserTypesAndUser } from '../../pages/admin/accounts/index'

/**
 * Record of types of entities to expect
 */
export interface Entities extends Record<UserTypesAndUser, unknown> {
  admin: AdminResponseType
  user: UserResponse
  dsp: DspResponseType
  subdistributor: SubdistributorResponseType
  retailer: RetailerResponseType
}
/**
 * key of that entity
 */
type EntityKey = keyof Entities
/**
 * general type of function when using search
 */
type EntityFetcher<T> = T extends EntityKey ? (...arg: any[]) => Promise<Entities[T][]> : never
/**
 * general type of function when using paginated entity
 */
type EntityPaginatedFetcher<T> = T extends EntityKey
  ? (...arg: any[]) => Promise<Paginated<Entities[T]>>
  : never

export default function useFetchOrSearchAccounts<T extends 'search' | 'get-all'>(
  accountType: EntityKey,
  {
    mode,
    searchString,
    paginateOptions,
  }: {
    mode: T
    searchString?: T extends 'get-all' ? never : string
    paginateOptions?: T extends 'get-all' ? PaginateFetchParameters : never
  }
) {
  const container: Record<
    UserTypesAndUser,
    {
      searchAccounts: EntityFetcher<typeof accountType>
      fetchAccounts: EntityPaginatedFetcher<typeof accountType>
    }
  > = {
    admin: {
      searchAccounts: searchAdmin,
      fetchAccounts: getAllAdmin,
    },

    dsp: {
      searchAccounts: searchDsp,
      fetchAccounts: getAllDsp,
    },

    retailer: {
      searchAccounts: searchRetailer,
      fetchAccounts: getAllRetailer,
    },

    subdistributor: {
      searchAccounts: searchSubdistributor,
      fetchAccounts: getAllSubdistributor,
    },

    user: {
      searchAccounts: searchUser,
      fetchAccounts: getAllUsers,
    },
  }
  const containerToUse = container[accountType]
  const parameterToUse = mode === 'search' ? searchString : paginateOptions

  const functionToUse =
    mode === 'search' ? containerToUse.searchAccounts : containerToUse.fetchAccounts

  const mutateKey = useMemo(() => [accountType, parameterToUse], [parameterToUse, accountType])

  const {
    data,
    error,
    isValidating: loading,
  } = useSWR<Entities[typeof accountType][] | Paginated<Entities[typeof accountType]>>(
    [accountType, parameterToUse],
    (accountTypeUsed, ...parameters) => functionToUse(parameters)
  )

  return { data, error, loading, mutateKey }
}
