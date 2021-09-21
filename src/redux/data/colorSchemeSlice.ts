import { createSlice } from '@reduxjs/toolkit'

export enum ColorSchemeTypes {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// type ColorSchemeStateType = typeof ColorSchemeTypes[keyof typeof ColorSchemeTypes]
const colorSchemeSlice = createSlice({
  name: 'colorScheme',
  initialState: ColorSchemeTypes.LIGHT,
  reducers: {
    toggleColor(state): ColorSchemeTypes {
      if (state === 'LIGHT') {
        return ColorSchemeTypes.DARK
      }
      return ColorSchemeTypes.LIGHT
    },
    setColorScheme(
      _,
      {
        payload,
      }: {
        payload: ColorSchemeTypes
      }
    ): ColorSchemeTypes {
      return payload
    },
  },
})
export const { toggleColor, setColorScheme } = colorSchemeSlice.actions
export default colorSchemeSlice.reducer
