import type { EffectCallback } from 'react'
import { useEffect, useRef } from 'react'

export function useEffectOnce(cb: EffectCallback) {
  const savedCallback = useRef(cb)
  const effectGuard = useRef(false)

  useEffect(() => {
    savedCallback.current = cb
  })

  useEffect(() => {
    if (effectGuard.current !== true) {
      effectGuard.current = true
      savedCallback.current()
    }
  }, [])
}
