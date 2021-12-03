import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  PaperProps,
  Tooltip,
  Typography,
  useTheme,
} from '@material-ui/core'
import { UserTypes } from '@src/redux/data/userSlice'
import { getWallet } from '@src/utils/api/walletApi'
import deepEqual from '@src/utils/deepEqual'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { useEffect, useState, memo } from 'react'

export default memo(
  function WalletSummaryCard({
    entities, // { subdistributor: ID, retailer: ID, user: ID}
    ...restProps
  }: { entities: Partial<Record<UserTypes, string>> } & PaperProps) {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [ceasarAmount, setCeasarAmount] = useState<number>(0)
    const theme = useTheme()
    const dispatchError = useErrorNotification()
    useEffect(() => {
      if (entities) {
        Object.entries(entities).forEach(([key, id]) => {
          getWallet({
            [key]: id,
          })
            .then((res) => {
              setCeasarAmount((prevState) => prevState + (res?.data?.ceasar_coin || 0))
            })
            .catch((err: string[]) => {
              console.log(`Error retrieving wallet for ${key}, wallet may not exist`, err)

              // err.forEach((each) => {
              //   dispatchError(each)
              // })
            })
            .finally(() => {
              setIsLoading(false)
            })
        })
      }
    }, [entities])
    return (
      <Paper variant="outlined" {...restProps} style={{ height: 153 }}>
        <Box {...(isLoading && { textAlign: 'center' })} p={2} pt={1}>
          {isLoading ? (
            <CircularProgress size={theme.typography.h3.fontSize} color="primary" />
          ) : (
            <>
              <Grid container>
                <Grid item xs={8}>
                  <Typography noWrap variant="h5" style={{}}>
                    Wallet
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                    }}
                    color="primary"
                    variant="body1"
                  >
                    🟡
                    <span
                      style={{
                        marginLeft: 8,
                        marginRight: 8,
                      }}
                    >
                      {ceasarAmount || 0}
                    </span>
                    <Typography component="span" variant="body1" noWrap>
                      Ceasar Coins
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Box
                    display="flex"
                    height="100%"
                    justifyContent="flex-end"
                    alignItems="flex-start"
                    pt={0.5}
                  >
                    <Typography
                      style={{
                        padding: '2px 8px',
                        border: `1px solid ${theme.palette.primary.main}`,
                        borderRadius: 4,
                      }}
                      color="primary"
                      display="inline"
                      variant="body2"
                    >
                      OVERALL
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <div
                style={{
                  marginBottom: 16,
                }}
              />
              <Grid container>
                <Grid item xs={6}>
                  <Typography variant="h6">Dollar: </Typography>
                  <Typography
                    color="primary"
                    style={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    $0.00
                    {/* {data?.retailer?.length || 0} */}
                    {/* {data?} */}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Peso: </Typography>
                  <Typography
                    color="primary"
                    style={{
                      fontWeight: 700,
                    }}
                    variant="subtitle2"
                  >
                    ₱0.00
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Paper>
    )
  },
  (prevProps, nextProps) => deepEqual(prevProps, nextProps)
)
