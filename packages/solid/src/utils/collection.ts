import type { CollectionItem, CollectionOptions, FilePathTreeNode, TreeCollectionOptions, TreeNode } from '@destyler/collection'
import {

  filePathToTree,
  ListCollection,

  TreeCollection,
} from '@destyler/collection'
import { ref } from '@destyler/xstate'

export type { CollectionItem, ListCollection } from '@destyler/collection'

export function createListCollection<T extends CollectionItem>(options: CollectionOptions<T>): ListCollection<T> {
  return ref(new ListCollection(options))
}

export type { TreeCollection, TreeNode } from '@destyler/collection'

export function createTreeCollection<T extends TreeNode>(options: TreeCollectionOptions<T>): TreeCollection<T> {
  return ref(new TreeCollection(options))
}

export function createFileTreeCollection(paths: string[]): TreeCollection<FilePathTreeNode> {
  return ref(filePathToTree(paths))
}
