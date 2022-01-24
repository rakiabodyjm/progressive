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
import NumberFormat from 'react-number-format'
import MoneyIcon from '@material-ui/icons/Payment'
import Image from 'next/image'
import { makeStyles } from '@material-ui/styles'
import companyLogo from '@public/assets/realm1000-logo.png'
import React, { useEffect, useState, ChangeEvent, MouseEvent } from 'react'

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

export default function CashTransfer() {
  const classes = useStyles()
  const theme: Theme = useTheme()
  const [coins, setCoins] = useState<string>()
  const [receipient, setReceipient] = useState<string>()
  const [triggerButton, setTriggerButton] = useState<boolean>(false)
  // const handleButton = (num) => {}
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setValues({
      ...values,
      [event.currentTarget.name]: event.currentTarget.value,
    })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setReceipient(e.target.value)
  }

  // const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
  //   console.log(e.target.value)
  //   setCoins(e.target.value)
  // }

  const [values, setValues] = useState({
    receipient: '',
    amount: '0',
  })

  const handleChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    })
  }

  return (
    <div>
      <div
        style={{
          height: 64,
          background: theme.palette.secondary.main,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: 'auto',
            display: 'flex',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <a
            href="/"
            style={{
              position: 'relative',
              height: 56,
              width: 56,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Image src={companyLogo} alt="REALM1000 DITO" layout="fill" objectFit="contain" />
          </a>
        </div>
      </div>

      <div>
        <Paper className={classes.root}>
          <Paper className={classes.paperContainer}>
            <Typography
              variant="h4"
              color="primary"
              style={{ fontWeight: 600, textAlign: 'center' }}
            >
              Coins Transfer
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
                  <Typography className={classes.formLabel}>Send to</Typography>

                  <TextField
                    placeholder=""
                    variant="outlined"
                    name="contact_number"
                    fullWidth
                    size="small"
                    onChange={handleChange}
                  />
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
                    prefix="$"
                    inputProps={{
                      min: 0,
                      style: { textAlign: 'right', width: '100%', padding: 11 },
                    }}
                  />

                  {/* <TextField
                    placeholder=""
                    variant="outlined"
                    name="amount"
                    fullWidth
                    size="small"
                    className={classes.currencyFormat}
                    inputProps={{ min: 0, style: { textAlign: 'right' } }}
                    value={coins}
                    onChange={handleChangeAmount}

                    // onChange={handleChange}
                    // value={user.first_name}
                  /> */}
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
                    // handleSubmit()
                  }}
                  color="primary"
                  endIcon={<MoneyIcon />}
                >
                  Send
                </Button>
              </Box>
            </Box>
          </Paper>
        </Paper>
      </div>
    </div>
  )
}
