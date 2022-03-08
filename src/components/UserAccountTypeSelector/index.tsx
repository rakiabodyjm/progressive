import {
  Box,
  Button,
  ButtonGroup,
  Menu,
  MenuProps,
  Paper,
  Popover,
  PopoverProps,
  Theme,
  Tooltip,
  Typography,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { useIsMobile } from '@src/utils/hooks/useWidth'
import clsx from 'clsx'
import { useRef, useState } from 'react'
const userTypesSorted: UserTypesAndUser[] = ['user', 'retailer', 'dsp', 'subdistributor', 'admin']

const useStyles = makeStyles((theme: Theme) => ({
  accountTypeSelectorContainer: {
    // display: 'flex',
    // justifyContent: 'center',
    //     [theme.breakpoints.up()]: {

    // },
    textAlign: 'center',

    [theme.breakpoints.up('sm')]: {
      padding: 8,
      paddingBottom: 16,
    },
    [theme.breakpoints.down('xs')]: {
      justifyContent: 'center',
      border: 'none',
      background: 'none',

      '& .title': {
        display: 'none',
      },
    },
  },
  accountTypeSelector: {
    '& button': {
      padding: '4px 32px',
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(0.5, 2.3),
        '& .MuiTypography-body1': {
          fontSize: '0.85rem',
        },
      },
    },
    '& .active': {
      background: theme.palette.primary.main,
    },
  },

  mobileUserSelector: {
    padding: 8,
    paddingBottom: 16,
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}))

type UserAccountTypeSelectorProps = {
  activeUser: UserTypesAndUser
  onChange: (changeUser: UserTypesAndUser) => void
}
export const DesktopUserAccountTypeSelector = ({
  activeUser,
  onChange,
}: UserAccountTypeSelectorProps) => {
  const isMobile = useIsMobile()
  const classes = useStyles()

  return (
    <Paper variant="outlined" className={classes.accountTypeSelectorContainer}>
      <Typography
        style={{
          marginBottom: 8,
        }}
        className="title"
        color="textSecondary"
        variant="body1"
      >
        Select User Type:
      </Typography>

      <ButtonGroup
        className={`${classes.accountTypeSelector} button-group`}
        disableElevation
        size="small"
        variant="outlined"
        {...(isMobile && {
          orientation: 'vertical',
        })}
      >
        {userTypesSorted.map((ea) => (
          <Button
            size="small"
            onClick={() => {
              onChange(ea)
            }}
            key={ea}
            className={clsx({
              active: activeUser === ea,
            })}
          >
            <Typography variant="body1">{ea.toUpperCase()}</Typography>
          </Button>
        ))}
      </ButtonGroup>
    </Paper>
  )
}

export const MobileUserAccountTypeSelector = ({
  onChange,
  activeUser,
}: UserAccountTypeSelectorProps) => {
  const classes = useStyles()
  const userSelectorAnchorEl = useRef<HTMLElement | undefined>()
  const [userSelectorOpen, setUserSelectorOpen] = useState<boolean>(false)
  return (
    <>
      <Paper className={classes.mobileUserSelector}>
        <Box>
          <Tooltip
            arrow
            placement="top"
            title={<Typography variant="subtitle2">Change Active Account Type</Typography>}
            innerRef={userSelectorAnchorEl}
          >
            <Box textAlign="center">
              <Typography
                style={{
                  marginBottom: 8,
                }}
                color="textSecondary"
                variant="body2"
              >
                Select User Type:
              </Typography>

              <Button
                color="primary"
                variant="contained"
                style={{
                  width: 146,
                }}
                onClick={() => {
                  setUserSelectorOpen(true)
                }}
              >
                <Typography variant="body2">{activeUser.toUpperCase()}</Typography>
              </Button>
            </Box>
          </Tooltip>
        </Box>
      </Paper>
      <Popover
        open={userSelectorOpen}
        onClose={() => {
          setUserSelectorOpen(false)
        }}
        anchorEl={userSelectorAnchorEl.current}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <DesktopUserAccountTypeSelector
          {...{
            onChange,
            activeUser,
          }}
        />
      </Popover>
    </>
  )
}

export default function UserAccountTypeSelector(props: UserAccountTypeSelectorProps) {
  const isMobile = useIsMobile({
    tabletIncluded: false,
  })

  return (
    <>
      {isMobile ? (
        <MobileUserAccountTypeSelector {...props} />
      ) : (
        <DesktopUserAccountTypeSelector {...props} />
      )}
    </>
  )
}
