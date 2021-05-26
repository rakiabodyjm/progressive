import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const orderMessageSlice = createSlice({
  name: 'orderMessage',
  initialState: null,
  reducers: {
    setOrderMessage: (state, { payload }) => payload,
    clearOrderMessage: () => null,
  },
})

export const { setOrderMessage, clearOrderMessage } = orderMessageSlice.actions

export default orderMessageSlice.reducer
