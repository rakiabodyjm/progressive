import { userDataSelector, UserTypesWithCashTransfer } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'

const useIsCtOperatorOrAdmin = (args: UserTypesWithCashTransfer[]) => {
  const user = useSelector(userDataSelector)

  const isEligible = useMemo(() => {
    if (user) {
      return [...user.roles].some((ea) => (args || ['ct-operator', 'ct-admin']).includes(ea))
    }
    return undefined
  }, [user])
  return isEligible
}

export default useIsCtOperatorOrAdmin
