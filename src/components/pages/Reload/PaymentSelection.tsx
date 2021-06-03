import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  paymentSelection: {},
}))

const PaymentSelection = () => {
  const classes = useStyles()
  return <div className={classes.paymentSelection}></div>
}

export default PaymentSelection
