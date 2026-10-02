import type { JSX } from 'solid-js'
import type { Assign } from '~/types'
import {
  createEffect,
  createMemo,
  createSignal,

  onCleanup,
  Show,
  splitProps,
} from 'solid-js'
import { Portal } from 'solid-js/web'
import * as solidWeb from 'solid-js/web'

import { EnvironmentProvider } from '~/providers'
import { composeRefs } from '~/utils/compose-refs'
import { FrameContent } from './Content'

// Solid 1.8 only exports these DOM helpers from its browser entry. Keep a
// namespace lookup for client-only lifecycle helpers so the server entry can load.
const { clearDelegatedEvents, DelegatedEvents, delegateEvents } = solidWeb

export interface FrameBaseProps {
  /** Accessible name that describes the embedded frame content */
  title: string
  /** Additional content to be inserted into the frame's <head> */
  head?: JSX.Element
  /** Callback function to be executed when the frame is mounted */
  onMount?: () => void
  /** Callback function to be executed when the frame is unmounted */
  onUnmount?: () => void
}

export interface FrameProps
  extends Assign<JSX.IframeHTMLAttributes<HTMLIFrameElement>, FrameBaseProps> {}

const resetStyle
  = '<style>*,*::before,*::after { margin: 0; padding: 0; box-sizing: border-box; }</style>'

const initialSrcDoc = `<html><head>${resetStyle}</head><body><div class="frame-root"></div></body></html>`

function getMountNode(frame: HTMLIFrameElement) {
  const doc = frame.contentDocument
  if (!doc?.body)
    return null
  return doc.body.querySelector<HTMLElement>('.frame-root') || doc.body
}

export function Frame(props: FrameProps) {
  const [frameProps, localProps] = splitProps(props, [
    'children',
    'head',
    'onMount',
    'onUnmount',
    'ref',
    'srcdoc',
    'title',
  ])

  const srcdoc = createMemo(() => frameProps.srcdoc ?? initialSrcDoc)

  const [frameRef, setFrameRef] = createSignal<HTMLIFrameElement | null>(null)
  const [mountNode, setMountNode] = createSignal<HTMLElement | null>(null)

  createEffect(() => {
    const frame = frameRef()
    if (!frame)
      return

    const html = srcdoc()
    let currentNode: HTMLElement | null = null
    let currentDocument: Document | null = null
    const clearDocument = () => {
      // The frame owns this document. Solid installs delegated listeners on the
      // outer document by default; discard the iframe's listeners on replacement.
      if (currentDocument)
        clearDelegatedEvents(currentDocument)
      currentDocument = null
      currentNode = null
      setMountNode(null)
    }
    const syncDocument = () => {
      const node = getMountNode(frame)
      if (node === currentNode)
        return
      clearDocument()
      if (!node)
        return
      currentNode = node
      currentDocument = node.ownerDocument
      // Register the entire delegated event set, including events from children
      // loaded later. Native events do not bubble across document boundaries.
      delegateEvents([...DelegatedEvents], currentDocument)
      setMountNode(node)
    }

    frame.addEventListener('load', syncDocument)
    onCleanup(() => {
      frame.removeEventListener('load', syncDocument)
      clearDocument()
    })

    const doc = frame.contentDocument
    if (doc) {
      doc.open()
      doc.write(html)
      doc.close()
    }
    syncDocument()
  })

  createEffect(() => {
    const frame = frameRef()
    const node = mountNode()
    if (!frame || !node)
      return

    const win = node.ownerDocument.defaultView as Window & typeof globalThis
    if (!win)
      return

    const exec = () => {
      const rootEl = node.ownerDocument.documentElement
      if (!rootEl)
        return
      frame.style.setProperty('--width', `${node.scrollWidth}px`)
      frame.style.setProperty('--height', `${node.scrollHeight}px`)
    }

    const resizeObserver = new win.ResizeObserver(exec)
    exec()

    resizeObserver.observe(node)

    onCleanup(() => {
      resizeObserver.disconnect()
    })
  })

  return (
    <EnvironmentProvider value={() => mountNode()?.ownerDocument ?? frameRef()?.contentDocument ?? document}>
      <iframe
        title={frameProps.title || 'Embedded content'}
        {...localProps}
        ref={composeRefs(setFrameRef, frameProps.ref)}
      />
      {/* iframe fallback markup is raw text, so hydration markers must stay outside it. */}
      <Show when={mountNode()} keyed>
        {node => (
          <Portal mount={node}>
            <FrameContent onMount={frameProps.onMount} onUnmount={frameProps.onUnmount}>
              {frameProps.children}
            </FrameContent>
          </Portal>
        )}
      </Show>
      <Show when={mountNode()} keyed>
        {node => <Portal mount={node.ownerDocument.head}>{frameProps.head}</Portal>}
      </Show>
    </EnvironmentProvider>
  )
}
