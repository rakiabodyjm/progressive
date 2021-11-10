import { TextField, TextFieldProps } from '@material-ui/core'

export type FormTextFieldProps<T> = {
  name: keyof T
} & TextFieldProps

export default function FormTextField<T>({ name, ...restProps }: FormTextFieldProps<T>) {
  return <TextField fullWidth variant="outlined" size="small" name={name} {...restProps} />
}
