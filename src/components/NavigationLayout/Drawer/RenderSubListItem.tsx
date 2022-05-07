import {
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { useTheme } from '@material-ui/styles'
import { nanoid } from '@reduxjs/toolkit'
import type { MultipleMainMenuItemType } from '@src/components/NavigationLayout/Drawer/MainMenuItems'
import RenderListItem from '@src/components/NavigationLayout/Drawer/RenderListItem'
import { useIsMobile } from '@src/utils/hooks/useWidth'
import { useRef, useState } from 'react'

export default function RenderSubListItem({
  //   listItem,
  open,
  ...props
}: {
  open: boolean
} & MultipleMainMenuItemType) {
  const [isToggle, setIsToggle] = useState<boolean>(false)
  const handleClick = () => {
    setIsToggle((prev) => !prev)
  }
  const theme: Theme = useTheme()

  const listitemRef = useRef<HTMLDivElement | null>()
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          background: theme.palette.primary.main,
          width: 2,
          top: listitemRef.current?.clientHeight,
          right: 0,
          bottom: 0,
          left: isMobile ? 8 : 16,
        }}
      />
      <Tooltip
        disableHoverListener={open}
        disableTouchListener={open}
        title={<Typography variant="body1">Retailers</Typography>}
        placement="right"
        arrow
      >
        <ListItem
          ref={(listItemRef) => {
            listitemRef.current = listItemRef
          }}
          button
          onClick={handleClick}
          className="list-item"
        >
          <ListItemIcon
            style={{
              color: theme.palette.primary.main,
            }}
          >
            {props.icon}
          </ListItemIcon>
          <ListItemText>
            <Typography
              style={{
                fontWeight: 600,
              }}
              variant="body1"
            >
              {props.title}
            </Typography>
          </ListItemText>
          {isToggle ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
      </Tooltip>
      <Collapse in={isToggle} timeout="auto" unmountOnExit>
        <List>
          {props.subMenu.map((ea) => (
            <div
              style={{
                position: 'relative',
              }}
              key={nanoid()}
            >
              <div
                style={{
                  position: 'absolute',
                  width: 8,
                  height: 2,
                  top: '50%',
                  left: isMobile ? 8 : 18,
                  right: 0,
                  bottom: 0,
                  background: theme.palette.primary.main,
                  transform: 'translateY(-50%)',
                }}
              ></div>
              <RenderListItem
                style={{
                  padding: 8,
                  paddingLeft: isMobile ? 16 : 32,
                }}
                open={open}
                {...ea}
              />
            </div>
          ))}
        </List>
      </Collapse>
    </div>
  )
}
