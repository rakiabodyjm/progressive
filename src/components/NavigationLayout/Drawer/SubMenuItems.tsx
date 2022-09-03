import { List } from '@material-ui/core'
import { AccountBalance, AllInbox, ListAlt, LocalGroceryStore } from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'

export default function SubMenuItems({ open }: { open: boolean }) {
  const subMenuItems = [
    {
      title: 'E-Commerce',
      icon: <LocalGroceryStore />,
      url: '/ecommerce',
    },
    {
      title: 'Inventory',
      icon: <AllInbox />,
      url: '/inventory',
    },
    {
      title: 'Transactions',
      icon: <ListAlt />,
      url: '/transaction',
    },
    {
      title: 'Cash Transfer',
      icon: <AccountBalance />,
      url: '/cash-transfer',
    },
  ]
  return (
    <List>
      {subMenuItems.map((item) => (
        <RenderListItem key={item.url} open={open} {...item} />
      ))}
    </List>
  )
}
