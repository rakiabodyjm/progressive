import { AxiosError } from 'axios'

export const extractErrorFromResponse = (err: AxiosError): string => {
  const errResponse: string | string[] = err?.response?.data?.message
  const errRequest = err?.request

  if (errResponse) {
    if (Array.isArray(errResponse)) {
      return errResponse.join(', ')
    }
    return errResponse
  }
  if (errRequest) {
    return errRequest
  }
  return err.message
}

export const extractMultipleErrorFromResponse = (err: AxiosError): string[] => {
  const errResponse: string | string[] = err?.response?.data?.message

  const errRequest = err?.request

  if (errResponse && Array.isArray(errResponse)) {
    return errResponse
  }
  if (errResponse && !Array.isArray(errResponse)) {
    return [errResponse]
  }

  if (errRequest) {
    return [errRequest]
  }

  return [extractErrorFromResponse(err)]
}
export function formatKeyIntoReadables(param: string) {
  if (typeof param !== 'string') {
    return JSON.stringify(param)
    // throw new Error(`To Readable case received non string ${JSON.stringify(param)}`)
  }

  if (param.indexOf('_') > 0) {
    return toCapsFirst(param)
  }
  if (param === 'id') {
    return 'ID'
  }
  if (param === 'roles') {
    return 'Account Types'
  }

  switch (param) {
    case 'address1':
      return 'Address 1'
    case 'address2':
      return 'Address 2'
    default:
      return toCapsFirst(param)
  }
}
export const toCapsFirst = (toCapitalParam: string): string =>
  toCapitalParam
    .split('_')
    .map((ea) => ea.charAt(0).toUpperCase() + ea.slice(1))
    .join(' ')

export const formatIntoCurrency = (arg: number) =>
  new Intl.NumberFormat('en-PH', {
    currency: 'PHP',
    style: 'currency',
  }).format(arg)

export const formatIntoReadableDate = (arg: Date | number) =>
  `${new Date(arg).toLocaleTimeString()} ${new Date(arg).toDateString()}`
