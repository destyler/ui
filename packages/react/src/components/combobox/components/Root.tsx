import type { JSX, Ref, RefAttributes } from 'react'
import type { UseComboboxProps } from '../hooks/use-combobox'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { CollectionItem } from '~/utils/collection'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { useFieldContext } from '~/components/field'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useCombobox } from '../hooks/use-combobox'
import { ComboboxProvider } from '../hooks/use-combobox-context'

export interface ComboboxRootBaseProps<T extends CollectionItem>
  extends UseComboboxProps<T>,
  UsePresenceProps,
  PolymorphicProps {}
export interface ComboboxRootProps<T extends CollectionItem>
  extends Assign<HTMLProps<'div'>, ComboboxRootBaseProps<T>> {}

function ComboboxImpl<T extends CollectionItem>(props: ComboboxRootProps<T>, ref: Ref<HTMLDivElement>) {
  const [presenceProps, comboboxProps] = splitPresenceProps(props)
  const [useComboboxProps, localProps] = createSplitProps<UseComboboxProps<T>>()(comboboxProps, [
    'allowCustomValue',
    'autoFocus',
    'closeOnSelect',
    'composite',
    'collection',
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
  const combobox = useCombobox(useComboboxProps)
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
  props: ComboboxRootProps<T> & RefAttributes<HTMLDivElement>,
) => JSX.Element

export const ComboboxRoot = forwardRef(ComboboxImpl) as ComboboxComponent
