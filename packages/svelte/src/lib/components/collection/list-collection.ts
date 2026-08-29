import type { CollectionItem, CollectionOptions } from '@destyler/collection'
import { ListCollection } from '@destyler/collection'

export function createListCollection<T extends CollectionItem>(options: CollectionOptions<T>): ListCollection<T> {
  return new ListCollection(options)
}

export type { CollectionItem, CollectionOptions, ListCollection }
