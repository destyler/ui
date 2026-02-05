import type { JSX } from 'react'
import type { UseSelectProps } from '../hooks/use-select'
import type { UsePresenceProps } from '~/components/presence'
import type { HTMLProps, PolymorphicProps } from '~/factory'
import type { Assign } from '~/types'
import type { CollectionItem } from '~/utils/collection'
import { mergeProps } from '@destyler/react'
import { forwardRef } from 'react'
import { PresenceProvider, splitPresenceProps, usePresence } from '~/components/presence'
import { ui } from '~/factory'
import { createSplitProps } from '~/utils/create-split-props'
import { useSelect } from '../hooks/use-select'
import { SelectProvider } from '../hooks/use-select-context'

export interface SelectRootBaseProps<T extends CollectionItem>
  extends UseSelectProps<T>,
  UsePresenceProps,
  PolymorphicProps {}
export interface SelectRootProps<T extends CollectionItem> extends Assign<HTMLProps<'div'>, SelectRootBaseProps<T>> {}

function SelectImpl<T extends CollectionItem>(props: SelectRootProps<T>, ref: React.Ref<HTMLDivElement>) {
  const [presenceProps, selectProps] = splitPresenceProps(props)
  const [useSelectProps, localProps] = createSplitProps<UseSelectProps<T>>()(selectProps, [
    'closeOnSelect',
    'collection',
    'composite',
    'defaultOpen',
    'defaultValue',
    'deselectable',
    'disabled',
    'form',
    'highlightedValue',
    'id',
    'ids',
    'invalid',
    'loopFocus',
    'multiple',
    'name',
    'onFocusOutside',
    'onHighlightChange',
    'onInteractOutside',
    'onOpenChange',
    'onPointerDownOutside',
    'onValueChange',
    'open',
    'positioning',
    'readOnly',
    'required',
    'scrollToIndexFn',
    'value',
  ])
  const select = useSelect(useSelectProps)
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
  props: SelectRootProps<T> & React.RefAttributes<HTMLDivElement>,
) => JSX.Element

export const SelectRoot = forwardRef(SelectImpl) as SelectComponent
