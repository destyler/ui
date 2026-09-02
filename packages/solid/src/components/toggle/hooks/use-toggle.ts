import type { Accessor, JSX } from 'solid-js'
import { dataAttr } from '@destyler/dom'
import { createMemo } from 'solid-js'
import { useControllableState } from '~/hooks/use-controllable-state'
import { parts } from '../anatomy'

export interface UseToggleProps {
  /**
   * Whether the toggle is disabled.
   */
  disabled?: boolean
  /**
   * The default pressed state of the toggle.
   */
  defaultPressed?: boolean
  /**
   * The pressed state of the toggle.
   */
  pressed?: Accessor<boolean>
  /**
   * Event handler called when the pressed state of the toggle changes.
   */
  onPressedChange?: (pressed: boolean) => void
}

export type UseToggleReturn = Accessor<{
  /**
   * Whether the toggle is pressed.
   */
  pressed: boolean
  /**
   * Whether the toggle is disabled.
   */
  disabled: boolean
  /**
   * Sets the pressed state of the toggle.
   */
  setPressed: (pressed: boolean) => void
  getRootProps: () => JSX.IntrinsicElements['button']
  getIndicatorProps: () => JSX.IntrinsicElements['div']
}>

export function useToggle(props: UseToggleProps): UseToggleReturn {
  const [pressedState, setPressedState] = useControllableState({
    get defaultValue() {
      return !!props.defaultPressed
    },
    get value() {
      return props.pressed
    },
    get onChange() {
      return props.onPressedChange
    },
  })

  return createMemo(() => ({
    pressed: pressedState(),
    disabled: !!props.disabled,
    setPressed: setPressedState,

    getRootProps() {
      return {
        ...(parts.root.attrs as JSX.IntrinsicElements['button']),
        'type': 'button',
        'disabled': props.disabled,
        'aria-pressed': pressedState(),
        'data-state': pressedState() ? 'on' : 'off',
        'data-pressed': dataAttr(pressedState()),
        'data-disabled': dataAttr(props.disabled),
        onClick(event) {
          if (event.defaultPrevented)
            return
          if (props.disabled)
            return
          setPressedState(!pressedState())
        },
      }
    },

    getIndicatorProps() {
      return {
        ...(parts.indicator.attrs as JSX.IntrinsicElements['div']),
        'data-disabled': dataAttr(props.disabled),
        'data-pressed': dataAttr(pressedState()),
        'data-state': pressedState() ? 'on' : 'off',
      }
    },
  }))
}
