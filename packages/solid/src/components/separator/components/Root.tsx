import type { UseSeparatorProps } from '../hooks/use-separator'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSeparator } from '../hooks/use-separator'
import { SeparatorProvider } from '../hooks/use-separator-context'

export interface SeparatorRootBaseProps
  extends UseSeparatorProps,
  PolymorphicProps<'div'> {}
export interface SeparatorRootProps extends HTMLProps<'div'>, SeparatorRootBaseProps {}

export function SeparatorRoot(props: SeparatorRootProps) {
  const [useSeparatorProps, localProps] = createSplitProps<UseSeparatorProps>()(props, [
    'id',
    'ids',
    'orientation',
  ])
  const separator = useSeparator(useSeparatorProps)
  const mergedProps = mergeProps(
    () => separator().getRootProps(useSeparatorProps.orientation),
    localProps,
  )

  return (
    <SeparatorProvider value={separator}>
      <ui.div {...mergedProps} />
    </SeparatorProvider>
  )
}
