import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { ui } from '~/factory'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemIndicatorBaseProps extends PolymorphicProps {}
export interface CollapseItemIndicatorProps extends HTMLProps<'div'>, CollapseItemIndicatorBaseProps {}

export const CollapseItemIndicator = forwardRef<HTMLDivElement, CollapseItemIndicatorProps>((props, ref) => {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()
  const mergedProps = mergeProps(collapse.getItemIndicatorProps(itemProps), props)

  return <ui.div {...mergedProps} ref={ref} />
})

CollapseItemIndicator.displayName = 'CollapseItemIndicator'
