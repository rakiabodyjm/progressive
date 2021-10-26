import { TextField, Typography } from '@material-ui/core'
import type { RenderTextField } from '@src/components/AutoFormRenderer'
import { formatKeyIntoReadables } from '@src/utils/api/common'

export default function CustomTextField(customTextFieldProps: Omit<RenderTextField, 'type'>) {
  const { label, name, value, onChange, props } = customTextFieldProps
  return (
    <>
      <Typography className="label">{label || formatKeyIntoReadables(name)}</Typography>
      <TextField
        size="small"
        variant={props?.variant || 'outlined'}
        {...props}
        name={name}
        onChange={(e) => {
          onChange(e.target.name, e.target.value)
        }}
        value={value}
        fullWidth
      />
    </>
  )
}
