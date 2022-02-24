import AccountManagement from '@src/components/AccountManagement'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

export default function SubdistributorDspPage() {
  const user = useSelector(userDataSelector)
  return (
    <div>
      <AccountManagement accountAs={user?.subdistributor_id} accountGet={user?.dsp_id} />
    </div>
  )
}
