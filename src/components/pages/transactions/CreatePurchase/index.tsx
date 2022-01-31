import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Paper,
  Typography,
  useTheme,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import AsyncButton from '@src/components/AsyncButton'
import FormLabel from '@src/components/FormLabel'
import FormTextField from '@src/components/FormTextField'
import ModalWrapper from '@src/components/ModalWrapper'
import { toCapsFirst } from '@src/utils/api/common'
import { Inventory } from '@src/utils/api/inventoryApi'
import { createPurchase } from '@src/utils/api/transactionApi'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { useErrorNotification, useSuccessNotification } from '@src/utils/hooks/useNotification'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'

export default function CreatePurchase({
  inventory,
  buyerCaesarId,
  modal,
  revalidateFunction,
  srpKey,
}: {
  inventory: Inventory
  buyerCaesarId: string
  modal?: () => void
  revalidateFunction?: () => void
  srpKey: keyof Inventory
}) {
  const [buyerCaesar, setbuyerCaesar] = useState<CaesarWalletResponse | undefined>()
  const [valid, setValid] = useState(Date.now())

  useEffect(() => {
    getWalletById(buyerCaesarId)
      .then((res) => {
        setbuyerCaesar(res)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [buyerCaesarId, valid])
  const [quantity, setQuantity] = useState<number>(0)
  const [amount, setAmount] = useState<number>(0)
  const [by, setBy] = useState<'quantity' | 'amount'>('quantity')
  const formattedInventory = useMemo(() => reduceInventory(inventory, srpKey), [inventory, srpKey])

  const cCoinTotal = useMemo(
    () => quantity * (Number(formattedInventory.price.split(' ')[0]) || 0),
    [quantity, formattedInventory]
  )

  const quantityTotal = useMemo(
    () => Number(amount / Number(formattedInventory.price.split(' ')[0])),
    [amount, formattedInventory]
  )

  const priceTexts = useMemo(() => {
    if (by === 'quantity') {
      return {
        title: 'Total Amount:',
        subtitle: 'Amount in CCoins',
      }
    }
    return {
      title: 'Total Quantity:',
      subtitle: 'Number of Pieces',
    }
  }, [by])
  const theme = useTheme()

  const successNotif = useSuccessNotification()
  const errorNotif = useErrorNotification()
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    const quantitySubmit: number = by === 'quantity' ? quantity : quantityTotal
    setLoading(true)
    return createPurchase({
      inventoryId: inventory.id,
      buyerCaesarId,
      quantity: quantitySubmit,
    })
      .then((res) => {
        if (res?.pending_transactions) {
          successNotif(`Transaction succeeded as Pending`)
        } else {
          successNotif(`Transaction Completed`)
        }
      })
      .catch((err) => {
        err.forEach((er: string) => {
          errorNotif(er)
        })
      })
      .finally(() => {
        setLoading(false)
        setValid(Date.now())
      })
  }
  return (
    <Paper>
      <Box p={2}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6">Purchase Inventory</Typography>
            <Typography
              style={{
                display: 'inline-flex',
                alignItems: 'center',
              }}
              variant="body2"
              color="textSecondary"
            >
              Buy Item as Caesar:
              <Box component="span" marginLeft={0.5} />
              {buyerCaesar ? (
                <Typography
                  component="span"
                  color="primary"
                  variant="body2"
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {buyerCaesar.description}
                </Typography>
              ) : (
                <CircularProgress
                  style={{
                    fontSize: 'inherit',
                  }}
                  size={24}
                />
              )}
            </Typography>
          </Box>
          <Box>
            {modal && (
              <IconButton
                style={{
                  padding: 4,
                }}
                onClick={modal}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        </Box>
        <Box my={2}>
          <Divider />
        </Box>
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Paper>
                <Box p={1}>
                  <Typography
                    variant="body1"
                    color="primary"
                    style={{
                      fontWeight: 600,
                    }}
                  >
                    Inventory Details
                  </Typography>
                  <Box my={1} mt={2}>
                    <Divider />
                  </Box>
                  {Object.keys(formattedInventory).map((ea) => (
                    <Box mb={1}>
                      <FormLabel>{toCapsFirst(ea)} </FormLabel>
                      <Typography variant="body2">
                        {formattedInventory[ea as keyof ReturnType<typeof reduceInventory>]}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
            <Grid
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
              item
              xs={12}
              sm={6}
            >
              <Paper>
                <Box p={1}>
                  <Box display="flex" justifyContent="center">
                    <ButtonGroup size="small" variant="outlined" disableElevation>
                      <Button
                        {...(by === 'quantity' && {
                          variant: 'contained',
                          color: 'primary',
                        })}
                        size="small"
                        onClick={() => {
                          setBy('quantity')
                          setQuantity(0)
                        }}
                      >
                        <FormLabel color="inherit">By Quantity</FormLabel>
                      </Button>
                      <Button
                        {...(by === 'amount' && {
                          variant: 'contained',
                          color: 'primary',
                        })}
                        size="small"
                        onClick={() => {
                          setBy('amount')
                          setAmount(0)
                        }}
                      >
                        <FormLabel color="inherit">By Amount</FormLabel>
                      </Button>
                    </ButtonGroup>
                  </Box>
                  <Box my={1.5}>
                    <Divider />
                  </Box>
                  {by === 'quantity' ? (
                    <>
                      <FormLabel>Quantity: </FormLabel>
                      <Box my={2} />
                      <FormTextField
                        key="quantity"
                        name="quantity"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setQuantity(Number(e.target.value))
                        }}
                        type="number"
                        inputProps={{
                          min: 1,
                          step: 0.2,
                        }}
                        placeholder="100"
                        size="small"
                      />
                    </>
                  ) : (
                    <>
                      <FormLabel>Amount:</FormLabel>
                      <Box my={2} />

                      <FormTextField
                        name="amount"
                        key="amount"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          setAmount(Number(e.target.value))
                        }}
                        type="number"
                        inputProps={{
                          min: 1,
                          step: 0.2,
                        }}
                        placeholder="CCoin Amount"
                        size="small"
                      />
                    </>
                  )}
                </Box>
              </Paper>
              <Box p={1}>
                <Typography
                  style={{
                    fontWeight: 700,
                  }}
                  variant="h5"
                  color="primary"
                >
                  {priceTexts.title}
                </Typography>

                <Typography
                  style={{
                    fontWeight: 700,
                    lineBreak: 'anywhere',
                  }}
                  variant="h4"
                >
                  {by === 'quantity' && (
                    <Typography
                      variant="h6"
                      component="span"
                      color="primary"
                      style={{
                        fontWeight: 700,
                        marginRight: 8,
                      }}
                    >
                      CCoins
                    </Typography>
                  )}
                  {by === 'quantity'
                    ? `${Number(
                        quantity * (Number(formattedInventory.price.split(' ')[0]) || 0)
                      ).toLocaleString()}`
                    : `${Number(
                        (amount / Number(formattedInventory.price.split(' ')[0])).toFixed(2)
                      ).toLocaleString()}`}
                </Typography>
                <Typography variant="body2" component="i">
                  {priceTexts.subtitle}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box>
            <Box my={2} mb={1}>
              <Divider />
            </Box>
            <Grid
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              container
              spacing={1}
            >
              <Grid item xs={6}>
                <Typography
                  display="inline"
                  color="primary"
                  style={{
                    fontWeight: 700,
                  }}
                >
                  Available Caesar Coins:{' '}
                </Typography>

                <Typography display="inline">
                  <span></span>
                  {buyerCaesar?.data?.caesar_coin?.toLocaleString() || 0}
                </Typography>
              </Grid>
              <Grid
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
                item
                xs={6}
              >
                <AsyncButton
                  loading={loading}
                  disabled={
                    (buyerCaesar?.data?.caesar_coin || 0) < cCoinTotal ||
                    (by === 'amount' && amount === 0) ||
                    (by === 'quantity' && quantity === 0)
                  }
                  onClick={handleSubmit}
                >
                  Submit
                </AsyncButton>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

const reduceInventory = (inventory: Inventory, srpKey: keyof Inventory) => {
  const { description, name, quantity, caesar } = inventory
  const srp = inventory[srpKey]
  const seller = caesar.description

  return {
    seller,
    name,
    remaining_quantity: `${quantity} pcs.`,
    price: `${srp} CCoins`,
    description: description.slice(0, 250),
  }
}