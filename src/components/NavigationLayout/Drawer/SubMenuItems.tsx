import { List } from '@material-ui/core'
import { Assignment, Receipt } from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'

export default function SubMenuItems({ open }: { open: boolean }) {
  const subMenuItems = [
    {
      title: 'Inventory',
      icon: <Assignment />,
      url: '/inventory',
    },
    {
      title: 'Transactions',
      icon: <Receipt />,
      url: '/transactions',
    },
  ]
  return (
    <List>
      {subMenuItems.map((adminItem) => (
        <RenderListItem key={adminItem.url} open={open} {...adminItem} />
      ))}
    </List>
  )
}
