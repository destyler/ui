import type { ReactNode } from 'react'
import type { RootNode } from './use-environment-context'
import { getDocument, getWindow } from '@destyler/dom'
import { useMemo, useState } from 'react'
import { runIfFn } from '../../utils/run-if-fn'
import { EnvironmentContextProvider } from './use-environment-context'

export interface EnvironmentProviderProps {
  children?: ReactNode
  value?: RootNode | (() => RootNode)
}

export function EnvironmentProvider(props: EnvironmentProviderProps) {
  const { value, children } = props
  const [spanRef, setSpanRef] = useState<HTMLSpanElement | null>()

  const getRootNode = useMemo(() => {
    return () => runIfFn(value) ?? spanRef?.ownerDocument ?? document
  }, [value, spanRef])

  const environment = useMemo(
    () => ({
      getRootNode,
      getWindow: () => getWindow(getRootNode()),
      getDocument: () => getDocument(getRootNode()),
    }),
    [getRootNode],
  )

  return (
    <EnvironmentContextProvider value={environment}>
      {children}
      {!value && <span hidden ref={setSpanRef} />}
    </EnvironmentContextProvider>
  )
}
