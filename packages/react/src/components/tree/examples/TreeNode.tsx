import { Tree } from '../index'

interface Node {
  id: string
  name: string
  children?: Node[]
}

interface TreeNodeProps {
  node: Node
  indexPath: number[]
}

export function TreeNode({ node, indexPath }: TreeNodeProps) {
  if (node.children) {
    return (
      <Tree.NodeProvider node={node} indexPath={indexPath}>
        <Tree.Branch>
          <Tree.BranchControl>
            <Tree.BranchTrigger>
              <Tree.BranchText>
                {node.name}
              </Tree.BranchText>
              <Tree.BranchIndicator>
                ▶
              </Tree.BranchIndicator>
            </Tree.BranchTrigger>
          </Tree.BranchControl>
          <Tree.BranchContent>
            <Tree.BranchIndentGuide />
            {node.children.map((child, index) => (
              <TreeNode
                key={child.id}
                node={child}
                indexPath={[...indexPath, index]}
              />
            ))}
          </Tree.BranchContent>
        </Tree.Branch>
      </Tree.NodeProvider>
    )
  }

  return (
    <Tree.NodeProvider node={node} indexPath={indexPath}>
      <Tree.Item>
        <Tree.ItemIndicator>
          •
        </Tree.ItemIndicator>
        <Tree.ItemText>
          {node.name}
        </Tree.ItemText>
      </Tree.Item>
    </Tree.NodeProvider>
  )
}
