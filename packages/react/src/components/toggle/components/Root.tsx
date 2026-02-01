import type { UseToggleProps } from '../hooks/use-toggle'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggle } from '../hooks/use-toggle'
import { ToggleProvider } from '../hooks/use-toggle-context'

export interface ToggleRootBaseProps extends UseToggleProps, PolymorphicProps {}

export interface ToggleRootProps extends HTMLProps<'button'>, ToggleRootBaseProps {}

export const ToggleRoot = forwardRef<HTMLButtonElement, ToggleRootProps>((props, ref) => {
  const [useToggleProps, localProps] = createSplitProps<UseToggleProps>()(props, [
    'pressed',
    'defaultPressed',
    'disabled',
    'onPressedChange',
  ])

  const toggle = useToggle(useToggleProps)
  const mergedProps = mergeProps(toggle.getRootProps(), localProps)

  return (
    <ToggleProvider value={toggle}>
      <ui.button {...mergedProps} ref={ref} />
    </ToggleProvider>
  )
})

ToggleRoot.displayName = 'ToggleRoot'
