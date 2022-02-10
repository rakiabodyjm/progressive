import { Button, ButtonGroup } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import { Dispatch, SetStateAction } from 'react'

const PendingTransactionsRoleSelector = ({
  action,
  setAction,
}: {
  action: 'seller' | 'buyer'
  setAction: Dispatch<SetStateAction<'seller' | 'buyer'>>
}) => (
  <ButtonGroup size="medium" variant="outlined" disableElevation>
    <Button
      {...(action === 'seller' && {
        variant: 'contained',
        color: 'primary',
      })}
      onClick={() => {
        setAction('seller')
      }}
    >
      <FormLabel color="inherit">Seller</FormLabel>
    </Button>
    <Button
      {...(action === 'buyer' && {
        variant: 'contained',
        color: 'primary',
      })}
      onClick={() => {
        setAction('buyer')
      }}
    >
      <FormLabel color="inherit">Buyer</FormLabel>
    </Button>
  </ButtonGroup>
)

export default PendingTransactionsRoleSelector
