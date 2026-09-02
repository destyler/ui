import type { UseToggleProps } from '../hooks/use-toggle'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useToggle } from '../hooks/use-toggle'
import { ToggleProvider } from '../hooks/use-toggle-context'

export interface ToggleRootBaseProps extends UseToggleProps, PolymorphicProps<'button'> {}

export interface ToggleRootProps extends HTMLProps<'button'>, ToggleRootBaseProps {}

export function ToggleRoot(props: ToggleRootProps) {
  const [useToggleProps, localProps] = createSplitProps<UseToggleProps>()(props, [
    'pressed',
    'defaultPressed',
    'disabled',
    'onPressedChange',
  ])

  const toggle = useToggle(useToggleProps)
  const mergedProps = mergeProps(() => toggle().getRootProps(), localProps)

  return (
    <ToggleProvider value={toggle}>
      <ui.button {...mergedProps} />
    </ToggleProvider>
  )
}
