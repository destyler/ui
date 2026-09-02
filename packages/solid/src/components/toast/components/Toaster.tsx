import type { Accessor, JSX } from 'solid-js'
import type { CreateToasterReturn, ToasterInternal } from '../hooks/create-toaster'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps, normalizeProps, useActor, useMachine } from '@destyler/solid'
import * as toast from '@destyler/toast'
import { createEffect, createMemo, createUniqueId, For, onCleanup, onMount, splitProps } from 'solid-js'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { getToasterInternal } from '../hooks/create-toaster'
import { ToastProvider } from '../hooks/use-toast-context'

export interface ToasterBaseProps extends PolymorphicProps<'div'> {
  toaster: CreateToasterReturn
  children: (toast: Accessor<toast.Options<JSX.Element>>) => JSX.Element
}
export interface ToasterProps extends Assign<HTMLProps<'div'>, ToasterBaseProps> {}

interface HotkeyRegistration {
  activity: () => number
  count: () => number
  element: () => HTMLElement | null
  hotkey: () => string[]
  internal: ToasterInternal
  mountOrder: number
}

interface HotkeyRegistry {
  handleKeyDown: (event: KeyboardEvent) => void
  registrations: Set<HotkeyRegistration>
  routingVersion: number
}

const hotkeyRegistries = new WeakMap<Document, HotkeyRegistry>()
let toasterActivity = 0
let toasterMountOrder = 0

function matchesHotkey(event: KeyboardEvent, hotkey: string[]) {
  return hotkey.length > 0
    && hotkey.every(key => Boolean(event[key as keyof KeyboardEvent]) || event.code === key)
}

function getNewestRegistration(
  registrations: HotkeyRegistration[],
  getOrder: (registration: HotkeyRegistration) => number,
) {
  return registrations.reduce<HotkeyRegistration | undefined>((latest, registration) => {
    if (!latest || getOrder(registration) > getOrder(latest))
      return registration
    return latest
  }, undefined)
}

function registerHotkey(document: Document, registration: HotkeyRegistration) {
  let registry = hotkeyRegistries.get(document)
  if (!registry) {
    const registrations = new Set<HotkeyRegistration>()
    registry = {
      registrations,
      routingVersion: 0,
      handleKeyDown(event) {
        const matching = [...registrations].filter(item => matchesHotkey(event, item.hotkey()))
        if (matching.length === 0)
          return

        const activeElement = document.activeElement
        const focused = matching.find((item) => {
          const element = item.element()
          return Boolean(element && activeElement && (element === activeElement || element.contains(activeElement)))
        })
        const populated = matching.filter(item => item.count() > 0)
        const selected = focused
          ?? getNewestRegistration(populated, item => item.activity())
          ?? getNewestRegistration(matching, item => item.mountOrder)

        for (const item of matching) {
          item.internal.hotkeyRouting = true
          item.internal.hotkeySelected = item === selected
        }

        queueMicrotask(() => selected?.element()?.focus())

        registry!.routingVersion += 1
        const routingVersion = registry!.routingVersion
        setTimeout(() => {
          if (registry?.routingVersion !== routingVersion)
            return
          for (const item of matching) {
            item.internal.hotkeyRouting = false
            item.internal.hotkeySelected = false
          }
        })
      },
    }
    hotkeyRegistries.set(document, registry)
    document.addEventListener('keydown', registry.handleKeyDown, true)
  }

  registry.registrations.add(registration)
  return () => {
    registration.internal.hotkeyRouting = false
    registration.internal.hotkeySelected = false
    registry!.registrations.delete(registration)
    if (registry!.registrations.size > 0)
      return
    document.removeEventListener('keydown', registry!.handleKeyDown, true)
    hotkeyRegistries.delete(document)
  }
}

export function Toaster(props: ToasterProps) {
  const [toasterProps, localProps] = splitProps(props, ['toaster', 'children', 'ref'])
  const [state, send] = useMachine(toasterProps.toaster.machine)
  const placement = createMemo(() => state.context.placement)
  const instanceId = createUniqueId()
  const internal = getToasterInternal(toasterProps.toaster)
  let groupElement: HTMLElement | null = null
  let activity = 0
  let unregisterHotkey: VoidFunction | undefined

  const api = createMemo(() =>
    toast.group.connect(state as toast.GroupState<JSX.Element>, send, normalizeProps))
  const toasts = createMemo(() => api().getToastsByPlacement(placement()))

  createEffect<string[]>((previousIds) => {
    const toastIds = toasts().map(toast => toast.id)
    if (toastIds.some(id => !previousIds.includes(id))) {
      toasterActivity += 1
      activity = toasterActivity
    }
    return toastIds
  }, [])

  onMount(() => {
    if (!groupElement)
      return
    toasterMountOrder += 1
    unregisterHotkey = registerHotkey(groupElement.ownerDocument, {
      activity: () => activity,
      count: () => toasts().length,
      element: () => groupElement,
      hotkey: () => state.context.hotkey,
      internal,
      mountOrder: toasterMountOrder,
    })
  })

  onCleanup(() => {
    unregisterHotkey?.()
    if (internal.groupElement === groupElement)
      internal.groupElement = null
    groupElement = null
  })

  const mergedProps = mergeProps(
    () => ({
      ...api().getGroupProps({ placement: placement() }),
      id: `toast-group:${placement()}:${instanceId}`,
    }),
    localProps,
  )

  return (
    <ui.div
      {...mergedProps}
      ref={composeRefs(
        (node: HTMLElement) => {
          groupElement = node
          internal.groupElement = node
        },
        toasterProps.ref,
      )}
    >
      <For each={toasts()}>
        {toast => <ToastActor value={toast}>{ctx => toasterProps.children(ctx)}</ToastActor>}
      </For>
    </ui.div>
  )
}

interface ToastActorProps {
  value: toast.Service
  children: (ctx: Accessor<toast.Options<JSX.Element>>) => JSX.Element
}

function ToastActor(props: ToastActorProps) {
  const [state, send] = useActor(props.value)
  const api = createMemo(() => toast.connect(state, send, normalizeProps))
  const ctx = createMemo(() => state.context)
  return <ToastProvider value={api}>{props.children(ctx)}</ToastProvider>
}
