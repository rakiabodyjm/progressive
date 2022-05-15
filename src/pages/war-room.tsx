import { Box, Container, Divider, Grid, Paper, Typography } from '@material-ui/core'
import FormLabel from '@src/components/FormLabel'
import { LoadingScreen2 } from '@src/components/LoadingScreen'
import RoleBadge from '@src/components/RoleBadge'
import { CashTransferResponse } from '@src/utils/types/CashTransferTypes'
import { Paginated } from '@src/utils/types/PaginatedEntity'
import axios from 'axios'
import { useMemo } from 'react'
import useSWR from 'swr'

export default function WarRoom() {
  const { data } = useSWR<Paginated<CashTransferResponse>>(`/cash-transfer`, (url) =>
    axios
      .get<Paginated<CashTransferResponse>>(url)
      .then((res) => res.data)
      .then(async (res) => ({
        metadata: res.metadata,
        data: await Promise.all(
          res.data.map(
            async (ea) =>
              ({
                ...ea,
                ...(ea?.caesar_bank_from && {
                  caesar_bank_from: {
                    ...ea.caesar_bank_from,
                    caesar: {
                      ...(await axios
                        .get(`/caesar/${ea?.caesar_bank_from?.caesar?.id}`)
                        .then((res) => res.data)),
                    },
                  },
                }),
                ...(ea?.caesar_bank_to && {
                  caesar_bank_to: {
                    ...ea.caesar_bank_to,
                    caesar: {
                      ...(await axios
                        .get(`/caesar/${ea?.caesar_bank_to?.caesar?.id}`)
                        .then((res) => res.data)),
                    },
                  },
                }),
              } as CashTransferResponse)
          )
        ),
      }))
      .then((res) => res)
  )
  const { data: cashTransfers } = useMemo(() => data || { data: [] }, [data])
  if (!data) {
    return <LoadingScreen2 />
  }
  return (
    <>
      <Container maxWidth="md">
        {/* {JSON.stringify(cashTransfers, null, 2)} */}
        <Box display="grid" gridRowGap={16}>
          {cashTransfers?.map((ea) => (
            <Paper variant="outlined">
              <Grid spacing={2} container>
                <Grid item xs={3}>
                  <Box p={2}>
                    <FormLabel>{ea?.caesar_bank_from ? 'From Bank' : 'From Caesar'}</FormLabel>
                    <Typography variant="h6">
                      {ea?.caesar_bank_from?.description ||
                        ea?.caesar_bank_from?.account_number ||
                        ea?.from?.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ea?.caesar_bank_from?.caesar?.description}
                    </Typography>
                    <FormLabel variant="caption">Remaining Balance:</FormLabel>
                    <Typography variant="body2" color="textSecondary">
                      {ea?.remaining_balance_from}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Divider
                    style={{
                      margin: 'auto',
                    }}
                    orientation="vertical"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box
                    p={2}
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <RoleBadge>{ea?.as}</RoleBadge>
                    <FormLabel>Amount: </FormLabel>
                    <Typography variant="h6">{ea.amount}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={1}>
                  <Divider
                    style={{
                      margin: 'auto',
                    }}
                    orientation="vertical"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Box p={2}>
                    <FormLabel>{ea?.caesar_bank_to ? 'To Bank' : 'To Caesar'}</FormLabel>
                    <Typography variant="h6">
                      {ea?.caesar_bank_to?.description ||
                        ea?.caesar_bank_to?.account_number ||
                        ea?.to?.description}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {ea?.caesar_bank_to?.caesar?.description}
                    </Typography>
                    <FormLabel variant="caption">Remaining Balance:</FormLabel>
                    <Typography variant="body2" color="textSecondary">
                      {ea?.remaining_balance_to}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </Container>
    </>
  )
}
