import type { UseSelectReturn } from '../hooks/use-select'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { CollectionItem } from '~/types'
import { mergeProps } from '@destyler/solid'
import {
  PresenceProvider,
  splitPresenceProps,
  usePresence,

} from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SelectProvider } from '../hooks/use-select-context'

interface RootProviderProps<T extends CollectionItem> {
  value: UseSelectReturn<T>
}
export interface SelectRootProviderBaseProps<T extends CollectionItem>
  extends RootProviderProps<T>,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface SelectRootProviderProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  SelectRootProviderBaseProps<T> {}

export function SelectRootProvider<T extends CollectionItem>(props: SelectRootProviderProps<T>) {
  const [presenceProps, selectProps] = splitPresenceProps(props)
  const [providerProps, localProps] = createSplitProps<RootProviderProps<T>>()(selectProps, [
    'value',
  ])
  const select: UseSelectReturn<T> = () => providerProps.value()
  const presence = usePresence(mergeProps(() => ({ present: select().open }), presenceProps))
  const mergedProps = mergeProps(() => select().getRootProps(), localProps)

  return (
    <SelectProvider value={select}>
      <PresenceProvider value={presence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </SelectProvider>
  )
}
