import { TextField } from '@material-ui/core'

export default function FormNumberField({
  value,
  onChange,
}: {
  value: number | undefined
  onChange: (value: number | undefined) => void
}) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      value={
        value && typeof value === 'number'
          ? new Intl.NumberFormat('en-PH', {
              currency: 'PHP',
            }).format(value as number)
          : value
      }
      onChange={(e) => {
        const numberInStringFormat = e.target.value.replace(',', '').replace(/\D/g, '')
        onChange(!e.target.value ? undefined : Number(numberInStringFormat))
      }}
    />
  )
}
