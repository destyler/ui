import type { UseSelectProps } from '../hooks/use-select'
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
import { useSelect } from '../hooks/use-select'
import { SelectProvider } from '../hooks/use-select-context'

export interface SelectRootBaseProps<T extends CollectionItem>
  extends UseSelectProps<T>,
  UsePresenceProps,
  PolymorphicProps<'div'> {}
export interface SelectRootProps<T extends CollectionItem>
  extends HTMLProps<'div'>,
  SelectRootBaseProps<T> {}

export function SelectRoot<T extends CollectionItem>(props: SelectRootProps<T>) {
  const [presenceProps, selectProps] = splitPresenceProps(props)
  const [useSelectProps, localProps] = createSplitProps<UseSelectProps<T>>()(selectProps, [
    'closeOnSelect',
    'composite',
    'collection',
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
  const presenceApi = usePresence(mergeProps(() => ({ present: select().open }), presenceProps))
  const mergedProps = mergeProps(() => select().getRootProps(), localProps)

  return (
    <SelectProvider value={select}>
      <PresenceProvider value={presenceApi}>
        <ui.div {...mergedProps} />
      </PresenceProvider>
    </SelectProvider>
  )
}
