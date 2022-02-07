/* eslint-disable react/no-unescaped-entities */

/**
 * Includes transactions and pending Transactions
 */

import { Box, Container, Divider, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import CaesarTabs from '@src/components/CaesarTabs'
import RoleBadge from '@src/components/RoleBadge'
import { UserTypesAndUser } from '@src/pages/admin/accounts'
import { TransactionResponse } from '@src/utils/api/transactionApi'
import useResizeListener from '@hooks/useResizeListener'
import { useEffect, useState } from 'react'
import TransactionsTable from '@src/components/pages/transactions/TransactionsTable'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
// import useResizeListener from '@hooks/useResizeListener'

type ReducedTransactionResponse = ReturnType<typeof reduceForAccountType>
export default function TransactionsPage() {
  const theme: Theme = useTheme()
  const [activeCaesar, setActiveCaesar] = useState<[UserTypesAndUser, string] | undefined>()

  // const refElement = useRef<HTMLDivElement>(null)
  const [refElement, setRefElement] = useState<HTMLDivElement | null>(null)

  const target: keyof HTMLDivElement = 'clientHeight'

  const { refElementState } = useResizeListener({
    refElement,
    target,
  })
  const [currentHeight, setCurrentHeight] = useState<number>(0)

  useEffect(() => {
    if (refElement?.clientHeight) {
      setCurrentHeight(refElement.clientHeight)
    }
    if (refElementState) {
      setCurrentHeight(refElementState as number)
    }
  }, [refElement?.clientHeight, refElementState])

  return (
    <Container
      style={{
        height: '85vh',
        minHeight: 480,
      }}
      maxWidth="lg"
      disableGutters
    >
      <Paper
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          height: '100%',
        }}
      >
        <Box>
          {activeCaesar && <RoleBadge uppercase>{activeCaesar[0]}</RoleBadge>}
          <Typography variant="h4">Transactions</Typography>
          <Typography variant="body2" color="primary">
            Show Transactions for this account's Caesar Accounts
          </Typography>
          <Box my={2}>
            <Divider />
          </Box>

          <CaesarTabs
            onActiveCaesarChange={(activeCaesar) => {
              setActiveCaesar(activeCaesar)
            }}
          />
        </Box>

        <div
          ref={(ref) => {
            if (ref) {
              setRefElement(ref)
            }
          }}
          style={{
            marginTop: 16,
            flexGrow: 1,
            overflow: 'hidden',
          }}
        >
          {activeCaesar && activeCaesar[1] ? (
            <TransactionsTable height={currentHeight} as="all" caesar={activeCaesar[1]} />
          ) : (
            <Box height="100%">
              <LoadingScreen2 />
            </Box>
          )}
        </div>
      </Paper>
      <style>
        {/* {`
      
      .layout-content{
          display: flex;
          flex-direction: column;
          
        }`} */}
      </style>
    </Container>
  )
}

const reduceForAccountType = ({
  id,
  unit_price,
  selling_price,
  seller_profit,
  buying_account,
  selling_account,
  buyer,
  seller,
  inventory_from,
  created_at,
  sales_price,
}: TransactionResponse) => ({
  id,
  inventory_from,

  seller: seller.description,

  // unit_price,
  // selling_price,

  buyer: buyer.description,
  // amount: `${sales_price} CCoins`,
  amount: sales_price,

  transaction_date: `${new Date(created_at).toLocaleTimeString()} - ${new Date(
    created_at
  ).toLocaleDateString()}`,
})
