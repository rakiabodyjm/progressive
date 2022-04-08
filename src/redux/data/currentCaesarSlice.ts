import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { UserTypes } from '@src/redux/data/userSlice'
import { RootState } from '@src/redux/store'
import { getWallet } from '@src/utils/api/walletApi'
type TelcoUsers = 'admin' | 'subdistributor' | 'dsp' | 'retailer' | 'user'

interface ActiveCaesarAccountState {
  caesar_id: string
  account_type: Omit<TelcoUsers, 'admin'>
}

export const getDefaultCaesar = createAsyncThunk('caesar/getDefaultCaesar', async (_, thunkApi) => {
  const state: RootState = thunkApi.getState() as RootState
  let locallySavedCaesar: ActiveCaesarAccountState | undefined
  if (process.browser) {
    const cached = localStorage.getItem('default_caesar')
    if (cached) {
      locallySavedCaesar = JSON.parse(cached) as ActiveCaesarAccountState
    }
  }
  // const locallySavedCaesar =
  if (state?.user?.data && !locallySavedCaesar) {
    const userdata = state.user.data
    if (userdata && userdata.roles) {
      const result = await new Promise((resolve, reject) => {
        userdata.roles.map(async (key) => {
          const accountId = userdata[`${key as TelcoUsers}_id`]!
          console.log('querying ', key)
          getWallet({
            [key]: accountId,
          })
            .then((res) => {
              resolve(res.id)
            })
            .catch((err) => {
              console.log(err)
            })
        })
      })
      console.log('result from getdefault', result)
    }
  } else {
    thunkApi.dispatch(setActiveCaesarAccount(undefined))
  }

  // if (state.user?.data.user_id) {
  //   getWallet({
  //     user: state.user?.data.user_id,
  //   }).then((caesarWalletOfUser) => {
  //     thunkApi.dispatch(
  //       setActiveCaesarAccount({
  //         caesar_id: caesarWalletOfUser.id,
  //         account_type: caesarWalletOfUser.account_type,
  //       })
  //     )
  //   })
  // }
})
let initialState: ActiveCaesarAccountState | undefined
const buyerSlice = createSlice({
  name: 'current_caesar',
  initialState,
  reducers: {
    setActiveCaesarAccount(
      state,
      {
        payload,
      }: {
        payload: ActiveCaesarAccountState | undefined
      }
    ) {
      return payload
    },
  },
  extraReducers: (builder) => {},
  //   extraReducers: (builder) => {
  //     builder.addCase('caesar/getDefaultCaesar', (_, thunkApi) =>{

  //     } )
  //   },
})

const { setActiveCaesarAccount } = buyerSlice.actions
