import { useEffect, useState } from 'react'

export default function useFetch<T>(fetcher: () => Promise<T>): {
  loading: boolean | undefined
  error: Error | string | undefined
  data: T | undefined
} {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>()
  const [data, setData] = useState<T | undefined>()
  useEffect(() => {
    fetcher()
      .then((res) => {
        setLoading(true)
        setData(res)
      })
      .catch((err) => {
        setError(err)
      })
  }, [])

  useEffect(() => {
    setLoading(false)
  }, [data])

  useEffect(() => {
    if (error) {
      setLoading(false)
    }
  }, [error])

  return {
    error,
    data,
    loading,
  }
}
