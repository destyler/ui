import type { Accessor, HTMLProps } from '$lib/types'
import type { MaybeFunction } from '@destyler/utils'
import { dataAttr } from '@destyler/dom'
import { runIfFn } from '@destyler/utils'
import { toggleAnatomy } from '../anatomy'

const parts = toggleAnatomy.build()

export interface UseToggleProps {
  disabled?: boolean
  defaultPressed?: boolean
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

export interface ToggleApi {
  pressed: boolean
  disabled: boolean
  setPressed: (pressed: boolean) => void
  getRootProps: () => HTMLProps<'button'>
  getIndicatorProps: () => HTMLProps<'div'>
}

export interface UseToggleReturn extends Accessor<ToggleApi> {}

export function useToggle(props: MaybeFunction<UseToggleProps> = {}): UseToggleReturn {
  const initialProps = runIfFn(props)
  let uncontrolledPressed = $state(initialProps.defaultPressed ?? false)
  const resolvedProps = $derived(runIfFn(props))
  const pressed = $derived(resolvedProps.pressed ?? uncontrolledPressed)
  const disabled = $derived(resolvedProps.disabled ?? false)

  const setPressed = (nextPressed: boolean) => {
    if (disabled)
      return
    uncontrolledPressed = nextPressed
    resolvedProps.onPressedChange?.(nextPressed)
  }

  const api = $derived<ToggleApi>({
    pressed,
    disabled,
    setPressed,
    getRootProps: () => ({
      ...parts.root.attrs,
      'type': 'button',
      disabled,
      'aria-pressed': pressed,
      'data-state': pressed ? 'on' : 'off',
      'data-pressed': dataAttr(pressed),
      'data-disabled': dataAttr(disabled),
      onclick(event) {
        if (event.defaultPrevented || disabled)
          return
        setPressed(!pressed)
      },
    }),
    getIndicatorProps: () => ({
      ...parts.indicator.attrs,
      'data-disabled': dataAttr(disabled),
      'data-pressed': dataAttr(pressed),
      'data-state': pressed ? 'on' : 'off',
    }),
  })

  return () => api
}
