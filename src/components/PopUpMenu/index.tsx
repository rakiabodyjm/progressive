import { Menu, MenuItem, MenuProps, SvgIconTypeMap, Theme, Typography } from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme: Theme) => ({
  menuItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
  },
}))
type PopUpMenuItem = {
  text: string
  Component?: JSX.Element | OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
  action?(): void
}
export function PopUpMenu({
  menuItems,
  open,
  anchorEl,
  onClose,
  ...restProps
}: {
  open: boolean
  anchorEl: MenuProps['anchorEl']
  onClose(): void
  menuItems: PopUpMenuItem[]
} & MenuProps) {
  const classes = useStyles()
  return (
    <Menu
      PaperProps={{
        style: {
          minWidth: 240,
          ...restProps.PaperProps?.style,
        },
        ...restProps.PaperProps,
      }}
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      transformOrigin={{
        horizontal: 'center',
        vertical: 'top',
      }}
      {...restProps}
    >
      {menuItems.map(({ Component, ...menuItem }) => (
        <MenuItem key={menuItem.text} className={classes.menuItem} onClick={menuItem.action}>
          <Typography variant="body2">{menuItem.text}</Typography>
          {Component}
        </MenuItem>
      ))}
    </Menu>
  )
}
