import type { UseNumberInputProps } from '../hooks/use-number-input'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useNumberInput } from '../hooks/use-number-input'
import { NumberInputProvider } from '../hooks/use-number-input-context'

export interface NumberInputRootBaseProps extends UseNumberInputProps, PolymorphicProps<'div'> {}
export interface NumberInputRootProps extends Assign<HTMLProps<'div'>, NumberInputRootBaseProps> {}

export function NumberInputRoot(props: NumberInputRootProps) {
  const [useNumberInputProps, localProps] = createSplitProps<UseNumberInputProps>()(props, [
    'allowMouseWheel',
    'allowOverflow',
    'clampValueOnBlur',
    'defaultValue',
    'disabled',
    'focusInputOnChange',
    'form',
    'formatOptions',
    'id',
    'ids',
    'inputMode',
    'invalid',
    'locale',
    'max',
    'min',
    'name',
    'onFocusChange',
    'onValueChange',
    'onValueInvalid',
    'pattern',
    'readOnly',
    'required',
    'spinOnPress',
    'step',
    'translations',
    'value',
  ])
  const api = useNumberInput(useNumberInputProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <NumberInputProvider value={api}>
      <ui.div {...mergedProps} />
    </NumberInputProvider>
  )
}
