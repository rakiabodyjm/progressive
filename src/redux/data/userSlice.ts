import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import userApi, { UserResponse } from '@src/utils/api/userApi'
import type { LoginUserParams, LoginUserResponse } from '@src/utils/api/userApi'
import jwtDecode from '@src/utils/lib/jwtDecode'
import { AxiosError } from 'axios'
import type { RootState } from '@src/redux/store'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import { createSelector } from 'reselect'
export enum UserRoles {
  ADMIN = 'admin',
  DSP = 'dsp',
  RETAILER = 'retailer',
  SUBDISTRIBUTOR = 'subdistributor',
}
// export type UserTypes = 'admin' | 'dsp' | 'retailer' | 'subdistributor' | 'user'
export type UserTypes = `${UserRoles}`

export type User = {
  user_id: string
  email: string
  first_name: string
  last_name: string
  roles: UserTypes[] | []
}
export type UserMetaData = {
  iat: number
  exp: number
}
export type UserState = {
  data: User
  metadata: UserMetaData
}

function reduceUser(response: UserResponse): UserState['data'] {
  const { id, email, first_name, last_name, roles } = response
  return {
    user_id: id,
    email,
    first_name,
    last_name,
    roles,
  }
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

export const getUser = createAsyncThunk(
  'user/getUser',
  async (arg, thunkApi): Promise<UserState> => {
    const state = thunkApi.getState() as RootState
    const { user: userState } = state
    if (userState?.data.user_id) {
      const userResponse = await userApi.getUser(userState.data.user_id).catch((err) => {
        const error = userApi.extractError(err)
        thunkApi.dispatch(
          setNotification({
            type: NotificationTypes.ERROR,
            message: error,
          })
        )
        throw new Error()
      })
      const user = reduceUser(userResponse)

      return {
        data: user,
        metadata: { ...userState?.metadata },
      }
    }
    thunkApi.dispatch(
      setNotification({
        type: NotificationTypes.ERROR,
        message: `User not Logged in`,
      })
    )
    throw new Error('User not logged in')

    // try {
    //   console.log('getting user')
    //   if (state.user) {
    //     const res = await userApi.getUser(state.user.data.user_id)
    //     console.log(userApi.reduceUser(res))
    //     // thunkApi.dispatch(
    //     //   setUser({
    //     //     data: {
    //     //       ...userApi.reduceUser(res),
    //     //     },
    //     //     metadata: {
    //     //       ...state.user.metadata,
    //     //     },
    //     //   })
    //     // )
    //     return {
    //       data: {
    //         ...userApi.reduceUser(res),
    //       },
    //       metadata: {
    //         ...state.user.metadata,
    //       },
    //     }
    //   }
    //   throw new Error(`Getting latest logged in user data failed`)
    // } catch (err: AxiosError<any>) {
    //   console.log(err.response.data)
    //   throw new Error(err.response?.data?.message || err.message)
    // }
  }
)

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
      userApi.logoutUser()
      return null
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserThunk.fulfilled, (state, { payload }) => {
      const { user_id, email, first_name, last_name, roles, iat, exp } = Object(payload)
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
    builder.addCase(
      getUser.fulfilled,
      (state, action: { payload: UserState }): UserState => action.payload
    )
    builder.addCase(getUser.rejected, (state, { payload }) => null)
  },
})

export const { setUser, removeUser } = userSlice.actions
const userSelector = createSelector(
  (state: RootState) => state.user,
  (user) => user
)
const userDataSelector = createSelector(userSelector, (user) => user?.data)
const userMetaDataSelector = createSelector(userSelector, (user) => user?.metadata)
export { userDataSelector, userMetaDataSelector, userSelector }
export default userSlice.reducer
