import { Divider, Paper } from '@material-ui/core'
import AccountInventoryManagement from '@src/components/AccountInventoryManagement'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useSelector } from 'react-redux'

export default function InventoryPage() {
  const user = useSelector(userDataSelector)
  return (
    <div>
      <Paper
        style={{
          padding: 16,
        }}
      >
        {user?.admin_id && (
          <div>
            <AccountInventoryManagement accountId={user?.admin_id} />
            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
          </div>
        )}
        {user?.subdistributor_id && (
          <div>
            <AccountInventoryManagement accountId={user?.subdistributor_id} />
            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
          </div>
        )}
        {user?.dsp_id && (
          <div>
            <AccountInventoryManagement accountId={user?.dsp_id} />
            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
          </div>
        )}
        {user?.retailer_id && (
          <div>
            <AccountInventoryManagement accountId={user?.retailer_id} />
            <Divider
              style={{
                margin: '16px 0px',
              }}
            />
          </div>
        )}
        {user?.user_id && (
          <div>
            <AccountInventoryManagement accountId={user?.user_id} />
          </div>
        )}
      </Paper>
    </div>
  )
}
