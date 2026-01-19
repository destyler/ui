import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useCollapsibleContext } from '~/components'
import { ui } from '~/factory'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemTriggerBaseProps extends PolymorphicProps {}
export interface CollapseItemTriggerProps extends HTMLProps<'button'>, CollapseItemTriggerBaseProps {}

export const CollapseItemTrigger = forwardRef<HTMLButtonElement, CollapseItemTriggerProps>((props, ref) => {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()
  const collapsible = useCollapsibleContext()
  const triggerProps = collapse.getItemTriggerProps(itemProps)
  const mergedProps = mergeProps(
    {
      ...triggerProps,
      'aria-controls': collapsible.isUnmounted ? undefined : triggerProps['aria-controls'],
    },
    props,
  )

  return <ui.button {...mergedProps} ref={ref} />
})

CollapseItemTrigger.displayName = 'CollapseItemTrigger'
