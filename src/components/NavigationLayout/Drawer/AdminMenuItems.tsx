import { List } from '@material-ui/core'
import {
  AllInbox,
  CardGiftcard,
  ListAlt,
  PeopleAlt,
  AccountBalanceWallet,
} from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'

export default function AdminMenuItems({ open }: { open: boolean }) {
  const adminLowerMenuItems = [
    {
      title: 'Users',
      icon: <PeopleAlt />,
      url: '/admin/accounts',
    },
    {
      title: 'Asset',
      icon: <CardGiftcard />,
      url: '/admin/assets',
    },

    {
      title: 'Cash Reload',
      icon: <AccountBalanceWallet />,
      url: '/admin/topup',
    },
  ]
  return (
    <List>
      {adminLowerMenuItems.map((adminItem) => (
        <RenderListItem key={adminItem.url} open={open} {...adminItem} />
      ))}
    </List>
  )
}
