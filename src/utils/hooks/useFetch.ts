import axios from 'axios'
import { useEffect, useState } from 'react'

type FetchMethods = 'post' | 'get' | 'patch' | 'put' | 'delete'
type UseFetchOptions = {
  method: FetchMethods
}

// TODO useFetch not yet done
export default function useFetch(url, options: UseFetchOptions) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios[options.method](url)
  }, [url])
}
