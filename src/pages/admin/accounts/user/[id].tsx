import EditUserAccount from '@src/components/pages/user/EditUserAccount'
import { useRouter } from 'next/router'

export default function AdminUserManage() {
  const router = useRouter()
  const { query } = router
  const { id } = query
  return <EditUserAccount adminId={id as string} />
}
