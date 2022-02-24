import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CaesarWalletResponse, getWallet } from '../api/walletApi'

type ActiveCaesar = {
  caesar: [UserTypesAndUser, string] | undefined
  account?: [UserTypesAndUser, string]
}

export default function useGetCaesarOfUser({
  disabledAccounts,
  pickUserType,
}: {
  disabledAccounts?: UserTypesAndUser[]
  pickUserType?: UserTypesAndUser[]
}) {
  const user = useSelector(userDataSelector)
  const [data, setData] = useState<[UserTypesAndUser, string][]>([])
  const [account, setAccount] = useState<[UserTypesAndUser, string]>()

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
                  (res) =>
                    [res.account_type, res.id] as [UserTypesAndUser, CaesarWalletResponse['id']]
                )
                .catch((err) => [role, null])
            )
        ).then(
          (final) =>
            final.filter((ea) => !!ea[1]) as [UserTypesAndUser, CaesarWalletResponse['id']][]
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
