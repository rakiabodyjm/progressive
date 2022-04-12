import { CaesarBank } from '@src/utils/types/CashTransferTypes'
import { useEffect, useState } from 'react'
import { Box, Chip, IconButton, Paper } from '@material-ui/core'
import { AddOutlined, CloseOutlined, PhonePausedRounded } from '@material-ui/icons'
import FormNumberField from '@src/components/FormNumberField'
import FormLabel from '@src/components/FormLabel'

const FeesTransaction = ({
  caesar_bank,
  onChange,
}: {
  caesar_bank: CaesarBank
  onChange: (bank_fee: number | undefined) => void
}) => {
  const [feesForm, setFeesForm] = useState<{ value: undefined | number }>({
    value: undefined,
  })
  const [visible, setVisible] = useState<boolean>(false)

  useEffect(() => {
    if (typeof feesForm.value === 'number') {
      onChange(feesForm.value)
    }
  }, [feesForm.value])

  useEffect(() => {
    if (!visible && onChange) {
      onChange(undefined)
    }
  }, [visible])
  return (
    <Box>
      <Chip
        avatar={
          <IconButton>
            <AddOutlined />
          </IconButton>
        }
        style={{
          display: visible ? 'none' : undefined,
        }}
        onClick={() => {
          setVisible(true)
        }}
        label="Add Bank Fees"
      />
      <Box my={2} />
      {visible && (
        <Box>
          <Paper>
            <Box p={2}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <FormLabel>{caesar_bank.bank.name} Fees</FormLabel>
                <IconButton
                  style={{
                    padding: 2,
                    marginBottom: 8,
                  }}
                  onClick={() => {
                    setVisible(false)
                  }}
                >
                  <CloseOutlined
                    style={{
                      fontSize: 16,
                    }}
                  />
                </IconButton>
              </Box>

              <FormNumberField
                onChange={(amount) => {
                  setFeesForm((prev) => ({
                    ...prev,
                    value: amount,
                  }))
                }}
                value={feesForm.value}
              />
            </Box>
          </Paper>
        </Box>
      )}
    </Box>
  )
}

export default FeesTransaction
