import type { UseRadioProps } from '../hooks/use-radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useRadio } from '../hooks/use-radio'
import { RadioProvider } from '../hooks/use-radio-context'

export interface RadioRootBaseProps extends UseRadioProps, PolymorphicProps<'div'> {}
export interface RadioRootProps extends HTMLProps<'div'>, RadioRootBaseProps {}

export function RadioRoot(props: RadioRootProps) {
  const [useRadioProps, localProps] = createSplitProps<UseRadioProps>()(props, [
    'defaultValue',
    'disabled',
    'form',
    'id',
    'ids',
    'name',
    'onValueChange',
    'orientation',
    'readOnly',
    'value',
  ])

  const radio = useRadio(useRadioProps)
  const mergedProps = mergeProps(() => radio().getRootProps(), localProps)

  return (
    <RadioProvider value={radio}>
      <ui.div {...mergedProps} />
    </RadioProvider>
  )
}
