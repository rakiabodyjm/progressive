import { Box, CircularProgress } from '@material-ui/core'
import ToCaesarAutoComplete from '@src/components/pages/cash-transfer/ToCaesarAutoComplete'
import ToCaesarBankAutoComplete from '@src/components/pages/cash-transfer/ToCaesarBankAutoComplete'
import { extractMultipleErrorFromResponse } from '@src/utils/api/common'
import { CaesarWalletResponse, getWalletById } from '@src/utils/api/walletApi'
import { useErrorNotification } from '@src/utils/hooks/useNotification'
import { Caesar, CaesarBank } from '@src/utils/types/CashTransferTypes'
import { useEffect, useState } from 'react'

export default function ToCaesarAndCaesarBank({
  caesarMode,
  caesarBank: caesarBankProps,
  caesar: caesarProps,
  filterOptions,
  onChange,
  disabled,
}: { caesar?: CaesarWalletResponse; caesarBank?: CaesarBank } & {
  /**
   * Accepts if in caesar input mode
   */
  caesarMode?: boolean
  filterOptions?: {
    caesarBank?: (param: CaesarBank[]) => CaesarBank[]
    caesar?: (param: CaesarWalletResponse[]) => CaesarWalletResponse[]
  }
  onChange(param: CaesarWalletResponse | CaesarBank | null | undefined): void
  disabled?: true
}) {
  const dispatchError = useErrorNotification()

  const [caesar, setCaesar] = useState(caesarProps)
  const [caesarBank, setCaesarBank] = useState(caesarBankProps)
  const [initialFetch, setInitialFetch] = useState<boolean>(true)

  useEffect(() => {
    if (caesarBankProps) {
      getWalletById(caesarBankProps.caesar.id)
        .then((res) => {
          setCaesar(res)

          setCaesarBank((prev) => {
            if (prev) {
              return {
                ...prev,
                caesar: res,
              }
            }
            return prev
          })
        })
        .catch((err) => {
          extractMultipleErrorFromResponse(err).forEach((ea) => {
            dispatchError(ea)
          })
        })
        .finally(() => {
          setInitialFetch(false)
        })
      if (caesarProps) {
        getWalletById(caesarProps.id)
          .then((res) => {
            setCaesar(res)
          })
          .catch((err) => {
            extractMultipleErrorFromResponse(err).forEach((ea) => {
              dispatchError(ea)
            })
          })
          .finally(() => {
            setInitialFetch(false)
          })
      }
    } else {
      setInitialFetch(false)
    }
  }, [caesarBankProps, dispatchError, caesarProps])

  useEffect(() => {
    onChange(caesarMode ? caesar : caesarBank)
  }, [caesar, caesarBank, caesarMode])

  //   useEffect(() => {
  //     console.log(
  //       'caesar',
  //       caesar,
  //       'caearbank',
  //       caesarBank,
  //       'initialFetch',
  //       initialFetch,
  //       'caesarMode',
  //       caesarMode,
  //       'caesarBankProps',
  //       caesarBankProps
  //     )
  //   }, [caesar, caesarBank, initialFetch, caesarMode])
  return (
    <>
      {!initialFetch && (caesarBank || caesar) ? (
        <>
          {caesarMode ? (
            <ToCaesarAutoComplete
              onChange={(newCaesar) => {
                setCaesar(newCaesar)
              }}
              defaultValue={caesar}
              filterOptions={filterOptions?.caesar}
              disabled={disabled}
            />
          ) : (
            <ToCaesarBankAutoComplete
              onChange={(newCb) => {
                setCaesarBank(newCb)
              }}
              defaultValue={caesarBank}
              filterOptions={filterOptions?.caesarBank}
              disabled={disabled}
            />
          )}{' '}
        </>
      ) : (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
    </>
  )
}
