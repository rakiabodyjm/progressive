import { createSlice } from '@reduxjs/toolkit'

export enum NotificationTypes {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  INFO = 'INFO',
  DEFAULT = 'DEFAULT',
}

type Notification = {
  message: string
  type: NotificationTypes
}
const initialState: Notification = {
  message: '',
  type: NotificationTypes.INFO,
}
const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action: { payload: Notification }) {
      const { payload } = action
      return {
        message: payload.message,
        type: payload.type,
      }
    },
    clearNotification(state, action) {
      return {
        message: '',
        type: NotificationTypes.INFO,
      }
      // return ''
    },
  },
})
export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer
