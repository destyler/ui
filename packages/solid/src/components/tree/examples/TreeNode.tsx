import { Tree } from '@destyler-ui/solid/tree'
import { For, Show } from 'solid-js'

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface TreeNodeProps {
  node: Node
  indexPath: number[]
}

export function TreeNode(props: TreeNodeProps) {
  return (
    <Tree.NodeProvider node={props.node} indexPath={props.indexPath}>
      <Show
        when={props.node.children}
        fallback={(
          <Tree.Item>
            <Tree.ItemIndicator>•</Tree.ItemIndicator>
            <Tree.ItemText>{props.node.name}</Tree.ItemText>
          </Tree.Item>
        )}
      >
        <Tree.Branch>
          <Tree.BranchControl>
            <Tree.BranchTrigger>
              <Tree.BranchText>{props.node.name}</Tree.BranchText>
              <Tree.BranchIndicator>▶</Tree.BranchIndicator>
            </Tree.BranchTrigger>
          </Tree.BranchControl>
          <Tree.BranchContent>
            <Tree.BranchIndentGuide />
            <For each={props.node.children}>
              {(child, index) => (
                <TreeNode node={child} indexPath={[...props.indexPath, index()]} />
              )}
            </For>
          </Tree.BranchContent>
        </Tree.Branch>
      </Show>
    </Tree.NodeProvider>
  )
}
