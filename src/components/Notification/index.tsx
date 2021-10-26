import { RootState } from '@src/redux/store'
import { useSnackbar, VariantType } from 'notistack'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import { IconButton } from '@material-ui/core'

export default function Notification() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar()

  const notification = useSelector((state: RootState) => state.notification)

  useEffect(() => {
    if (notification.message?.length > 1) {
      enqueueSnackbar(notification.message, {
        // preventDuplicate: true,
        variant: notification.type.toLowerCase() as VariantType,
        action: (key) => (
          <IconButton
            style={{
              padding: 8,
            }}
            onClick={() => {
              closeSnackbar(key)
            }}
          >
            <HighlightOffIcon
              style={{
                color: 'currentcolor',
              }}
            />
          </IconButton>
        ),
      })
    }
  }, [notification, enqueueSnackbar, closeSnackbar])
  return null
}
