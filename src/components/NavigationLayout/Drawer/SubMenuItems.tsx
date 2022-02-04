import { List } from '@material-ui/core'
import { AllInbox, ListAlt } from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'

export default function SubMenuItems({ open }: { open: boolean }) {
  const subMenuItems = [
    {
      title: 'Inventory',
      icon: <AllInbox />,
      url: '/inventory',
    },
    {
      title: 'Transactions',
      icon: <ListAlt />,
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
