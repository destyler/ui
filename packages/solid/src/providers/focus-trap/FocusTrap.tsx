import type { FocusTrapOptions } from '@destyler/focus-trap'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { trapFocus } from '@destyler/focus-trap'
import { createEffect, onCleanup } from 'solid-js'
import { ui } from '~/factory'
import { composeRefs } from '~/utils/compose-refs'
import { createSplitProps } from '~/utils/create-split-props'

export interface TrapOptions
  extends Pick<
    FocusTrapOptions,
    | 'onActivate'
    | 'onDeactivate'
    | 'initialFocus'
    | 'fallbackFocus'
    | 'returnFocusOnDeactivate'
    | 'setReturnFocus'
  > {
  /**
   * Whether the focus trap is disabled.
   */
  disabled?: boolean
}

export interface FocusTrapBaseProps extends PolymorphicProps<'div'>, TrapOptions {}

export interface FocusTrapProps extends Assign<HTMLProps<'div'>, FocusTrapBaseProps> {}

export function FocusTrap(props: FocusTrapProps) {
  let localNode!: HTMLDivElement

  const [trapProps, localProps] = createSplitProps<TrapOptions>()(props, [
    'disabled',
    'onActivate',
    'onDeactivate',
    'initialFocus',
    'fallbackFocus',
    'returnFocusOnDeactivate',
    'setReturnFocus',
  ])

  createEffect(() => {
    if (!localNode || trapProps.disabled)
      return
    const autoFocusNode = localNode.querySelector<HTMLElement>('[autofocus], [data-autofocus]')
    const { disabled: _disabled, ...options } = trapProps
    onCleanup(trapFocus(localNode, {
      ...options,
      initialFocus: options.initialFocus ?? autoFocusNode ?? undefined,
    }))
  })

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return <ui.div {...localProps} ref={composeRefs(el => (localNode = el), props.ref)} />
}
