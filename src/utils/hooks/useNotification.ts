import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

type DispatchNotification = {
  message: string
  type: NotificationTypes
}
export default function useNotification() {
  const dispatch = useDispatch()
  return useCallback(
    ({ message, type }: DispatchNotification) =>
      dispatch(
        setNotification({
          message,
          type,
        })
      ),
    [dispatch]
  )
  //   return dispatch(setNotification(payload))
}

export function useSuccessNotification() {
  const dispatch = useDispatch()
  return useCallback(
    (message: string) =>
      dispatch(
        setNotification({
          message,
          type: NotificationTypes.SUCCESS,
        })
      ),
    [dispatch]
  )
}

export function useErrorNotification() {
  const dispatch = useDispatch()

  return useCallback(
    (message: string) =>
      dispatch(
        setNotification({
          message,
          type: NotificationTypes.ERROR,
        })
      ),
    [dispatch]
  )
}
