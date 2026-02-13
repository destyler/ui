import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useDynamicContext } from '../hooks/use-dynamic-context'
import { useDynamicItemPropsContext } from '../hooks/use-dynamic-item-props-context'

export interface DynamicItemDeleteTriggerBaseProps extends PolymorphicProps {}
export interface DynamicItemDeleteTriggerProps extends HTMLProps<'button'>, DynamicItemDeleteTriggerBaseProps {}

export const DynamicItemDeleteTrigger = forwardRef<HTMLButtonElement, DynamicItemDeleteTriggerProps>(
  (props, ref) => {
    const dynamic = useDynamicContext()
    const itemProps = useDynamicItemPropsContext()
    const mergedProps = mergeProps(dynamic.getItemDeleteTriggerProps(itemProps), props)

    return <ui.button {...mergedProps} ref={ref} />
  },
)

DynamicItemDeleteTrigger.displayName = 'DynamicItemDeleteTrigger'
