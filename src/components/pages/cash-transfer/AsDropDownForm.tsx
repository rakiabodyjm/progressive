import FormTextField from '@src/components/FormTextField'
import { CashTransferAs } from '@src/utils/types/CashTransferTypes'
import { ChangeEvent } from 'react'

const AsDropDown = ({
  onChange,
  value,
  disabledKeys,
}: {
  value?: CashTransferAs
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  disabledKeys?: (keyof typeof CashTransferAs)[]
}) => (
  <FormTextField
    select
    name="as"
    onChange={onChange}
    SelectProps={{
      native: true,
    }}
    value={value}
    {...(value && { value })}
  >
    <option key="default-value" value={value}>
      {value}
    </option>
    {Object.values(CashTransferAs)
      .filter((ea) =>
        disabledKeys ? !disabledKeys.includes(ea as keyof typeof CashTransferAs) : true
      )
      .map((type) => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
  </FormTextField>
)

export default AsDropDown
