import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { Collapsible } from '~/components'
import { createSplitProps } from '~/utils/create-split-props'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemContentBaseProps extends PolymorphicProps {}
export interface CollapseItemContentProps extends HTMLProps<'div'>, CollapseItemContentBaseProps {}

interface VisibilityProps {
  'hidden'?: boolean
  'data-state'?: string
}

const splitVisibilityProps = createSplitProps<VisibilityProps>()

export const CollapseItemContent = forwardRef<HTMLDivElement, CollapseItemContentProps>((props, ref) => {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()

  const contentProps = collapse.getItemContentProps(itemProps)
  const [, itemContentProps] = splitVisibilityProps(contentProps, ['hidden', 'data-state'])

  const mergedProps = mergeProps(itemContentProps, props)

  return <Collapsible.Content ref={ref} {...mergedProps} />
})

CollapseItemContent.displayName = 'CollapseItemContent'
