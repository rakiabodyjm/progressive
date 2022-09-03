import { Box, TextField, TextFieldProps, Typography, TypographyTypeMap } from '@material-ui/core'
import { formatKeyIntoReadables } from '@src/utils/api/common'
import React, { ChangeEvent, memo, useRef } from 'react'
import deepEqual from '@src/utils/deepEqual'

const RenderKeyValue = memo(
  function RenderKeyValue({
    field,
    // defaultValue,
    highlight,
    onChange,
    value,
    variant,
    textFieldProps,
    labelProps,
  }: {
    field: string | number | symbol
    // defaultValue: string | number | Date
    highlight?: 'key' | 'value'
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    value: string | number
    variant: TextFieldProps['variant']
    textFieldProps?: TextFieldProps
    labelProps?: TypographyTypeMap<{}, 'label'>['props']
  }) {
    return (
      <>
        <Typography
          component="label"
          color={highlight === 'key' ? 'primary' : undefined}
          variant="body2"
          {...labelProps}
        >
          {formatKeyIntoReadables(field as string)}
        </Typography>
        <TextField
          variant={variant || 'outlined'}
          size="small"
          name={field as string}
          value={value}
          fullWidth
          onChange={onChange}
          {...textFieldProps}
        />
      </>
    )
  },
  (prevProps, nextProps) => deepEqual(prevProps, nextProps)
)

export default function AestheticObjectFormRenderer({
  fields,
  spacing,
  highlight,
  onChange,
  variant,
  customProps,
}: {
  fields: Record<any, any>
  spacing?: number
  highlight?: 'key' | 'value'
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  variant?: TextFieldProps['variant']
  customProps?: Record<
    keyof typeof fields,
    {
      labelProps?: TypographyTypeMap<{}, 'label'>['props']
      textFieldProps?: TextFieldProps
    }
  >
}) {
  const fieldsToRender = useRef(fields)
  return (
    <>
      {Object.keys(fieldsToRender.current).map(
        (key) =>
          typeof fieldsToRender.current[key] === 'string' && (
            <Box key={key} mb={spacing}>
              <RenderKeyValue
                labelProps={customProps && customProps[key]?.labelProps}
                textFieldProps={customProps && customProps[key]?.textFieldProps}
                onChange={onChange}
                highlight={highlight}
                field={key}
                value={fields[key]}
                variant={variant}
              />
            </Box>
          )
      )}
    </>
  )
}
