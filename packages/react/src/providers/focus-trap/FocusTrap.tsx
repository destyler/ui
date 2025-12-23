import type { FocusTrapOptions } from '@destyler/focus-trap'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { trapFocus } from '@destyler/focus-trap'
import { forwardRef, useRef } from 'react'
import { ui } from '~/factory'
import { useSafeLayoutEffect } from '~/hooks/use-safe-layout-effect'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'

export interface TrapOptions
  extends Pick<
    FocusTrapOptions,
    'onActivate' | 'onDeactivate' | 'initialFocus' | 'fallbackFocus' | 'returnFocusOnDeactivate' | 'setReturnFocus'
  > {
  /**
   * Whether the focus trap is disabled.
   */
  disabled?: boolean
}

export interface FocusTrapBaseProps extends PolymorphicProps, TrapOptions {}

export interface FocusTrapProps extends Assign<HTMLProps<'div'>, FocusTrapBaseProps> {}

export const FocusTrap = forwardRef<HTMLDivElement, FocusTrapProps>((props, ref) => {
  const localRef = useRef<HTMLDivElement | null>(null)
  const [trapProps, localProps] = createSplitProps<TrapOptions>()(props, [
    'disabled',
    'onActivate',
    'onDeactivate',
    'initialFocus',
    'fallbackFocus',
    'returnFocusOnDeactivate',
    'setReturnFocus',
  ])

  useSafeLayoutEffect(() => {
    const node = localRef.current
    if (!node || trapProps.disabled)
      return
    return trapFocus(node, trapProps)
  }, [ref, trapProps])

  return <ui.div ref={composeRefs(localRef, ref)} {...localProps} />
})

FocusTrap.displayName = 'FocusTrap'
