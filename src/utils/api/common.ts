import { AxiosError } from 'axios'

export const extractErrorFromResponse = (err: AxiosError) => {
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
