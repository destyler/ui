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

  let collection = $state(untrack(() => create(applyLimit(props.initialItems))))

  const setItems = (items: T[]) => {
    collection = create(applyLimit(items))
  }

  const itemValue = (item: T) => collection.getItemValue(item)
  const moveItem = (value: string, to: number) => {
    const from = collection.indexOf(value)
    if (from < 0)
      return
    const next = [...collection.items]
    const [item] = next.splice(from, 1)
    if (item !== undefined)
      next.splice(to, 0, item)
    setItems(next)
  }

  return {
    collection: () => collection,
    filter: (inputValue: string) => {
      if (!props.filter)
        return
      const source = create(props.initialItems)
      setItems(source.items.filter(item => props.filter?.(source.stringifyItem(item) ?? '', inputValue)))
    },
    set: setItems,
    reset: () => setItems(props.initialItems),
    clear: () => setItems([]),
    insert: (index: number, ...items: T[]) => {
      const next = [...collection.items]
      next.splice(index, 0, ...items)
      setItems(next)
    },
    insertBefore: (value: string, ...items: T[]) => {
      const index = collection.indexOf(value)
      const next = [...collection.items]
      next.splice(index < 0 ? 0 : index, 0, ...items)
      setItems(next)
    },
    insertAfter: (value: string, ...items: T[]) => {
      const index = collection.indexOf(value)
      const next = [...collection.items]
      next.splice(index < 0 ? next.length : index + 1, 0, ...items)
      setItems(next)
    },
    remove: (...items: T[]) => {
      const values = new Set(items.map(itemValue))
      setItems(collection.items.filter(item => !values.has(itemValue(item))))
    },
    move: moveItem,
    moveBefore: (value: string, beforeValue: string) => {
      const to = collection.indexOf(beforeValue)
      if (to >= 0)
        moveItem(value, to)
    },
    moveAfter: (value: string, afterValue: string) => {
      const to = collection.indexOf(afterValue)
      if (to >= 0)
        moveItem(value, to + 1)
    },
    reorder: (from: number, to: number) => {
      const next = [...collection.items]
      const [item] = next.splice(from, 1)
      if (item !== undefined)
        next.splice(to, 0, item)
      setItems(next)
    },
    prepend: (...items: T[]) => setItems([...items, ...collection.items]),
    update: (value: string, item: T) => {
      const index = collection.indexOf(value)
      if (index < 0)
        return
      const next = [...collection.items]
      next[index] = item
      setItems(next)
    },
  }
}
