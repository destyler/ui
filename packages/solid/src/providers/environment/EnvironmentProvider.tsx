import type { JSX } from 'solid-js'
import type { RootNode } from './use-environment-context'
import { getDocument, getWindow } from '@destyler/dom'
import { createMemo, createSignal, Show } from 'solid-js'
import { runIfFn } from '~/utils/run-if-fn'
import { EnvironmentContextProvider } from './use-environment-context'

export interface EnvironmentProviderProps {
  children?: JSX.Element
  value?: RootNode | (() => RootNode)
}

export function EnvironmentProvider(props: EnvironmentProviderProps) {
  const [spanRef, setSpanRef] = createSignal<HTMLSpanElement>()
  const getRootNode = () => runIfFn(props.value) ?? spanRef()?.ownerDocument ?? document

  const environment = createMemo(() => ({
    getRootNode,
    getDocument: () => getDocument(getRootNode()),
    getWindow: () => getWindow(getRootNode()),
  }))

  return (
    <EnvironmentContextProvider value={environment}>
      {props.children}
      <Show when={!props.value}>
        <span hidden ref={setSpanRef} />
      </Show>
    </EnvironmentContextProvider>
  )
}
