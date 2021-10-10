import { Box, BoxProps, Paper, Theme, Typography } from '@material-ui/core'
import { useTheme } from '@material-ui/styles'
import userApi from '@src/utils/api/userApi'
import { useMemo } from 'react'
import validator from 'validator'
import { nanoid } from '@reduxjs/toolkit'

export default function ObjectRenderer<T>({ fields }: { fields: T }) {
  const accountFields: { field: string; value: any }[] | undefined = useMemo(() => {
    if (fields) {
      /**
       * Casted into Array which contains keyof type T
       */
      return (Object.keys(fields) as Array<keyof T>).map((fieldKey) => ({
        field: fieldKey as string,
        value: fields[fieldKey],
      }))
    }
    return undefined
  }, [fields])
  return (
    <Box>
      {accountFields &&
        accountFields.map(({ field, value }) => (
          <Box key={field} pb={2}>
            <Paper variant="outlined">
              <Box display="flex" p={1} key={field}>
                <RenderKeyValue keyHighlighted key={field} field={field} value={value} />
              </Box>
            </Paper>
          </Box>
        ))}
    </Box>
  )
}
/**
 * Iterates through object to extract string values
 * @param param0
 */
const RenderObject = ({
  object,
  ...restProps
}: {
  object: { [x: string]: unknown }
} & BoxProps) => (
  <Box {...restProps} className="render-object" display="block">
    {object &&
      Object.keys(object).map((key) => (
        <RenderKeyValue key={key} field={key} value={object[key] as object} />
      ))}
  </Box>
)

/**
 *
 * @param param
 * @returns {boolean}
 */
const isValueObject = (param: object | string) =>
  param !== null && !Array.isArray(param) && typeof param === 'object'
/**
 *
 * @param param
 * @returns {boolean}
 */
const isValueString = (param: any) =>
  (param !== null && typeof param === 'string') ||
  typeof param === 'boolean' ||
  typeof param === 'number'

const isValueArray = (param: any) => param !== null && Array.isArray(param)
/**
 * Format Value into human readable format
 *
 * @param param
 * @returns
 */
const formatValue = (param: any): string => {
  if (typeof param === 'string' && param.length > 10 && validator.isISO8601(param as string)) {
    return new Date(param).toString()
  }
  if (typeof param === 'boolean') {
    return param === true ? 'yes' : 'no'
  }
  return param
}

const RenderKeyValue = ({
  field,
  value,
  keyHighlighted,
}: {
  field: string
  value: any
  keyHighlighted?: true | never
}) => {
  const theme: Theme = useTheme()

  return (
    <Box
      className="render-key-value"
      width="100%"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: isValueObject(value) ? 'column' : undefined,
      }}
    >
      <Typography
        style={{
          color: isValueObject(value) || keyHighlighted ? theme.palette.primary.main : undefined,
        }}
      >
        {`${userApi.formatKeyIntoReadables(field)}: `}
      </Typography>
      {isValueObject(value) && (
        <RenderObject
          object={value}
          style={{
            marginTop: 16,
            marginLeft: 16,
          }}
        />
      )}

      {isValueString(value) && (
        <Typography
          style={{
            marginLeft: 8,
          }}
        >
          {value && formatValue(value)}
        </Typography>
      )}

      {isValueArray(value) && (
        <div
          style={{
            marginTop: theme.spacing(2),
          }}
        >
          {(value as any[]).map((ea: any) => (
            <div key={nanoid()}>
              {isValueObject(ea) ? (
                <RenderObject object={ea as { [x: string]: any }} />
              ) : (
                <Typography
                  style={{
                    marginLeft: 8,
                  }}
                >
                  {ea}
                </Typography>
              )}
            </div>
          ))}
        </div>
      )}
    </Box>
  )
}
