export { createFileTreeCollection, createTreeCollection, type TreeCollection, type TreeNode } from '../collection'
export { treeAnatomy } from './anatomy'
export {
  default as TreeBranch,
  type TreeBranchBaseProps,
  type TreeBranchProps,
} from './components/Branch.svelte'
export {
  default as TreeBranchContent,
  type TreeBranchContentBaseProps,
  type TreeBranchContentProps,
} from './components/BranchContent.svelte'
export {
  default as TreeBranchControl,
  type TreeBranchControlBaseProps,
  type TreeBranchControlProps,
} from './components/BranchControl.svelte'
export {
  default as TreeBranchIndentGuide,
  type TreeBranchIndentGuideBaseProps,
  type TreeBranchIndentGuideProps,
} from './components/BranchIndentGuide.svelte'
export {
  default as TreeBranchIndicator,
  type TreeBranchIndicatorBaseProps,
  type TreeBranchIndicatorProps,
} from './components/BranchIndicator.svelte'
export {
  default as TreeBranchText,
  type TreeBranchTextBaseProps,
  type TreeBranchTextProps,
} from './components/BranchText.svelte'
export {
  default as TreeBranchTrigger,
  type TreeBranchTriggerBaseProps,
  type TreeBranchTriggerProps,
} from './components/BranchTrigger.svelte'
export { default as TreeContext, type TreeContextProps } from './components/Context.svelte'
export { default as TreeItem, type TreeItemBaseProps, type TreeItemProps } from './components/Item.svelte'
export {
  default as TreeItemIndicator,
  type TreeItemIndicatorBaseProps,
  type TreeItemIndicatorProps,
} from './components/ItemIndicator.svelte'
export {
  default as TreeItemText,
  type TreeItemTextBaseProps,
  type TreeItemTextProps,
} from './components/ItemText.svelte'
export {
  default as TreeLabel,
  type TreeLabelBaseProps,
  type TreeLabelProps,
} from './components/Label.svelte'
export { default as TreeNodeContext, type TreeNodeContextProps } from './components/NodeContext.svelte'
export {
  default as TreeNodeProvider,
  type TreeNodeProviderBaseProps,
  type TreeNodeProviderProps,
} from './components/NodeProvider.svelte'
export { default as TreeRoot, type TreeRootBaseProps, type TreeRootProps } from './components/Root.svelte'
export {
  default as TreeRootProvider,
  type TreeRootProviderBaseProps,
  type TreeRootProviderProps,
} from './components/RootProvider.svelte'
export { default as TreeTree, type TreeTreeBaseProps, type TreeTreeProps } from './components/Tree.svelte'
export { useTreeContext } from './hooks/use-tree-context'
export type { UseTreeContext } from './hooks/use-tree-context'
export { useTreeNodeContext } from './hooks/use-tree-node-context'
export type { UseTreeNodeContext } from './hooks/use-tree-node-context'
export { useTreeNodePropsContext } from './hooks/use-tree-node-props-context'
export type { UseTreeNodePropsContext } from './hooks/use-tree-node-props-context'
export { useTree } from './hooks/use-tree.svelte'
export type { UseTreeProps, UseTreeReturn } from './hooks/use-tree.svelte'
export * as Tree from './namespace'

export type {
  ExpandedChangeDetails as TreeExpandedChangeDetails,
  FocusChangeDetails as TreeFocusChangeDetails,
  NodeProps as TreeNodeProps,
  NodeState as TreeNodeState,
  SelectionChangeDetails as TreeSelectionChangeDetails,
} from '@destyler/tree'
