import {
  createAsyncThunk,
  createSlice,
  isAnyOf,
  isAsyncThunkAction,
  isFulfilled,
} from '@reduxjs/toolkit'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import userApi from '@src/utils/api/userApi'
import type { LoginUserParams, LoginUserResponse } from '@src/utils/api/userApi'
import jwtDecode from '@src/utils/jwtDecode'
import axios, { AxiosError, AxiosResponse } from 'axios'

export type UserTypes = 'admin' | 'dsp' | 'retailer' | 'user'
export type User = {
  user_id: string
  email: string
  first_name: string
  last_name: string
  roles: UserTypes[]
}
export type UserMetaData = {
  iat: number
  exp: number
}
export type UserState = {
  data: User
  metadata: UserMetaData
}

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (params: LoginUserParams, thunkApi) =>
    userApi
      .loginUser(params)
      .then((res) => {
        thunkApi.dispatch(
          setNotification({
            message: `Welcome ${res.first_name}`,
            type: NotificationTypes.SUCCESS,
          })
        )
        return res
      })
      .catch((err) => {
        thunkApi.dispatch(
          setNotification({
            message: err.response.data.message || err.message,
            type: NotificationTypes.ERROR,
          })
        )
        throw err
      })
  // .catch((err) => thunkApi.rejectWithValue(null))
)

const initialUserState: UserState | null = null
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser(_, { payload }: { payload: UserState | null }) {
      return payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      const { user_id, email, first_name, last_name, roles, iat, exp } = payload
      return {
        data: {
          user_id,
          email,
          first_name,
          last_name,
          roles,
        },
        metadata: {
          iat,
          exp,
        },
      }
    })
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
