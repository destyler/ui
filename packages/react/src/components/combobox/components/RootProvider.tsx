import type { JSX, Ref, RefAttributes } from 'react'
import type { UseComboboxReturn } from '../hooks/use-combobox'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { CollectionItem } from '~/utils/collection'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { ComboboxProvider } from '../hooks/use-combobox-context'

interface RootProviderProps<T extends CollectionItem> {
  value: UseComboboxReturn<T>
}
export interface ComboboxRootProviderBaseProps<T extends CollectionItem>
  extends RootProviderProps<T>,
  UsePresenceProps,
  PolymorphicProps {}
export interface ComboboxRootProviderProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  ComboboxRootProviderBaseProps<T> {}

function ComboboxImpl<T extends CollectionItem>(props: ComboboxRootProviderProps<T>, ref: Ref<HTMLDivElement>) {
  const [presenceProps, comboboxProps] = splitPresenceProps(props)
  const [{ value: combobox }, localProps] = createSplitProps<RootProviderProps<T>>()(comboboxProps, ['value'])
  const presence = usePresence(mergeProps({ present: combobox.open }, presenceProps))
  const mergedProps = mergeProps(combobox.getRootProps(), localProps)
  const field = useFieldContext()

  return (
    <ComboboxProvider value={combobox}>
      <PresenceProvider value={presence}>
        <ui.div aria-describedby={field?.ariaDescribedby} {...mergedProps} ref={ref} />
      </PresenceProvider>
    </ComboboxProvider>
  )
}

export type ComboboxComponent = <T extends CollectionItem>(
  props: ComboboxRootProviderProps<T> & RefAttributes<HTMLDivElement>,
) => JSX.Element

export const ComboboxRootProvider = forwardRef(ComboboxImpl) as ComboboxComponent
