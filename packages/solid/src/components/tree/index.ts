export { treeAnatomy } from './anatomy'
export {
  TreeBranch,
  type TreeBranchBaseProps,
  type TreeBranchProps,
} from './components/Branch'
export {
  TreeBranchContent,
  type TreeBranchContentBaseProps,
  type TreeBranchContentProps,
} from './components/BranchContent'
export {
  TreeBranchControl,
  type TreeBranchControlBaseProps,
  type TreeBranchControlProps,
} from './components/BranchControl'
export {
  TreeBranchIndentGuide,
  type TreeBranchIndentGuideBaseProps,
  type TreeBranchIndentGuideProps,
} from './components/BranchIndentGuide'
export {
  TreeBranchIndicator,
  type TreeBranchIndicatorBaseProps,
  type TreeBranchIndicatorProps,
} from './components/BranchIndicator'
export {
  TreeBranchText,
  type TreeBranchTextBaseProps,
  type TreeBranchTextProps,
} from './components/BranchText'
export {
  TreeBranchTrigger,
  type TreeBranchTriggerBaseProps,
  type TreeBranchTriggerProps,
} from './components/BranchTrigger'
export { TreeContext, type TreeContextProps } from './components/Context'
export { TreeItem, type TreeItemBaseProps, type TreeItemProps } from './components/Item'
export {
  TreeItemIndicator,
  type TreeItemIndicatorBaseProps,
  type TreeItemIndicatorProps,
} from './components/ItemIndicator'
export {
  TreeItemText,
  type TreeItemTextBaseProps,
  type TreeItemTextProps,
} from './components/ItemText'
export {
  TreeLabel,
  type TreeLabelBaseProps,
  type TreeLabelProps,
} from './components/Label'
export { TreeNodeContext, type TreeNodeContextProps } from './components/NodeContext'
export {
  TreeNodeProvider,
  type TreeNodeProviderBaseProps,
  type TreeNodeProviderProps,
} from './components/NodeProvider'
export { TreeRoot, type TreeRootBaseProps, type TreeRootProps } from './components/Root'
export {
  TreeRootProvider,
  type TreeRootProviderBaseProps,
  type TreeRootProviderProps,
} from './components/RootProvider'
export { TreeTree, type TreeTreeBaseProps, type TreeTreeProps } from './components/Tree'
export { useTree, type UseTreeProps, type UseTreeReturn } from './hooks/use-tree'
export { useTreeContext, type UseTreeContext } from './hooks/use-tree-context'
export { useTreeNodeContext, type UseTreeNodeContext } from './hooks/use-tree-node-context'
export {
  useTreeNodePropsContext,
  type UseTreeNodePropsContext,
} from './hooks/use-tree-node-props-context'
export * as Tree from './namespace'
export type {
  ExpandedChangeDetails as TreeExpandedChangeDetails,
  FocusChangeDetails as TreeFocusChangeDetails,
  SelectionChangeDetails as TreeSelectionChangeDetails,
} from '@destyler/tree'

export {
  createFileTreeCollection,
  createTreeCollection,
  type TreeCollection,
  type TreeNode,
} from '~/utils/collection'
