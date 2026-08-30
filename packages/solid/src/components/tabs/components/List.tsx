import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useTabsContext } from '../hooks/use-tabs-context'

export interface TabListBaseProps extends PolymorphicProps<'div'> {}
export interface TabListProps extends HTMLProps<'div'>, TabListBaseProps {}

export function TabList(props: TabListProps) {
  const api = useTabsContext()
  const mergedProps = mergeProps(() => api().getListProps(), props)

  return <ui.div {...mergedProps} />
}
