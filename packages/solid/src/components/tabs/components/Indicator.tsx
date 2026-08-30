import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabIndicatorBaseProps extends PolymorphicProps<'div'> {}
export interface TabIndicatorProps extends HTMLProps<'div'>, TabIndicatorBaseProps {}

export function TabIndicator(props: TabIndicatorProps) {
  const api = useTabsContext()
  const mergedProps = mergeProps(() => api().getIndicatorProps(), props)

  return <ui.div {...mergedProps} />
}
