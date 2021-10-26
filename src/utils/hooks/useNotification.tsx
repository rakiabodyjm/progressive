import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useDispatch } from 'react-redux'

type DispatchNotification = {
  message: string
  type: NotificationTypes
}
export default function useNotification() {
  const dispatch = useDispatch()
  return ({ message, type }: DispatchNotification) =>
    dispatch(
      setNotification({
        message,
        type,
      })
    )
  //   return dispatch(setNotification(payload))
}
