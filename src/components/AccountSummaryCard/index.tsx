import {
  Box,
  ButtonBase,
  Grid,
  makeStyles,
  Paper,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import { KeyboardArrowUp, KeyboardArrowDown } from '@material-ui/icons'
import { AdminResponseType } from '@src/utils/api/adminApi'
import { DspResponseType } from '@src/utils/api/dspApi'
import { RetailerResponseType } from '@src/utils/api/retailerApi'
import { SubdistributorResponseType } from '@src/utils/api/subdistributorApi'
import { UserResponse } from '@src/utils/api/userApi'
import { useState, useEffect } from 'react'
const useStyles = makeStyles((theme: Theme) => ({
  accountInfo: {
    '& > *': {
      marginBottom: theme.spacing(1),
    },
  },
}))

export default function AccountSummaryCard({
  account,
  role,
}: {
  account?: UserResponse
  role: string
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>()

  useEffect(() => {
    setIsExpanded(false)
  }, [setIsExpanded])
  const theme: Theme = useTheme()
  const classes = useStyles()
  return (
    <div>
      <Paper
        style={{
          background: theme.palette.background.paper,
        }}
        variant="outlined"
      >
        <Grid container>
          <Box className={classes.accountInfo} p={2}>
            {role === account?.id && (
              <>
                <Typography
                  style={{
                    marginBottom: theme.spacing(2),
                  }}
                  variant="h5"
                >
                  User Account Summary
                </Typography>
                {isExpanded &&
                  account &&
                  userAccountFieldsFull(account).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                {!isExpanded &&
                  account &&
                  userAccountFieldsSimple(account).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
              </>
            )}
            {role === account?.admin?.id && (
              <>
                <Typography
                  style={{
                    marginBottom: theme.spacing(2),
                  }}
                  variant="h5"
                >
                  Admin Account Summary
                </Typography>
                {isExpanded &&
                  account &&
                  adminFieldsExpanded(account.admin).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                {!isExpanded &&
                  account &&
                  adminFieldsNotExpanded(account.admin).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
              </>
            )}
            {role === account?.subdistributor?.id && (
              <>
                <Typography
                  style={{
                    marginBottom: theme.spacing(2),
                  }}
                  variant="h5"
                >
                  Subdistributor Account Summary
                </Typography>
                {isExpanded &&
                  account &&
                  subdistributorFieldsFull(account.subdistributor).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                {!isExpanded &&
                  account &&
                  subdistributorFieldsSimple(account.subdistributor).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
              </>
            )}
            {role === account?.dsp?.id && (
              <>
                <Typography
                  style={{
                    marginBottom: theme.spacing(2),
                  }}
                  variant="h5"
                >
                  DSP Account Summary
                </Typography>
                {isExpanded &&
                  account &&
                  dspFieldsFull(account.dsp).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                {!isExpanded &&
                  account &&
                  dspFieldsSimple(account.dsp).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
              </>
            )}
            {role === account?.retailer?.id && (
              <>
                <Typography
                  style={{
                    marginBottom: theme.spacing(2),
                  }}
                  variant="h5"
                >
                  Retailer Account Summary
                </Typography>
                {isExpanded &&
                  account &&
                  retailerFieldsFull(account.retailer).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
                {!isExpanded &&
                  account &&
                  retailerFieldsSimple(account.retailer).map(({ key, value }) => (
                    <Box mb={1} key={key}>
                      <Typography color="primary" variant="body2">
                        {key}:
                      </Typography>
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  ))}
              </>
            )}
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
              onClick={() => {
                setIsExpanded(true)
              }}
            >
              <KeyboardArrowDown />
            </ButtonBase>
          )}
        </Grid>
      </Paper>
    </div>
  )
}
const adminFieldsExpanded = (admin: AdminResponseType) => [
  {
    key: 'Admin ID',
    value: admin.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: admin.caesar_wallet?.id ? admin.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'Name',
    value: admin.name,
  },

  {
    key: 'User',
    // value: subdistributor.e_bind_number,
    value: `${admin?.user?.first_name} ${admin?.user?.last_name}`,
  },
]

const adminFieldsNotExpanded = (admin: AdminResponseType) => [
  {
    key: 'Admin ID',
    value: admin.id,
  },
  {
    key: 'User',
    // value: subdistributor.e_bind_number,
    value: `${admin?.user?.first_name} ${admin?.user?.last_name}`,
  },
]
const subdistributorFieldsFull = (subdistributor: SubdistributorResponseType) => [
  {
    key: 'Subdistributor ID',
    value: subdistributor.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: subdistributor.caesar_wallet?.id ? subdistributor.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'Subdistributor',
    value: subdistributor.name,
  },

  {
    key: 'E-Bind Number',
    value: subdistributor.e_bind_number,
  },
  {
    key: 'User',
    value: subdistributor.user?.first_name
      ? `${subdistributor.user.last_name}, ${subdistributor.user.first_name}`
      : '',
  },
  { key: 'ZIP Code', value: subdistributor?.zip_code },
  {
    key: 'Area',
    value: subdistributor.area_id?.area_name || '',
  },
  {
    key: 'Area ID',
    value: subdistributor.area_id?.area_id,
  },
]
const subdistributorFieldsSimple = (subdistributor: SubdistributorResponseType) => [
  {
    key: 'Subdistributor ID',
    value: subdistributor.id,
  },
  {
    key: 'Subdistributor',
    value: subdistributor.name,
  },

  {
    key: 'E-Bind Number',
    value: subdistributor.e_bind_number,
  },
  {
    key: 'Area',
    value: subdistributor.area_id?.area_name || '',
  },
]
const dspFieldsFull = (dsp: DspResponseType) => [
  {
    key: 'DSP ID',
    value: dsp.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: dsp.caesar_wallet?.id ? dsp.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'E-Bind Number',
    value: dsp.e_bind_number,
  },
  {
    key: 'DSP Code',
    value: dsp.dsp_code,
  },
  {
    key: 'Subdistributor',
    value: dsp.subdistributor?.name || '',
  },
  {
    key: 'Area ID',
    value: dsp.area_id?.length > 0 ? dsp.area_id.map((ea) => ea.area_name).join(', ') : '',
  },
  {
    key: 'User',
    value: dsp.user ? `${dsp.user?.last_name}, ${dsp.user?.first_name}` : '',
  },
]
const dspFieldsSimple = (dsp: DspResponseType) => [
  {
    key: 'DSP ID',
    value: dsp.id,
  },
  {
    key: 'E-Bind Number',
    value: dsp.e_bind_number,
  },
  {
    key: 'DSP Code',
    value: dsp.dsp_code,
  },
  {
    key: 'Subdistributor',
    value: dsp.subdistributor?.name || '',
  },
]
const retailerFieldsFull = (retailer: RetailerResponseType) => [
  {
    key: 'Retailer ID',
    value: retailer.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: retailer.caesar_wallet?.id ? retailer.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'E Bind Number',
    value: retailer.e_bind_number,
  },
  {
    key: `Store Name`,
    value: retailer.store_name,
  },

  {
    key: 'User',
    value: retailer.user ? `${retailer.user?.last_name}, ${retailer.user?.first_name}` : '',
  },
  {
    key: 'Attending DSP',
    value: retailer.dsp?.dsp_code,
  },
  {
    key: 'Subdistributor',
    value: retailer.subdistributor?.name || '',
  },
]
const retailerFieldsSimple = (retailer: RetailerResponseType) => [
  {
    key: 'Retailer ID',
    value: retailer.id,
  },
  {
    key: 'E Bind Number',
    value: retailer.e_bind_number,
  },
  {
    key: `Store Name`,
    value: retailer.store_name,
  },
  {
    key: 'Subdistributor',
    value: retailer.subdistributor?.name || '',
  },
]
const userAccountFieldsFull = (params: UserResponse) => [
  {
    key: 'User ID',
    value: params.id,
  },
  {
    key: 'Caesar Wallet ID',
    value: params.caesar_wallet?.id ? params.caesar_wallet?.id : 'No Caesar Wallet',
  },
  {
    key: 'Name',
    value: `${params.first_name} ${params.last_name}`,
  },
  {
    key: 'Contact Number',
    value: params.phone_number,
  },
  {
    key: 'Email Address',
    value: params.email,
  },
  {
    key: 'Username',
    value: params.username,
  },
  {
    key: 'Primary Address',
    value: params.address1,
  },
  {
    key: 'Secondary Address',
    value: params?.address2 || null,
  },
]
const userAccountFieldsSimple = (params: UserResponse) => [
  {
    key: 'User ID',
    value: params.id,
  },
  {
    key: 'Name',
    value: `${params.first_name} ${params.last_name}`,
  },
  {
    key: 'Contact Number',
    value: params.phone_number,
  },
  {
    key: 'Email Address',
    value: params.email,
  },
]
