import {
  Paper,
  Box,
  Theme,
  Typography,
  Divider,
  Grid,
  Button,
  Container,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@material-ui/core'
import {
  CaesarWalletResponse,
  getAllWallet,
  searchWallet,
  SearchWalletParams,
  topUpWallet,
} from '@src/utils/api/walletApi'
import SearchCaesarTable from '@src/components/SearchCaesarTable'
import UsersTable from '@src/components/UsersTable'
import MoneyIcon from '@material-ui/icons/Payment'
import { makeStyles } from '@material-ui/styles'
import React, { useState, MouseEvent, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { NotificationTypes, setNotification } from '@src/redux/data/notificationSlice'
import FormLabel from '@src/components/FormLabel'
import SimpleAutoComplete from '@src/components/SimpleAutoComplete'
import { PaginateFetchParameters } from '@src/utils/types/PaginatedEntity'
import { UserTypesAndUser } from '../accounts'

const useStyles = makeStyles((theme: Theme) => ({
  caesarReloadPaper: {
    margin: 'auto',
    maxWidth: 450,
    padding: 16,
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  miniCaesarTable: {
    padding: 16,
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
}))
type CaesarReceiverInfo = {
  caesar: string
  amount: number
}
type GetAllWalletParams = PaginateFetchParameters & {
  account_type?: UserTypesAndUser
}
type UsersMoney = {
  caesar_coin: number
  peso: number
  dollar: number
}

export default function CashTransfer() {
  const [values, setValues] = useState<CaesarReceiverInfo>({
    caesar: '',
    amount: 0,
  })

  const classes = useStyles()
  const dispatch = useDispatch()
  const dispatchError = useErrorNotification()
  const [buttonTrigged, setButtonTriggered] = useState<boolean>(false)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setValues({
      ...values,
      [event.currentTarget.name]: Number(event.currentTarget.value),
    })
  }

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.currentTarget.name]: Number(event.currentTarget.value.replace(/(?!\w|\s)./g, '')),
    })
  }

  const handleSubmit = () => {
    if (values.amount > 0) {
      topUpWallet(values)
        .then((res) => {
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
        .finally(() => {
          if (buttonTrigged) {
            setButtonTriggered(false)
          } else {
            setButtonTriggered(true)
          }
        })
      setValues({
        ...values,
        amount: 0,
      })
    }
  }

  return (
    <Container>
      <Paper variant="outlined">
        <Box p={2}>
          <Box display="flex" justifyContent="space-between">
            <Box>
              <Typography variant="h4">Cash Reload</Typography>
              <Typography variant="body2" color="primary">
                This section the admin can reload accounts with Caesar Coins
              </Typography>
            </Box>
            <Box></Box>
          </Box>

          <Box display="flex" justifyContent="flex-end"></Box>
          <Box my={2}>
            <Divider />
          </Box>
          <Grid container spacing={2}>
            <Grid xs={12} item>
              <Paper className={classes.caesarReloadPaper}>
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
                    </Grid>
                    <Grid item xs={12}>
                      <Typography className={classes.formLabel}>Amount</Typography>

                      <FormControl fullWidth>
                        <OutlinedInput
                          name="amount"
                          value={new Intl.NumberFormat('en-US', { style: 'decimal' }).format(
                            values.amount
                          )}
                          onChange={handleChangeAmount}
                          startAdornment={
                            <InputAdornment position="start">
                              <Typography className={classes.formLabel}>CCoins</Typography>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="20"
                        fullWidth
                        onClick={handleClick}
                      >
                        20
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="30"
                        fullWidth
                        onClick={handleClick}
                      >
                        30
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="50"
                        fullWidth
                        onClick={handleClick}
                      >
                        50
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="100"
                        fullWidth
                        onClick={handleClick}
                      >
                        100
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="200"
                        fullWidth
                        onClick={handleClick}
                      >
                        200
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="300"
                        fullWidth
                        onClick={handleClick}
                      >
                        300
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="500"
                        fullWidth
                        onClick={handleClick}
                      >
                        500
                      </Button>
                    </Grid>
                    <Grid item xs={3}>
                      <Button
                        name="amount"
                        variant="outlined"
                        value="1000"
                        fullWidth
                        onClick={handleClick}
                      >
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
              <Grid xs={12} item>
                <Box className={classes.miniCaesarTable}>
                  <SearchCaesarTable isButtonClicked={buttonTrigged} />
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  )
}
