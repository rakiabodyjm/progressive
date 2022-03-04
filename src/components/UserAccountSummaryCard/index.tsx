import { Paper, Box, Typography, ButtonBase, IconButton } from '@material-ui/core'
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons'
import { UserResponse } from '@src/utils/api/userApi'
import { useEffect, useState } from 'react'

export default function UserAccountSummaryCard({ account }: { account: UserResponse | undefined }) {
  const [isExpanded, setIsExpanded] = useState<boolean>()

  useEffect(() => {
    setIsExpanded(false)
  }, [setIsExpanded])

  return (
    <Paper
      style={{
        height: 'max-content',
      }}
      variant="outlined"
    >
      <Box p={2}>
        <Typography
          style={{
            marginBottom: 16,
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
    </Paper>
  )
}

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
