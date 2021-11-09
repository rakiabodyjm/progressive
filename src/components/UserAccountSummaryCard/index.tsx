import { Paper, Box, Typography, ButtonBase } from '@material-ui/core'
import { KeyboardArrowDown } from '@material-ui/icons'
import { UserResponse } from '@src/utils/api/userApi'
import { useState } from 'react'

export default function UserAccountSummaryCard({
  account,
  isAccordion,
}: {
  account: UserResponse | undefined
  isAccordion?: true | never
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  return (
    <Paper
      style={{
        height: '100%',
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
        {account &&
          userAccountFields(account).map(({ key, value }) => (
            <Box mb={1} key={key}>
              <Typography color="primary" variant="body2">
                {key}:
              </Typography>
              <Typography variant="body1">{value}</Typography>
            </Box>
          ))}
      </Box>
      {isAccordion && (
        <ButtonBase
          style={{
            display: 'flex',
            width: '100%',
            padding: 4,
          }}
        >
          <KeyboardArrowDown />
        </ButtonBase>
      )}
    </Paper>
  )
}

const userAccountFields = (params: UserResponse) => [
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
