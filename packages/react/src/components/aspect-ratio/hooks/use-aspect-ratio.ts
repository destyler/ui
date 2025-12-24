import { normalizeProps, useMachine } from '@destyler/react'
import * as aspectRatio from '@destyler/aspect-ratio'
import { useId, useMemo } from 'react'
import { useEnvironmentContext } from '~/providers'
import type { UseAspectRatioProps, UseAspectRatioReturn } from '../types'

export function useAspectRatio(props: UseAspectRatioProps = {}): UseAspectRatioReturn {
  const { dir, id: idProp, ids, ratio } = props
  const { getRootNode } = useEnvironmentContext()
  const defaultId = useId()

  const context = useMemo(
    () => ({
      id: idProp ?? defaultId,
      dir,
      ids,
      ratio,
      getRootNode,
    }),
    [idProp, defaultId, dir, ids, ratio, getRootNode],
  )

  const [state, send] = useMachine(() => aspectRatio.machine(context), { context })

  return useMemo(() => aspectRatio.connect(state, send, normalizeProps), [state, send])
}
