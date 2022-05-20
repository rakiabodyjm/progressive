import { List } from '@material-ui/core'
import {
  AccountBalance,
  AllInbox,
  ListAlt,
  LocalGroceryStore,
  Store,
  TableChart,
} from '@material-ui/icons'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'
import useIsCtOperatorOrAdmin from '@src/utils/hooks/useIsCtOperatorOrAdmin'

export default function SubMenuItems({ open }: { open: boolean }) {
  const isEligible = useIsCtOperatorOrAdmin(['ct-admin'])
  const subMenuItems = [
    {
      title: 'Summary Table',
      icon: <TableChart />,
      url: '/ct-summary',
    },
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
      {subMenuItems
        .filter((ea) => {
          if (isEligible) {
            return ea
          }
          return ea.title !== 'Summary Table'
        })
        .map((item) => (
          <RenderListItem key={item.url} open={open} {...item} />
        ))}
    </List>
  )
}
