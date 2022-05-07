/* eslint-disable react/no-unescaped-entities */

/**
 * Includes transactions and pending Transactions
 */

import { Box, Container, Divider, Paper, Theme, Typography, useTheme } from '@material-ui/core'
import CaesarTabs from '@src/components/CaesarTabs'
import RoleBadge from '@src/components/RoleBadge'
import { UserTypes } from '@src/redux/data/userSlice'
import { TransactionResponse } from '@src/utils/api/transactionApi'
import { useCallback, useEffect, useState } from 'react'
import TransactionsTable from '@src/components/pages/transactions/TransactionsTable'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import PendingTransactionsTable from '@src/components/pages/pending-transactions/PendingTransactionsTable'
import { grey } from '@material-ui/core/colors'
// import useResizeListener from '@hooks/useResizeListener'

type ReducedTransactionResponse = ReturnType<typeof reduceForAccountType>
export default function TransactionsPage() {
  const theme: Theme = useTheme()
  const [activeCaesar, setActiveCaesar] = useState<[UserTypes, string] | undefined>()
  const [caesarLoading, setCaesarLoading] = useState<boolean>(true)
  // const refElement = useRef<HTMLDivElement>(null)
  // const [refElement, setRefElement] = useState<HTMLDivElement | null>(null)
  // const [refElement2, setrefElement2] = useState<HTMLDivElement | null>(null)
  // const target: keyof HTMLDivElement = 'clientHeight'

  // const { refElementState } = useResizeListener({
  //   refElement,
  //   target,
  // })
  // const [currentHeight, setCurrentHeight] = useState<number>(0)

  // useEffect(() => {
  //   if (refElement?.clientHeight) {
  //     setCurrentHeight(refElement.clientHeight)
  //   }
  //   if (refElementState) {
  //     setCurrentHeight(refElementState as number)
  //   }
  // }, [refElement?.clientHeight, refElementState])

  const onActiveCaesarChange = useCallback((activeCaesar) => {
    setActiveCaesar(activeCaesar)
  }, [])

  const syncLoading = useCallback((isLoading) => {
    setCaesarLoading(isLoading)
  }, [])

  return (
    <Container maxWidth="lg" disableGutters>
      <Box
        style={{
          display: 'grid',
          gap: 16,
        }}
      >
        <CaesarTabs
          onActiveCaesarChange={onActiveCaesarChange}
          renderTitle={
            <Box textAlign="center">
              <Typography variant="h4">Caesar Account</Typography>
              <Typography variant="body2" color="primary">
                Select Caesar Account to use
              </Typography>
            </Box>
          }
          syncLoading={syncLoading}
        />

        <Paper
          style={{
            padding: 16,
            height: '100%',
          }}
        >
          <Box>
            {activeCaesar && <RoleBadge uppercase>{activeCaesar[0]}</RoleBadge>}
            <Typography variant="h4">Transactions</Typography>
            <Typography variant="body2" color="primary">
              Show Transactions for this account's Caesar Account/s
            </Typography>
            <Box my={2}>
              <Divider />
            </Box>
          </Box>

          <div
            // ref={(ref) => {
            //   if (ref) {
            //     setRefElement(ref)
            //   }
            // }}
            style={{
              // marginTop: 16,
              flexGrow: 1,
              overflow: 'hidden',
            }}
          >
            {activeCaesar && activeCaesar[1] && !caesarLoading && (
              <TransactionsTable height={400} as="all" caesar={activeCaesar[1]} />
            )}

            {caesarLoading && (
              <Box height="100%">
                <LoadingScreen2 />
              </Box>
            )}
            {!activeCaesar && !caesarLoading && <NoCaesarFound />}
          </div>
        </Paper>

        <Paper
          style={{
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box>
            {activeCaesar && <RoleBadge uppercase>{activeCaesar[0]}</RoleBadge>}
            <Typography variant="h4">Pending Transactions</Typography>
            <Typography variant="body2" color="primary">
              Transactions Awaiting Approval
            </Typography>
            <Box my={2}>
              <Divider />
            </Box>
          </Box>

          {activeCaesar && activeCaesar[1] && !caesarLoading && (
            <PendingTransactionsTable height={400} as={activeCaesar[0]} caesar={activeCaesar[1]} />
          )}
          {caesarLoading && (
            <Box height="100%">
              <LoadingScreen2 />
            </Box>
          )}
          {!activeCaesar && !caesarLoading && <NoCaesarFound />}
        </Paper>
      </Box>
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

const NoCaesarFound = () => {
  const theme = useTheme()
  return (
    <Box
      style={{
        background: theme.palette.type === 'dark' ? grey['900'] : grey['200'],
        padding: 16,
        textAlign: 'center',
      }}
    >
      <Typography color="textSecondary" variant="h6">
        No Caesar Found
      </Typography>
    </Box>
  )
}
