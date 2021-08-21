import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userApi, { UserResponse } from '@src/utils/api/userApi'
import type { LoginUserParams, LoginUserResponse } from '@src/utils/api/userApi'
import jwtDecode from '@src/utils/lib/jwtDecode'
import { AxiosError } from 'axios'
import type { RootState } from '@src/redux/store'
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
      .then((res) => res)
      .catch((err: AxiosError) => {
        throw new Error(err.response?.data?.message || err.message)
      })
  // .catch((err) => thunkApi.rejectWithValue(null))
)

export const logoutUser = createAsyncThunk('user/logoutUser', (_, thunkApi) => {
  userApi.logoutUser()
  thunkApi.dispatch(removeUser())
})

export const getUser = createAsyncThunk('user/getUser', (arg: User['user_id'], thunkApi) => {
  const state = thunkApi.getState() as RootState
  // console.log('thunkAPi getState', thunkApi.getState())
  return userApi
    .getUser(arg || state.user.data.user_id)
    .then((res) => {
      console.log(res)
      return res
    })
    .catch((err: AxiosError) => {
      console.log(err.response.data)
      throw new Error(err.response?.data?.message || err.message)
    })
})

// export const revalidateUser = createApi({
//   reducerPath: 'user',
//   baseQuery: fetchBaseQuery({
//     baseUrl: axios.defaults.baseURL,
//   }),
// })

// TODO initialstate from localStorage
let initialUserState: UserState | null = null
if (process.browser && window?.localStorage.getItem('token')) {
  const decoded: UserMetaData & User = jwtDecode(window?.localStorage.getItem('token'))
  const { email, first_name, last_name, roles, user_id, iat, exp } = decoded
  initialUserState = {
    data: {
      email,
      first_name,
      last_name,
      roles,
      user_id,
    },
    metadata: {
      iat,
      exp,
    },
  }

  /**
   * validate User details from backend
   */
}
const userSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUser(_, { payload }: { payload: UserState | null }) {
      return payload
    },
    removeUser() {
      return null
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
    builder.addCase(getUser.fulfilled, (state, action) => {
      const { payload }: { payload: UserResponse } = action
      const data = {
        ...state.data,
        roles: payload.roles,
      }
      return {
        ...state,
        data,
      }
    })
  },
})

export const { setUser, removeUser } = userSlice.actions

export default userSlice.reducer
