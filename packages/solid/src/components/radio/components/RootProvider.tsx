import type { UseRadioReturn } from '../hooks/use-radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { RadioProvider } from '../hooks/use-radio-context'

interface RootProviderProps {
  value: UseRadioReturn
}

export interface RadioRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface RadioRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  RadioRootProviderBaseProps {}

export function RadioRootProvider(props: RadioRootProviderProps) {
  const [providerProps, localProps] = createSplitProps<RootProviderProps>()(props, [
    'value',
  ])
  const radio = () => providerProps.value()
  const mergedProps = mergeProps(() => radio().getRootProps(), localProps)

  return (
    <RadioProvider value={radio}>
      <ui.div {...mergedProps} />
    </RadioProvider>
  )
}
