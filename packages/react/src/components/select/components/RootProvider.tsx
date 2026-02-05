import type { JSX } from 'react'
import type { UseSelectReturn } from '../hooks/use-select'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { CollectionItem } from '~/utils/collection'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { SelectProvider } from '../hooks/use-select-context'

interface RootProviderProps<T extends CollectionItem> {
  value: UseSelectReturn<T>
}
export interface SelectRootProviderBaseProps<T extends CollectionItem>
  extends RootProviderProps<T>,
  UsePresenceProps,
  PolymorphicProps {}
export interface SelectRootProviderProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  SelectRootProviderBaseProps<T> {}

function SelectImpl<T extends CollectionItem>(props: SelectRootProviderProps<T>, ref: React.Ref<HTMLDivElement>) {
  const [presenceProps, selectProps] = splitPresenceProps(props)
  const [{ value: select }, localProps] = createSplitProps<RootProviderProps<T>>()(selectProps, ['value'])
  const presence = usePresence(mergeProps({ present: select.open }, presenceProps))
  const mergedProps = mergeProps(select.getRootProps(), localProps)

  return (
    <SelectProvider value={select}>
      <PresenceProvider value={presence}>
        <ui.div {...mergedProps} ref={ref} />
      </PresenceProvider>
    </SelectProvider>
  )
}

export type SelectComponent = <T extends CollectionItem>(
  props: SelectRootProviderProps<T> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

export const SelectRootProvider = forwardRef(SelectImpl) as SelectComponent
