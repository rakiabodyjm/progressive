import {
  Box,
  Button,
  Paper,
  Typography,
  ButtonGroup,
  ButtonBase,
  IconButton,
} from '@material-ui/core'
import { Close } from '@material-ui/icons'
import { Autocomplete, AutocompleteProps } from '@material-ui/lab'
import { makeStyles } from '@material-ui/styles'
import CreateNewSubdistributorAccount from '@src/components/pages/subdistributor/CreateSubdistributorAccount/CreateNewSubdistributorAccount'
import LinkToUserAccount from '@src/components/pages/subdistributor/CreateSubdistributorAccount/LinkToUserAccount'
import { searchUser, UserResponse } from '@src/utils/api/userApi'
import { CSSProperties, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

type Methods = 'link' | 'create'
export default function CreateSubdistributorAccount({ modal }: { modal?: () => void }) {
  const [method, setMethod] = useState<Methods>()
  return (
    <Paper variant="outlined">
      <Box
        onSubmit={(e) => {
          e.preventDefault()
        }}
        component="form"
        p={2}
      >
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h6" color="primary">
              Add Subdistributor Account
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create a new Subdistributor Account by <b>Linking</b> or by <b>Creating</b>
            </Typography>
          </Box>
          <Box>
            <IconButton
              style={{
                padding: 8,
              }}
              onClick={modal}
            >
              <Close />
            </IconButton>
          </Box>
        </Box>

        <Box display="flex" mt={2} justifyContent="center">
          <ButtonGroup disableElevation variant="outlined" color="primary">
            {[
              { label: 'Link', method: 'link' },
              {
                label: 'Create',
                method: 'create',
              },
            ].map((ea) => (
              <Button
                key={ea.method}
                onClick={() => {
                  console.log('setting method', ea.method)
                  setMethod(ea.method as Methods)
                }}
                {...(ea.method === 'create' && { disabled: true })}
                {...(ea.method === method && { variant: 'contained', color: 'primary' })}
              >
                {ea.label}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        {method && (
          <>
            {method === 'create' && <CreateNewSubdistributorAccount />}
            {method === 'link' && (
              <Paper
                style={{
                  marginTop: 16,
                }}
                variant="outlined"
              >
                <LinkToUserAccount />
              </Paper>
            )}
          </>
        )}
      </Box>
    </Paper>
  )
}
