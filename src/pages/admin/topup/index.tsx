import {
  Paper,
  Box,
  useTheme,
  Theme,
  Typography,
  Divider,
  Grid,
  TextField,
  Button,
} from '@material-ui/core'
import {
  CaesarWalletResponse,
  getWallet,
  searchWallet,
  SearchWalletParams,
  topUpWallet,
} from '@src/utils/api/walletApi'
import NumberFormat from 'react-number-format'
import MoneyIcon from '@material-ui/icons/Payment'
import Image from 'next/image'
import { makeStyles } from '@material-ui/styles'
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react'
import { userDataSelector } from '@src/redux/data/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import userApi, { getUser, searchUser, UserResponse } from '@src/utils/api/userApi'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import FormLabel from '@src/components/FormLabel'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    minHeight: 800,
    height: '100vh',
    '&:after': {
      content: "''",
      position: 'absolute',
      width: '100%',
      top: 0,
      bottom: 0,
      //   background: 'red',
      zIndex: -1,
    },
  },
  paperContainer: {
    position: 'relative',
    margin: 'auto',
    top: '15%',
    transform: 'translateY(-14%)',
    maxWidth: 450,
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  paper: {
    padding: 10,
    borderRadius: 8,
  },
  inputContainer: {
    '& input': {
      fontSize: 16,
    },
  },
  formLabel: {
    color: theme.palette.primary.main,
  },
  formHeader: {
    fontWeight: 600,
    marginBottom: 20,
  },
  buttonMargin: {
    marginTop: 50,
  },
  errorMessage: {
    color: 'red',
    paddingLeft: 5,
    fontSize: 11,
  },
  currencyFormat: {
    textAlign: 'right',
  },
}))
type CaesarReceiverInfo = {
  caesar: string
  amount: number
}

export default function CashTransfer() {
  const [values, setValues] = useState<CaesarReceiverInfo>({
    caesar: '',
    amount: 0,
  })

  const user = useSelector(userDataSelector)
  const classes = useStyles()
  const theme: Theme = useTheme()
  const dispatch = useDispatch()
  const dispatchError = useErrorNotification()
  const dispatchSuccess = useSuccessNotification()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    })
  }
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setValues({
      ...values,
      [event.currentTarget.name]: Number(event.currentTarget.value),
    })
  }

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stringHolder: string = event.currentTarget.value.slice(2)
    setValues({
      ...values,
      [event.currentTarget.name]: Number(stringHolder.replace(/(?!\w|\s)./g, '')),
    })
    console.log(stringHolder)
  }

  const handleSubmit = () => {
    topUpWallet(values)
      .then((res) => {
        console.log(res)
        dispatch(
          setNotification({
            message: `Top Up Successful`,
            type: NotificationTypes.SUCCESS,
          })
        )
      })
      .catch((err: string[]) => {
        err.forEach((ea) => {
          dispatchError(ea)
        })
      })
    console.log(values)
    setValues({
      ...values,
      amount: 0,
    })
  }

  return (
    <div>
      <Paper className={classes.root}>
        <Grid spacing={1} container>
          <Grid xs={12} item>
            <Paper className={classes.paperContainer}>
              <Typography
                variant="h4"
                color="primary"
                style={{ fontWeight: 600, textAlign: 'center' }}
              >
                Caesar Coin Transfer
              </Typography>
              <Divider style={{ marginTop: 16, marginBottom: 16 }} />

              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault()
                }}
                p={2}
              >
                <Grid spacing={2} container>
                  <Typography variant="h5" className={classes.formHeader}>
                    Personal Details
                  </Typography>
                  <Grid item xs={12}>
                    <FormLabel variant="body2">Send to</FormLabel>
                    <SimpleAutoComplete<CaesarWalletResponse, SearchWalletParams>
                      initialQuery={{
                        page: 0,
                        limit: 100,
                        searchQuery: '',
                      }}
                      fetcher={(query) =>
                        searchWallet(query)
                          .then((res) => res.data)
                          .catch((err) => {
                            console.log('Caesar Account Search Error: ', err)
                            return []
                          })
                      }
                      onChange={(e) => {
                        console.log(e)
                        setValues((prevState) => ({
                          ...prevState,
                          caesar: e?.id ?? undefined,
                        }))
                      }}
                      querySetter={(initialQuery, inputValue) => ({
                        ...initialQuery,
                        searchQuery: inputValue,
                      })}
                      getOptionSelected={(arg1, arg2) =>
                        arg1 && arg2 ? arg1.id === arg2.id : false
                      }
                      getOptionLabel={(caesar) => caesar?.description}
                    />

                    {/* <Typography className={classes.formLabel}>Send to</Typography>

                <TextField
                  placeholder=""
                  variant="outlined"
                  name="caesarId"
                  fullWidth
                  size="small"
                  onChange={handleChange}
                /> */}
                  </Grid>
                  <Grid item xs={12}>
                    <Typography className={classes.formLabel}>Amount</Typography>

                    <NumberFormat
                      className={classes.currencyFormat}
                      customInput={TextField}
                      variant="outlined"
                      fullWidth
                      thousandSeparator
                      value={values.amount}
                      name="amount"
                      onChange={handleChangeAmount}
                      prefix="CC"
                      inputProps={{
                        min: 0,
                        style: { textAlign: 'right', width: '100%', padding: 11 },
                      }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Button name="amount" variant="outlined" value="100" onClick={handleClick}>
                      100
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button name="amount" variant="outlined" value="300" onClick={handleClick}>
                      300
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button name="amount" variant="outlined" value="500" onClick={handleClick}>
                      500
                    </Button>
                  </Grid>
                  <Grid item xs={3}>
                    <Button name="amount" variant="outlined" value="1000" onClick={handleClick}>
                      1000
                    </Button>
                  </Grid>
                </Grid>
                <Box
                  display="flex"
                  gridGap={8}
                  justifyContent="flex-end"
                  className={classes.buttonMargin}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault()
                      handleSubmit()
                    }}
                    color="primary"
                    endIcon={<MoneyIcon />}
                  >
                    Send
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
