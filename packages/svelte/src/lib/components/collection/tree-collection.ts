import type { FilePathTreeNode, TreeCollectionOptions, TreeNode } from '@destyler/collection'
import {
  filePathToTree,
  TreeCollection,
} from '@destyler/collection'

export type {
  FilePathTreeNode,
  FlatTreeNode,
  TreeCollection,
  TreeCollectionOptions,
  TreeNode,
} from '@destyler/collection'

export function createTreeCollection<T extends TreeNode>(options: TreeCollectionOptions<T>): TreeCollection<T> {
  return new TreeCollection(options)
}

export const createFileTreeCollection = (paths: string[]): TreeCollection<FilePathTreeNode> => filePathToTree(paths)
