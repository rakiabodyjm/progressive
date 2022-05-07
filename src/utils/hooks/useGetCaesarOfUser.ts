import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { CaesarWalletResponse, getWallet } from '../api/walletApi'

type ActiveCaesar = {
  caesar: [UserTypes, string] | undefined
  account?: [UserTypes, string]
}
type TelcoUsers = 'user' | 'admin' | 'subdistributor' | 'dsp' | 'retailer'

export default function useGetCaesarOfUser(options?: {
  disabledAccounts?: UserTypes[]
  pickUserType?: UserTypes[]
}) {
  const disabledAccounts = useMemo(() => options && options?.disabledAccounts, [options])
  const pickUserType = useMemo(() => options && options?.pickUserType, [options])
  const user = useSelector(userDataSelector)
  const [data, setData] = useState<[UserTypes, string][]>([])
  const [account, setAccount] = useState<[UserTypes, string]>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (user && user.roles && user?.roles?.length > 0) {
      /**
       * verify if caeasar exists for each
       */
      const getWallets = () =>
        Promise.all(
          [...user.roles]
            .filter((ea) => !['ct-operator', 'ct-admin'].includes(ea))
            /**
             * disable users for now
             */
            .filter((ea) =>
              // eslint-disable-next-line no-nested-ternary
              disabledAccounts
                ? !disabledAccounts.includes(ea as TelcoUsers)
                : pickUserType
                ? pickUserType.includes(ea as TelcoUsers)
                : true
            )
            .map((role) =>
              getWallet({
                [role]: user[`${role as TelcoUsers}_id`],
              })
                .then(
                  (res) => [res.account_type, res.id] as [UserTypes, CaesarWalletResponse['id']]
                )
                .catch((err) => [role, null])
            )
        ).then(
          (final) => final.filter((ea) => !!ea[1]) as [UserTypes, CaesarWalletResponse['id']][]
        )

      setLoading(true)
      getWallets()
        .then((res) => {
          setData(res)
          setAccount([res[0][0], user[`${res[0][0]}_id`] as string])
        })
        .catch((err) => {
          console.log('No Caesars for', err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [disabledAccounts, pickUserType, user])

  return { data, account, loading }
}
