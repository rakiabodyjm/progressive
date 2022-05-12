import { useState, useCallback } from 'react'
const useSubmitFormData = ({ submitFunction }: { submitFunction: () => Promise<unknown> }) => {
  const [loading, setLoading] = useState<boolean>(false)
  // eslint-disable-next-line no-undef
  const [response, setResponse] = useState<Awaited<ReturnType<typeof submitFunction>> | undefined>()

  const [error, setError] = useState<undefined | unknown>()

  const submit = useCallback(() => {
    setError(undefined)
    setLoading(true)
    setResponse(undefined)
    submitFunction()
      .then((res) => {
        setResponse(res)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [submitFunction])

  return {
    loading,
    response,
    error,
    submit,
  }
}

export default useSubmitFormData
