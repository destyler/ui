import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { createMemo } from 'solid-js'
import { Collapsible } from '~/components/collapsible'
import { createSplitProps } from '~/utils/create-split-props'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemContentBaseProps extends PolymorphicProps<'div'> {}
export interface CollapseItemContentProps
  extends HTMLProps<'div'>,
  CollapseItemContentBaseProps {}

interface VisibilityProps {
  'hidden'?: boolean
  'data-state'?: string
}

const splitVisibilityProps = createSplitProps<VisibilityProps>()

export function CollapseItemContent(props: CollapseItemContentProps) {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()

  const itemContentProps = createMemo(() => {
    const contentProps = collapse().getItemContentProps(itemProps)
    const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, [
      'hidden',
      'data-state',
    ])
    return ownProps
  })
  const mergedProps = mergeProps(() => itemContentProps(), props)

  return <Collapsible.Content {...mergedProps} />
}
