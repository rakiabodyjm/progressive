/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'

const useResizeListener = ({
  refElement,
  target,
}: // handleResize,
{
  refElement: HTMLDivElement | null
  // target?: keyof typeof refElement | never
  target?: keyof HTMLDivElement
}) => {
  const [refElementState, setRefElementState] = useState<typeof refElement>()
  const handleResize = useCallback(() => {
    setRefElementState(refElement)
  }, [setRefElementState, refElement])

  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return window.addEventListener('resize', handleResize)
  }, [handleResize])

  return {
    refElementState: (target && refElementState?.[target]) || refElementState || undefined,
  }
}

export default useResizeListener
