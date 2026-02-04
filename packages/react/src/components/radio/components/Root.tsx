import type { UseRadioProps } from '../hooks/use-radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useRadio } from '../hooks/use-radio'
import { RadioProvider } from '../hooks/use-radio-context'

export interface RadioRootBaseProps extends UseRadioProps, PolymorphicProps {}
export interface RadioRootProps extends Assign<HTMLProps<'div'>, RadioRootBaseProps> {}

export const RadioRoot = forwardRef<HTMLDivElement, RadioRootProps>((props, ref) => {
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
  const Radio = useRadio(useRadioProps)
  const mergedProps = mergeProps(Radio.getRootProps(), localProps)

  return (
    <RadioProvider value={Radio}>
      <ui.div {...mergedProps} ref={ref} />
    </RadioProvider>
  )
})

RadioRoot.displayName = 'RadioRoot'
