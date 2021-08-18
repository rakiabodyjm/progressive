import { configureStore } from '@reduxjs/toolkit'
import orderMessage from '@src/redux/data/orderMessage'
import user from '@src/redux/data/userSlice'
import notification from '@src/redux/data/notificationSlice'
export const store = configureStore({
  reducer: {
    orderMessage,
    notification,
    user,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
