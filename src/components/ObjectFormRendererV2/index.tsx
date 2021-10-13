import { Box, TextField, TextFieldProps, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import { formatKeyIntoReadables } from '@src/utils/api/common'
import React, { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from 'react'
import deepEqual from '@src/utils/deepEqual'

const RenderKeyValue = memo(
  function RenderKeyValue({
    field,
    defaultValue,
    highlight,
    onChange,
    value,
    variant,
  }: {
    field: string | number | symbol
    defaultValue: string | number | Date
    highlight?: 'key' | 'value'
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    value: string | number
    variant: TextFieldProps['variant']
  }) {
    return (
      <>
        <Typography
          component="label"
          color={highlight === 'key' ? 'primary' : undefined}
          variant="body2"
        >
          {formatKeyIntoReadables(field as string)}
        </Typography>
        <TextField
          variant={variant || 'standard'}
          size="small"
          name={field as string}
          value={value}
          fullWidth
          onChange={onChange}
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
}: {
  fields: Record<any, any>
  spacing?: number
  highlight?: 'key' | 'value'
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  variant?: TextFieldProps['variant']
}) {
  const fieldsToRender = useRef(fields)
  return (
    <>
      {Object.keys(fieldsToRender.current).map(
        (key) =>
          typeof fieldsToRender.current[key] === 'string' && (
            <Box key={key} mb={spacing}>
              <RenderKeyValue
                onChange={onChange}
                highlight={highlight}
                field={key}
                defaultValue={fieldsToRender?.current[key] || ''}
                value={fields[key]}
                variant={variant}
              />
            </Box>
          )
      )}
    </>
  )
}
