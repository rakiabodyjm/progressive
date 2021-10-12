import { TextField, Theme, Typography, useTheme } from '@material-ui/core'

import React, { ChangeEvent, useMemo, useState } from 'react'

// type SchemaValues = string | number | boolean | Date | ObjectMutate
// type ObjectMutate<T = any> = { [x: string | number | symbol]: SchemaValues & T }
// const useStyles = makeStyles((theme) => ({
//   root: {},
// }))

function isTypeof(value: unknown, param: 'string' | 'number') {
  // eslint-disable-next-line valid-typeof
  return typeof value === param
}
const generateFields = (
  object: Record<string | number | symbol, {}>,
  currentKeyParam?: string | number | Date | boolean | null
): any[] => {
  const currentKey = currentKeyParam || ''
  return Object.keys(object)
    .map((ea) => {
      if (isTypeof(object[ea], 'string' || isTypeof(object[ea], 'number'))) {
        const returnValue = [currentKey ? `${currentKey}.${ea}` : `${ea}`, object[ea]]
        return [returnValue]
      }
      const returnValueRe = generateFields(object[ea], `${currentKey ? `${currentKey}.` : ''}${ea}`)
      return returnValueRe
    })
    .flat()
}

function objectValueMutator<T>(
  objectToMutate: Record<string | number | symbol, {}>,
  targetKeys: (string | number | symbol)[],
  value: string | number | Date | object | null
) {
  let cache = { ...objectToMutate }
  targetKeys.forEach((key, index, array) => {
    if (index === 0) {
      cache = {
        ...cache,
        [key]:
          typeof cache[key] === 'object'
            ? objectValueMutator(cache[key], targetKeys.slice(index + 1), value)
            : value,
      } as Record<string | number | symbol, {}>
    }
  })
  return cache
}

type ObjectFormRendererType = Record<string | number | symbol, {}>
export default function ObjectFormRenderer({
  schema,
  ignoreDotNotation,
  onChange,
  renderState = false,
  renderKey,
}: {
  schema: ObjectFormRendererType
  ignoreDotNotation?: boolean
  onChange: (arg: ObjectFormRendererType) => any
  renderState?: boolean
  renderKey?: (arg: string) => string
}) {
  const theme: Theme = useTheme()
  const [formValues, setFormValues] = useState(schema)
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const keys = ignoreDotNotation ? [key] : key.split('.')
    const textInputValue = e.target.value
    setFormValues((prevState) => {
      const formValues = {
        ...(objectValueMutator(
          prevState as ObjectFormRendererType,
          keys,
          textInputValue
        ) as ObjectFormRendererType),
      }
      onChange(formValues)
      return formValues
    })
  }

  const stringArraySchema = useMemo(
    () => generateFields(schema as ObjectFormRendererType),
    [schema]
  )
  return (
    <>
      <div>
        {renderState && <pre>{JSON.stringify(formValues, null, 2)}</pre>}
        <div>
          {stringArraySchema.map(([key, value]) => (
            <div key={key}>
              <Typography>{renderKey ? renderKey(key) : key}</Typography>
              <TextField
                fullWidth
                name={key}
                variant="outlined"
                size="small"
                onChange={onChangeHandler}
                defaultValue={value}
              />
            </div>
          ))}
        </div>
      </div>
      <div></div>
    </>
  )
}
