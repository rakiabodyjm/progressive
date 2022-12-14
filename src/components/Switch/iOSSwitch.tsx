import { Switch, SwitchClassKey, SwitchProps, Theme } from '@material-ui/core'
import { createStyles, withStyles } from '@material-ui/styles'

const iOSSwitchStyles = (theme: Theme) =>
  createStyles({
    root: {
      width: 42,
      height: 26,
      padding: 0,
    },
    switchBase: {
      padding: 1,
      '&$checked': {
        transform: 'translateX(16px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: '#52d869',
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
    },
    track: {
      borderRadius: 26 / 2,
      border: `1px solid ${theme.palette.grey[400]}`,
      backgroundColor: theme.palette.grey[50],
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
  })

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string
}

interface Props extends SwitchProps {
  classes: Styles
}
const IOSSwitch = withStyles(iOSSwitchStyles)(({ classes, ...props }: Props) => (
  <Switch
    focusVisibleClassName={classes.focusVisible}
    disableRipple
    classes={{
      root: classes.root,
      switchBase: classes.switchBase,
      thumb: classes.thumb,
      track: classes.track,
      checked: classes.checked,
    }}
    {...props}
  />
))
export default IOSSwitch
