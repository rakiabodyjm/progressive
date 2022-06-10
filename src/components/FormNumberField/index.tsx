import { TextField } from '@material-ui/core'
import { formatIntoCurrency } from '@src/utils/api/common'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'

export default function FormNumberField({
  value,
  onChange,
  disabledField,
}: {
  value: number | undefined
  onChange: (value: number | undefined) => void
  disabledField?: boolean
}) {
  const onChangeLocal = useCallback(onChange, [])
  const [inputValue, setInputValue] = useState<string | undefined>(value?.toString())

  useEffect(() => {
    onChangeLocal(Number(inputValue?.replace(/[^0-9.]/g, '') || 0))
  }, [inputValue])

  useEffect(() => {
    if (!value) {
      setInputValue(undefined)
    }
  }, [value])

  return (
    <>
      <TextField
        disabled={!!disabledField}
        variant="outlined"
        size="small"
        fullWidth
        onChange={(e) => {
          let inputString = e.target.value

          inputString = inputString
            .replace(/[^0-9.]/g, '')
            .split('')
            .reduce((acc, char, index, array) => {
              if (inputString?.includes('.') && char === '.') {
                if (index !== array.indexOf(char)) {
                  return acc
                }

                // return acc + char
              }

              return acc + char
            }, '')

          setInputValue(inputString)
        }}
        value={
          inputValue
            ?.replace(/[^0-9.]/g, '')
            ?.split('')
            ?.reduce((acc, char, index, array) => {
              const hasDecimal = array.includes('.')
              const whole = hasDecimal ? [...array].splice(0, array.indexOf('.')) : [...array]
              const decimal = hasDecimal
                ? [...array].splice(array.indexOf('.'), array.length - 1)
                : undefined

              if (whole.length >= 4) {
                // const isCommaPlaced = false

                return [...whole]
                  .reverse()
                  .reduce<string[]>((ac, ch, ind, ar) => {
                    if ((ind + 1) % 3 === 0 && ind !== ar.length - 1) {
                      return [...ac, ...[ch, ',']]
                    }
                    return [...ac, ch]
                  }, [])
                  .reverse()
                  .concat(decimal || [])
                  .join('')
              }
              return acc + char

              // return acc + char
            }, '') || ''
        }
      />
    </>
  )
}
