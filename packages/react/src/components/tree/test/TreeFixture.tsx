import type { UseTreeProps } from '../hooks/use-tree'
import { Tree } from '../index'

export interface Node {
  id: string
  disabled?: boolean
  children?: Node[]
}

interface TreeFixtureProps extends UseTreeProps<Node> {
  asChildControls?: boolean
}

function FixtureNode({ node, indexPath, asChildControls }: { node: Node, indexPath: number[], asChildControls: boolean }) {
  return (
    <Tree.NodeProvider node={node} indexPath={indexPath}>
      {node.children
        ? (
            <Tree.Branch>
              {asChildControls
                ? (
                    <Tree.BranchControl asChild>
                      <span><Tree.BranchText>{node.id}</Tree.BranchText></span>
                    </Tree.BranchControl>
                  )
                : <Tree.BranchControl><Tree.BranchText>{node.id}</Tree.BranchText></Tree.BranchControl>}
              <Tree.BranchContent>
                {node.children.map((child, index) => (
                  <FixtureNode key={child.id} node={child} indexPath={[...indexPath, index]} asChildControls={asChildControls} />
                ))}
              </Tree.BranchContent>
            </Tree.Branch>
          )
        : asChildControls
          ? <Tree.Item asChild><span><Tree.ItemText>{node.id}</Tree.ItemText></span></Tree.Item>
          : <Tree.Item><Tree.ItemText>{node.id}</Tree.ItemText></Tree.Item>}
    </Tree.NodeProvider>
  )
}

export function TreeFixture({ asChildControls = false, ...props }: TreeFixtureProps) {
  return (
    <Tree.Root {...props}>
      <Tree.Label>Regression tree</Tree.Label>
      <Tree.Tree>
        {props.collection.rootNode.children?.map((node, index) => (
          <FixtureNode key={node.id} node={node} indexPath={[index]} asChildControls={asChildControls} />
        ))}
      </Tree.Tree>
      <Tree.Context>
        {tree => (
          <>
            <output data-testid="expanded">{JSON.stringify(tree.expandedValue)}</output>
            <output data-testid="selected">{JSON.stringify(tree.selectedValue)}</output>
          </>
        )}
      </Tree.Context>
    </Tree.Root>
  )
}
