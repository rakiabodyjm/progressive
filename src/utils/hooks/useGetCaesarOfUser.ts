import { userDataSelector, UserTypes } from '@src/redux/data/userSlice'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CaesarWalletResponse, getWallet } from '../api/walletApi'

type ActiveCaesar = {
  caesar: [UserTypes, string] | undefined
  account?: [UserTypes, string]
}

export default function useGetCaesarOfUser({
  disabledAccounts,
  pickUserType,
}: {
  disabledAccounts?: UserTypes[]
  pickUserType?: UserTypes[]
}) {
  const user = useSelector(userDataSelector)
  const [data, setData] = useState<[UserTypes, string][]>([])
  const [account, setAccount] = useState<[UserTypes, string]>()

  useEffect(() => {
    if (user && user.roles && user?.roles?.length > 0) {
      /**
       * verify if caeasar exists for each
       */
      const getWallets = () =>
        Promise.all(
          [...user.roles]
            /**
             * disable users for now
             */
            .filter((ea) =>
              // eslint-disable-next-line no-nested-ternary
              disabledAccounts
                ? !disabledAccounts.includes(ea)
                : pickUserType
                ? pickUserType.includes(ea)
                : true
            )
            .map((role) =>
              getWallet({
                [role]: user[`${role}_id`],
              })
                .then(
                  (res) => [res.account_type, res.id] as [UserTypes, CaesarWalletResponse['id']]
                )
                .catch((err) => [role, null])
            )
        ).then(
          (final) => final.filter((ea) => !!ea[1]) as [UserTypes, CaesarWalletResponse['id']][]
        )
      getWallets()
        .then((res) => {
          setData(res)
          setAccount([res[0][0], user[`${res[0][0]}_id`] as string])
        })
        .catch((err) => {
          console.log('No Caesars for', err)
        })
    }
  }, [disabledAccounts, pickUserType, user])

  return { data, account }
}
