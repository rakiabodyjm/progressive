import { Box, ButtonBase, Grid, Paper, Theme, Typography } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { makeStyles, useTheme } from '@material-ui/styles'
import { DspResponseType } from '@src/utils/api/dspApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { useEffect, useState } from 'react'

const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))
export default function DSPAccountSummaryCard({ dsp }: { dsp: DspResponseType }) {
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
            DSP Account Summary
          </Typography>
          {isExpanded &&
            dsp &&
            dspFieldsFull(dsp).map(({ key, value }) => (
              <div key={key}>
                <Typography color="primary" variant="body2">
                  {key}:
                </Typography>
                <Typography variant="body1">{value}</Typography>
              </div>
            ))}
          {!isExpanded &&
            dsp &&
            dspFieldsSimple(dsp).map(({ key, value }) => (
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

const dspFieldsFull = ({
  id,
  caesar_wallet,
  user,
  dsp_code,
  e_bind_number,
  area_id,
  subdistributor,
}: DspResponseType) => [
  {
    key: 'DSP ID',
    value: id,
  },
  {
    key: 'Caesar Wallet ID',
    value: caesar_wallet?.id ? caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'E-Bind Number',
    value: e_bind_number,
  },
  {
    key: 'DSP Code',
    value: dsp_code,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
  {
    key: 'Area ID',
    value: area_id?.length > 0 ? area_id.map((ea) => ea.area_name).join(', ') : '',
    // value: subdistributor.area_id?.area_name || '',
  },
  {
    key: 'User',
    value: user ? `${user?.last_name}, ${user?.first_name}` : '',
  },
]
const dspFieldsSimple = ({ id, dsp_code, e_bind_number, subdistributor }: DspResponseType) => [
  {
    key: 'DSP ID',
    value: id,
  },
  {
    key: 'E-Bind Number',
    value: e_bind_number,
  },
  {
    key: 'DSP Code',
    value: dsp_code,
  },
  {
    key: 'Subdistributor',
    value: subdistributor?.name || '',
  },
]
