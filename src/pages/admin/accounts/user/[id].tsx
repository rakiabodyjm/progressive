import EditUserAccount from '@src/components/pages/user/EditUserAccount'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

export default function AdminUserManage() {
  const user = useSelector(userDataSelector)
  return <EditUserAccount adminId={user?.admin_id} />
}
