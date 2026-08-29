import type { MaybeFunction } from '@destyler/utils'
import type { CollectionItem, CollectionOptions } from '../list-collection'
import { runIfFn } from '@destyler/utils'
import { untrack } from 'svelte'
import { createListCollection } from '../list-collection'

export interface UseListCollectionProps<T extends CollectionItem> extends Omit<CollectionOptions<T>, 'items'> {
  initialItems: T[]
  filter?: (itemText: string, filterText: string) => boolean
  limit?: number
}

export function useListCollection<T extends CollectionItem>(
  inProps: MaybeFunction<UseListCollectionProps<T>>,
) {
  const [props, collectionOptions] = $derived.by(() => {
    const { initialItems = [], filter, limit, ...options } = runIfFn(inProps)
    return [{ initialItems, filter, limit }, options]
  })

  const create = (items: T[]) => createListCollection({ ...collectionOptions, items })
  const applyLimit = (items: T[]) => (props.limit == null ? items : items.slice(0, props.limit))

  let items = $state<T[]>(untrack(() => [...props.initialItems]))
  let filterText = $state('')

  const collection = $derived.by(() => {
    let activeItems = items
    if (filterText && props.filter) {
      const source = create(items)
      activeItems = items.filter(item => props.filter?.(source.stringifyItem(item) ?? '', filterText))
    }
    return create(applyLimit(activeItems))
  })

  const setItems = (nextItems: T[]) => {
    items = nextItems
    filterText = ''
  }

  const itemValue = (item: T) => create(items).getItemValue(item)
  const moveItem = (value: string, to: number) => {
    const from = create(items).indexOf(value)
    if (from < 0 || from === to)
      return
    const next = [...items]
    const [item] = next.splice(from, 1)
    if (item !== undefined)
      next.splice(to, 0, item)
    setItems(next)
  }

  return {
    collection: () => collection,
    filter: (inputValue: string) => filterText = inputValue,
    set: setItems,
    reset: () => setItems(props.initialItems),
    clear: () => setItems([]),
    insert: (index: number, ...itemsToInsert: T[]) => {
      const next = [...items]
      next.splice(index, 0, ...itemsToInsert)
      setItems(next)
    },
    insertBefore: (value: string, ...itemsToInsert: T[]) => {
      const index = create(items).indexOf(value)
      const next = [...items]
      next.splice(index < 0 ? 0 : index, 0, ...itemsToInsert)
      setItems(next)
    },
    insertAfter: (value: string, ...itemsToInsert: T[]) => {
      const index = create(items).indexOf(value)
      const next = [...items]
      next.splice(index < 0 ? next.length : index + 1, 0, ...itemsToInsert)
      setItems(next)
    },
    remove: (...itemsToRemove: T[]) => {
      const values = new Set(itemsToRemove.map(itemValue))
      setItems(items.filter(item => !values.has(itemValue(item))))
    },
    move: moveItem,
    moveBefore: (value: string, beforeValue: string) => {
      const source = create(items)
      const from = source.indexOf(value)
      const before = source.indexOf(beforeValue)
      if (from >= 0 && before >= 0 && from !== before)
        moveItem(value, from < before ? before - 1 : before)
    },
    moveAfter: (value: string, afterValue: string) => {
      const source = create(items)
      const from = source.indexOf(value)
      const after = source.indexOf(afterValue)
      if (from >= 0 && after >= 0 && from !== after)
        moveItem(value, from < after ? after : after + 1)
    },
    reorder: (from: number, to: number) => {
      const next = [...items]
      const [item] = next.splice(from, 1)
      if (item !== undefined)
        next.splice(to, 0, item)
      setItems(next)
    },
    prepend: (...itemsToPrepend: T[]) => setItems([...itemsToPrepend, ...items]),
    update: (value: string, item: T) => {
      const index = create(items).indexOf(value)
      if (index < 0)
        return
      const next = [...items]
      next[index] = item
      setItems(next)
    },
  }
}
