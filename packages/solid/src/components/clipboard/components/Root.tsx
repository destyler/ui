import type { UseClipboardProps } from '../hooks/use-clipboard'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useClipboard } from '../hooks/use-clipboard'
import { ClipboardProvider } from '../hooks/use-clipboard-context'

export interface ClipboardRootBaseProps extends UseClipboardProps, PolymorphicProps<'div'> {}
export interface ClipboardRootProps extends HTMLProps<'div'>, ClipboardRootBaseProps {}

export function ClipboardRoot(props: ClipboardRootProps) {
  const [useClipboardProps, localProps] = createSplitProps<UseClipboardProps>()(props, [
    'id',
    'ids',
    'onStatusChange',
    'timeout',
    'value',
  ])
  const api = useClipboard(useClipboardProps)
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <ClipboardProvider value={api}>
      <ui.div {...mergedProps} />
    </ClipboardProvider>
  )
}
