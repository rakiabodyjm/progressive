import { configureStore } from '@reduxjs/toolkit'
import user from '@src/redux/data/userSlice'
import notification from '@src/redux/data/notificationSlice'
import colorScheme from '@src/redux/data/colorSchemeSlice'
export const store = configureStore({
  reducer: {
    colorScheme,
    notification,
    user,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
