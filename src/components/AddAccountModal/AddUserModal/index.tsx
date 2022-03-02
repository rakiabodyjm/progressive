import { Tooltip, Typography, IconButton } from '@material-ui/core'
import { AddCircleOutlined } from '@material-ui/icons'
import { useState } from 'react'
import AddAccountModal from '..'

export default function AddUserModal() {
  const [addAccountModalOpen, setAddAccountModalOpen] = useState<boolean>(false)
  return (
    <>
      <Tooltip
        title={<Typography variant="subtitle2">Add User Account</Typography>}
        arrow
        placement="left"
      >
        <IconButton
          onClick={() => {
            setAddAccountModalOpen(true)
          }}
        >
          <AddCircleOutlined />
        </IconButton>
      </Tooltip>
      {addAccountModalOpen && (
        <AddAccountModal
          open={addAccountModalOpen}
          handleClose={() => setAddAccountModalOpen(false)}
        />
      )}
    </>
  )
}
