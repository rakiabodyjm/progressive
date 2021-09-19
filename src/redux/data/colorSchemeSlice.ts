import { createSlice } from '@reduxjs/toolkit'

export enum ColorSchemeTypes {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

const initialState = ColorSchemeTypes.LIGHT
const colorSchemeSlice = createSlice({
  name: 'colorScheme',
  initialState,
  reducers: {
    setColorScheme(params: ColorSchemeTypes) {
      return params
    },
    setLightMode() {
      return ColorSchemeTypes.LIGHT
    },
    setDarkMode() {
      return ColorSchemeTypes.DARK
    },
  },
})
export const { setColorScheme, setLightMode, setDarkMode } = colorSchemeSlice.actions
export default colorSchemeSlice.reducer
