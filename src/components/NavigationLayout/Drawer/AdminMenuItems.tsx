import { List } from '@material-ui/core'
import { AllInbox, CardGiftcard, ListAlt, PeopleAlt } from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'

export default function AdminMenuItems({ open }: { open: boolean }) {
  // const classes
  // const pogi = 'hello'
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
      title: 'Inventory',
      icon: <AllInbox />,
      url: '/admin/inventory',
    },
    {
      title: 'Transactions',
      icon: <ListAlt />,
      url: '/admin/transactions',
    },
    /**
     * caesar reload
     * HERE
     */
  ]
  return (
    <List>
      {adminLowerMenuItems.map((adminItem) => (
        <RenderListItem open={open} {...adminItem} />
      ))}
    </List>
  )
}
