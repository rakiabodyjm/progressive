import { Box, Typography } from '@material-ui/core'
import { formatKeyIntoReadables } from '@src/utils/api/common'
import { useMemo } from 'react'
import validator from 'validator'

const isArray = (isArrayParam: any) =>
  typeof isArrayParam === 'object' && Array.isArray(isArrayParam)
const isObject = (param: any) => typeof param === 'object' && param instanceof Object

function RenderKeyValue({
  field,
  value,
  highlight,
}: {
  field: string | number | symbol
  value: string | number | Date
  highlight?: 'key' | 'value'
}) {
  const formatValue = useMemo(() => {
    if (typeof value === 'string' && value.length > 10 && validator.isISO8601(value)) {
      return new Date(value).toString()
    }
    return value
  }, [value])
  return (
    <>
      <Typography color={highlight === 'key' ? 'primary' : undefined} variant="body2">
        {formatKeyIntoReadables(field as string)}
      </Typography>
      <Typography color={highlight === 'value' ? 'primary' : undefined} variant="body1">
        {formatValue}
      </Typography>
    </>
  )
}

export default function AestheticObjectRenderer({
  fields,
  spacing,
  highlight,
  renderObject,
}: {
  fields: Record<any, any>
  spacing?: number
  highlight?: 'key' | 'value'
  renderObject?: boolean
}) {
  return (
    <>
      {Object.keys(fields).map(
        (key) =>
          (typeof fields[key] === 'string' && (
            <Box key={key} mb={spacing}>
              <RenderKeyValue highlight={highlight} key={key} field={key} value={fields[key]} />
            </Box>
          )) ||
          (renderObject === true && isObject(fields[key]) && !isArray(fields[key]) && (
            <Box mb={spacing}>
              {/* <Paper variant="outlined"> */}
              <Typography variant="body1" color="primary">
                {formatKeyIntoReadables(key)}:
              </Typography>
              <Box mt={1} pl={2}>
                {/* <Divider
                  style={{
                    marginTop: spacing ? spacing * 8 : 8,
                    marginBottom: spacing ? spacing * 8 : 8,
                  }}
                /> */}
                <AestheticObjectRenderer fields={fields[key]} spacing={1} highlight="key" />
              </Box>
              {/* </Paper> */}
            </Box>
          ))
      )}
    </>
  )
}
