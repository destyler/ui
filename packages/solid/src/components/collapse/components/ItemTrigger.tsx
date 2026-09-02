import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { splitProps } from 'solid-js'
import { useCollapsibleContext } from '~/components/collapsible'
import { ui } from '~/factory'
import { useCollapseContext } from '../hooks/use-collapse-context'
import { useCollapseItemPropsContext } from '../hooks/use-collapse-item-props-context'

export interface CollapseItemTriggerBaseProps extends PolymorphicProps<'button'> {}
export interface CollapseItemTriggerProps
  extends HTMLProps<'button'>,
  CollapseItemTriggerBaseProps {}

export function CollapseItemTrigger(props: CollapseItemTriggerProps) {
  const collapse = useCollapseContext()
  const itemProps = useCollapseItemPropsContext()
  const collapsible = useCollapsibleContext()

  const mergedProps = mergeProps(() => collapse().getItemTriggerProps(itemProps), props)
  const [ariaControls, buttonProps] = splitProps(mergedProps, ['aria-controls'])

  return <ui.button {...buttonProps} {...(!collapsible().unmounted && ariaControls)} />
}
