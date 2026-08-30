import type { UseClipboardReturn } from '../hooks/use-clipboard'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import { mergeProps } from '@destyler/solid'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ClipboardProvider } from '../hooks/use-clipboard-context'

interface RootProviderProps {
  value: UseClipboardReturn
}

export interface ClipboardRootProviderBaseProps extends PolymorphicProps<'div'> {}
export interface ClipboardRootProviderProps
  extends HTMLProps<'div'>,
  RootProviderProps,
  ClipboardRootProviderBaseProps {}

export function ClipboardRootProvider(props: ClipboardRootProviderProps) {
  const [{ value: clipboard }, localProps] = createSplitProps<RootProviderProps>()(props, ['value'])
  const mergedProps = mergeProps(() => clipboard().getRootProps(), localProps)

  return (
    <ClipboardProvider value={clipboard}>
      <ui.div {...mergedProps} />
    </ClipboardProvider>
  )
}
