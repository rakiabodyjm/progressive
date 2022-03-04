import { Box, ButtonBase, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import { DspResponseType, getDsp } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function RetailerAccountSummaryCard({
  retailer,
}: {
  retailer: RetailerResponseType
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>()

  useEffect(() => {
    setIsExpanded(false)
  }, [setIsExpanded])
  const theme: Theme = useTheme()
  const classes = useStyles()

  return (
    <Paper
      style={{
        background: theme.palette.background.paper,
      }}
      variant="outlined"
    >
      <Grid container>
        <Box className={classes.accountInfo} p={2}>
          <Typography
            style={{
              marginBottom: theme.spacing(2),
            }}
            variant="h5"
          >
            Retailer Account Summary
          </Typography>
          {isExpanded &&
            retailer &&
            retailerFieldsFull(retailer).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
          {!isExpanded &&
            retailer &&
            retailerFieldsSimple(retailer).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
        </Box>
        {isExpanded && (
          <ButtonBase
            style={{
              display: 'flex',
              width: '100%',
              padding: 4,
            }}
            onClick={() => setIsExpanded(false)}
          >
            <KeyboardArrowUp />
          </ButtonBase>
        )}
        {!isExpanded && (
          <ButtonBase
            style={{
              display: 'flex',
              width: '100%',
              padding: 4,
            }}
            onClick={() => setIsExpanded(true)}
          >
            <KeyboardArrowDown />
          </ButtonBase>
        )}
      </Grid>
    </Paper>
  )
}

const retailerFieldsFull = ({
  id,
  caesar_wallet,
  e_bind_number,
  store_name,
  user,
  dsp,
  subdistributor,
}: RetailerResponseType) => [
  {
    key: 'Retailer ID',
    value: id,
  },
  {
    key: 'Caesar Wallet ID',
    value: caesar_wallet?.id ? caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'E Bind Number',
    value: e_bind_number,
  },
  {
    key: `Store Name`,
    value: store_name,
  },

  {
    key: 'User',
    value: user ? `${user?.last_name}, ${user?.first_name}` : '',
  },
  {
    key: 'Attending DSP',
    // value: dsp?.user?.first_name || '     ',
    value: dsp?.dsp_code,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
]
const retailerFieldsSimple = ({
  id,
  e_bind_number,
  store_name,
  subdistributor,
}: RetailerResponseType) => [
  {
    key: 'Retailer ID',
    value: id,
  },
  {
    key: 'E Bind Number',
    value: e_bind_number,
  },
  {
    key: `Store Name`,
    value: store_name,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
]
