import type { UseRadioReturn } from '../hooks/use-radio'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { RadioProvider } from '../hooks/use-radio-context'

interface RootProviderProps {
  value: UseRadioReturn
}

export interface RadioRootProviderBaseProps extends RootProviderProps, PolymorphicProps {}
export interface RadioRootProviderProps extends HTMLProps<'div'>, RadioRootProviderBaseProps {}

export const RadioRootProvider = forwardRef<HTMLDivElement, RadioRootProviderProps>((props, ref) => {
  const [{ value: Radio }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(Radio.getRootProps(), localProps)

  return (
    <RadioProvider value={Radio}>
      <ui.div {...mergedProps} ref={ref} />
    </RadioProvider>
  )
})

RadioRootProvider.displayName = 'RadioRootProvider'
