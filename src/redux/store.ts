import { configureStore } from '@reduxjs/toolkit'
import orderMessage from '@src/redux/data/orderMessage'
export const store = configureStore({
  reducer: {
    orderMessage,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
