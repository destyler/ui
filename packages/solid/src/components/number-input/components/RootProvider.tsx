import type { UseNumberInputReturn } from '../hooks/use-number-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { NumberInputProvider } from '../hooks/use-number-input-context'

interface RootProviderProps {
  value: UseNumberInputReturn
}

export interface NumberInputRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface NumberInputRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  NumberInputRootProviderBaseProps {}

export function NumberInputRootProvider(props: NumberInputRootProviderProps) {
  const [{ value: numberInput }, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const mergedProps = mergeProps(() => numberInput().getRootProps(), localProps)

  return (
    <NumberInputProvider value={numberInput}>
      <ui.div {...mergedProps} />
    </NumberInputProvider>
  )
}
