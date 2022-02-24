import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { PendingTransactionResponse } from '@src/utils/api/transactionApi'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { getAllPendingTransactions } from '../../utils/api/pendingTransactionApi'
import { CaesarWalletResponse } from '../../utils/api/walletApi'
import { PaginateFetchParameters } from '../../utils/types/PaginatedEntity'

export default function useFetchPendingTransaction({
  as,
  caesar,
  action,
  paginationParams,
}: {
  as?: UserTypesAndUser | undefined
  caesar?: string
  action?: string
  paginationParams?: PaginateFetchParameters
}) {
  const { data: fetchPendingTransaction, isValidating: loading } = useSWR(
    [
      {
        ...paginationParams,
        ...(as !== 'admin' && {
          // ...(action === 'seller' &&
          //   caesar && {
          //     caesar_seller: caesar,
          //   }),
          ...(caesar && {
            caesar_buyer: caesar,
          }),
        }),
      },
    ],
    (...params) =>
      getAllPendingTransactions(...params)
        .then((res) => {
          switch (as) {
            case 'admin': {
              return {
                ...res,
                data: res.data.map((ea) => reduceForAdmin(ea)),
              }
            }
            default: {
              return {
                ...res,
                data: res.data.map((ea) => reduceForAdmin(ea)),
              }
            }
          }
        })
        .catch((err) => {
          console.log('Failed fetching pending transactions', err)
          return undefined
        }),
    {
      refreshInterval: 60000,
    }
  )

  return { fetchPendingTransaction, loading }
}

const reduceForAdmin = ({
  id,
  approved,
  quantity,
  inventory,
  caesar_buyer,
  caesar_seller,
  created_at,
  pending_purchase_id,
}: PendingTransactionResponse) => ({
  id,
  inventory,
  quantity,
  buyer: caesar_buyer.description,

  approved,

  reference_id: pending_purchase_id,
  pending_date: `${new Date(created_at).toLocaleTimeString()} - ${new Date(
    created_at
  ).toLocaleDateString()}`,
})
