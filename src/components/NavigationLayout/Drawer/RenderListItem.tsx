import {
  ListItem,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  makeStyles,
  SvgIconTypeMap,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { OverridableComponent } from '@material-ui/core/OverridableComponent'
import { useRouter } from 'next/router'
import { MouseEvent } from 'react'

const useStyles = makeStyles((theme) => ({
  drawerItem: {
    '&:hover': {
      // color: theme.palette.primary.main,
      '& svg': {
        // color: theme.palette.primary.main,
        // color: 'var(--primary-contrastText)',
        // color: theme.palette.primary.contrastText,
      },

      '& .logoutButton': {},
    },
    '& svg': {
      color: theme.palette.primary.main,
      // color: theme.palette.primary.contrastText,
      // color: 'var(--primary-dark)',
    },
  },
}))
export default function RenderListItem({
  title,
  icon,
  url,
  open,
  ...props
}: // classes,
{
  title: string
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> | JSX.Element
  url: string
  open: boolean
  // classes?: ReturnType<typeof useStyles>
  //   router: ReturnType<typeof useRouter>
} & ListItemProps<'li', {}>) {
  const router = useRouter()
  const classes = useStyles()
  return (
    <Tooltip
      disableHoverListener={open}
      disableTouchListener={open}
      title={<Typography variant="body1">{title}</Typography>}
      placement="right"
      arrow
    >
      <ListItem
        style={{
          paddingTop: 16,
          paddingBottom: 16,
          ...props.style,
        }}
        className={`${classes?.drawerItem} ${props.className}`}
        button
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          e.preventDefault()
          router.push(url)
        }}
        component="a"
        href={url}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>
          <Typography
            variant="body1"
            style={{
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {title}
          </Typography>
        </ListItemText>
      </ListItem>
    </Tooltip>
  )
}
