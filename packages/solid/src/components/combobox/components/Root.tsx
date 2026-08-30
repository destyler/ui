import type { UseComboboxProps } from '../hooks/use-combobox'
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
import { useCombobox } from '../hooks/use-combobox'
import { ComboboxProvider } from '../hooks/use-combobox-context'

export interface ComboboxRootBaseProps<T extends CollectionItem>
  extends UseComboboxProps<T>,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface ComboboxRootProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  ComboboxRootBaseProps<T> {}

export function ComboboxRoot<T extends CollectionItem>(props: ComboboxRootProps<T>) {
  const [presenceProps, comboboxProps] = splitPresenceProps(props)
  const [useComboboxProps, localProps] = createSplitProps<UseComboboxProps<T>>()(comboboxProps, [
    'allowCustomValue',
    'autoFocus',
    'closeOnSelect',
    'collection',
    'composite',
    'defaultOpen',
    'defaultValue',
    'disabled',
    'disableLayer',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'inputBehavior',
    'inputValue',
    'invalid',
    'loopFocus',
    'multiple',
    'name',
    'navigate',
    'onFocusOutside',
    'onHighlightChange',
    'onInputValueChange',
    'onInteractOutside',
    'onOpenChange',
    'onOpenChange',
    'onPointerDownOutside',
    'onValueChange',
    'open',
    'openOnChange',
    'openOnClick',
    'openOnKeyPress',
    'placeholder',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'selectionBehavior',
    'translations',
    'value',
  ])

  const api = useCombobox(useComboboxProps)
  const apiPresence = usePresence(mergeProps(presenceProps, () => ({ present: api().open })))
  const mergedProps = mergeProps(() => api().getRootProps(), localProps)

  return (
    <ComboboxProvider value={api}>
      <PresenceProvider value={apiPresence}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </ComboboxProvider>
  )
}
