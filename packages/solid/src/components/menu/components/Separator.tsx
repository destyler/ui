import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { useMenuContext } from '../hooks/use-menu-context'

export interface MenuSeparatorBaseProps extends PolymorphicProps<'hr'> {}
export interface MenuSeparatorProps extends HTMLProps<'hr'>, MenuSeparatorBaseProps {}

export function MenuSeparator(props: MenuSeparatorProps) {
  const menu = useMenuContext()
  const mergedProps = mergeProps(() => menu().getSeparatorProps(), props)

  return <ui.hr {...mergedProps} />
}
