import AccountManagement from '@src/components/AccountManagement'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

export default function SubdistributorRetailersPage() {
  const user = useSelector(userDataSelector)
  return (
    <div>
      <AccountManagement
        accountAs={user?.subdistributor_id}
        accountGet={user?.retailer_id}
        accountRole="retailer"
      />
    </div>
  )
}
