import type { Accessor } from 'solid-js'
import type { UsePresenceProps, UsePresenceReturn } from '~/components/presence'
import { createEffect, createMemo, onCleanup } from 'solid-js'
import { usePresence } from '~/components/presence'
import { createContext } from '~/utils/create-context'

type PresenceRegistration = symbol

interface NavigationMenuPresenceContext {
  presenceProps: UsePresenceProps
  present: Accessor<boolean>
  beginExit: (registration: PresenceRegistration) => void
  cancelExit: (registration: PresenceRegistration) => void
  endExit: (registration: PresenceRegistration) => void
  unregister: (registration: PresenceRegistration) => void
}

const navigationMenuPresenceProviderTuple = createContext<NavigationMenuPresenceContext>({
  hookName: 'useNavigationMenuPresenceContext',
  providerName: '<NavigationMenuPresenceProvider />',
})

export const NavigationMenuPresenceProvider = navigationMenuPresenceProviderTuple[0]
const useNavigationMenuPresenceContext = navigationMenuPresenceProviderTuple[1]

export function createNavigationMenuPresence(
  presenceProps: UsePresenceProps,
  machinePresent: Accessor<boolean>,
): NavigationMenuPresenceContext {
  const present = createMemo(() => presenceProps.present ?? machinePresent())
  const exiting = new Set<PresenceRegistration>()
  const pending = new Set<PresenceRegistration>()
  let previousPresent = present()
  let closing = false
  let completed = false
  let cycle = 0

  const scheduleComplete = () => {
    const currentCycle = cycle
    // Allow every independently owned presence effect to join the close cycle.
    queueMicrotask(() => {
      queueMicrotask(() => {
        if (
          currentCycle !== cycle
          || !closing
          || completed
          || present()
          || pending.size > 0
        ) {
          return
        }

        completed = true
        presenceProps.onExitComplete?.()
      })
    })
  }

  const startClosing = () => {
    if (closing)
      return

    closing = true
    completed = false
    pending.clear()
    exiting.forEach(registration => pending.add(registration))
    cycle += 1
    scheduleComplete()
  }

  const cancelClosing = () => {
    if (!closing)
      return

    closing = false
    completed = false
    pending.clear()
    cycle += 1
  }

  createEffect(() => {
    const nextPresent = present()

    if (previousPresent && !nextPresent)
      startClosing()
    else if (!previousPresent && nextPresent)
      cancelClosing()

    previousPresent = nextPresent
  })

  return {
    presenceProps,
    present,
    beginExit(registration) {
      exiting.add(registration)

      if (present())
        return

      startClosing()
      pending.add(registration)
    },
    cancelExit(registration) {
      exiting.delete(registration)

      if (!pending.delete(registration))
        return

      scheduleComplete()
    },
    endExit(registration) {
      exiting.delete(registration)

      if (!pending.delete(registration))
        return

      scheduleComplete()
    },
    unregister(registration) {
      exiting.delete(registration)

      if (!pending.delete(registration))
        return

      scheduleComplete()
    },
  }
}

export function useNavigationMenuPresence(target: Accessor<boolean>): UsePresenceReturn {
  const context = useNavigationMenuPresenceContext()
  const registration = Symbol('navigation-menu-presence')
  const present = createMemo(() => context.present() && target())
  let previousTarget = present()

  createEffect(() => {
    const nextTarget = present()

    if (previousTarget && !nextTarget)
      context.beginExit(registration)
    else if (!previousTarget && nextTarget)
      context.cancelExit(registration)

    previousTarget = nextTarget
  })

  onCleanup(() => context.unregister(registration))

  return usePresence({
    get present() {
      return present()
    },
    get immediate() {
      return context.presenceProps.immediate
    },
    get lazyMount() {
      return context.presenceProps.lazyMount
    },
    get unmountOnExit() {
      return context.presenceProps.unmountOnExit
    },
    onExitComplete: () => context.endExit(registration),
  })
}
