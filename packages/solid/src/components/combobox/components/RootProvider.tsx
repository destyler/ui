import type { UseComboboxReturn } from '../hooks/use-combobox'
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
import { ComboboxProvider } from '../hooks/use-combobox-context'

interface RootProviderProps<T extends CollectionItem> {
  value: UseComboboxReturn<T>
}
export interface ComboboxRootProviderBaseProps<T extends CollectionItem>
  extends RootProviderProps<T>,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface ComboboxRootProviderProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  ComboboxRootProviderBaseProps<T> {}

export function ComboboxRootProvider<T extends CollectionItem>(props: ComboboxRootProviderProps<T>) {
  const [presenceProps, comboboxProps] = splitPresenceProps(props)
  const [{ value: combobox }, localProps] = createSplitProps<RootProviderProps<T>>()(
    comboboxProps,
    ['value'],
  )

  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: combobox().open })))
  const mergedProps = mergeProps(() => combobox().getRootProps(), localProps)

  return (
    <ComboboxProvider value={combobox}>
      <PresenceProvider value={apiPresence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </ComboboxProvider>
  )
}
