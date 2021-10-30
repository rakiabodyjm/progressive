import { createSlice } from '@reduxjs/toolkit'

export interface Asset {
  code: string
  name: string
  description: string
  created_by: string
  price: number
  quantity: number
  owner: string
}
const initialState: Asset[] = []
const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    addAsset(state, { payload }) {
      return [...state, payload]
      // const { payload }
    },
    removeAsset(state, { payload }: { payload: string }) {
      return state.filter((ea) => ea.code !== payload)
    },
    updateAsset(state, { payload }: { payload: { code: string; values: Partial<Asset> } }) {
      const index = state.findIndex((fi) => fi.code === payload.code)
      const tempState = [...state]
      Object.entries(([key, value]: [keyof Asset, string | number]) => {
        tempState[index] = { ...tempState[index], [key]: value }
      })
      return tempState
    },
  },
})

export const { addAsset, removeAsset, updateAsset } = assetSlice.actions
export default assetSlice.reducer
