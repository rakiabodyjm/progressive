import AccountManagement from '@src/components/AccountManagement'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

export default function DSPRetailersPage() {
  const user = useSelector(userDataSelector)
  return (
    <div>
      <AccountManagement accountAs={user?.dsp_id} accountGet={user?.retailer_id} />
    </div>
  )
}
