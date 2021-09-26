import {
  Box,
  hexToRgb,
  makeStyles,
  Paper,
  rgbToHex,
  TextField,
  TextFieldProps,
  Theme,
  Typography,
  useTheme,
} from '@material-ui/core'
import userApi from '@src/utils/api/userApi'
import { AnyNaptrRecord } from 'dns'

import React, {
  ChangeEvent,
  ChangeEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

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

type FormSchemaGeneratorObject = Record<string | number | symbol, {}>
export default function FormSchemaGenerator({
  schema,
  ignoreDotNotation,
  onChange,
  renderState = false,
  renderKey,
}: {
  schema: FormSchemaGeneratorObject
  ignoreDotNotation?: boolean
  onChange: (arg: FormSchemaGeneratorObject) => any
  renderState?: boolean
  renderKey?: (arg: string) => string
}) {
  const theme: Theme = useTheme()
  const [formValues, setFormValues] = useState(schema)
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const key = e.target.name
    const keys = ignoreDotNotation ? [key] : key.split('.')
    const textInputValue = e.target.value
    setFormValues((prevState) => ({
      ...(objectValueMutator(
        prevState as FormSchemaGeneratorObject,
        keys,
        textInputValue
      ) as FormSchemaGeneratorObject),
    }))
  }

  useEffect(() => {
    onChange(formValues)
  }, [formValues])
  const stringArraySchema = useMemo(
    () => generateFields(schema as FormSchemaGeneratorObject),
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
