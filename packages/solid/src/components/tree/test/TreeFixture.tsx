import type { UseTreeProps } from '../hooks/use-tree'
import { For, Show, splitProps } from 'solid-js'
import { Tree } from '../index'

export interface Node {
  id: string
  disabled?: boolean
  children?: Node[]
}

interface TreeFixtureProps extends UseTreeProps<Node> {
  asChildControls?: boolean
}

function FixtureNode(props: { node: Node, indexPath: number[], asChildControls?: boolean }) {
  return (
    <Tree.NodeProvider node={props.node} indexPath={props.indexPath}>
      <Show
        when={props.node.children}
        fallback={(
          <Tree.Item
            asChild={props.asChildControls ? parent => <span {...parent({})} /> : undefined}
          >
            <Tree.ItemText>{props.node.id}</Tree.ItemText>
          </Tree.Item>
        )}
      >
        <Tree.Branch>
          <Tree.BranchControl
            asChild={props.asChildControls ? parent => <span {...parent({})} /> : undefined}
          >
            <Tree.BranchText>{props.node.id}</Tree.BranchText>
          </Tree.BranchControl>
          <Tree.BranchContent>
            <For each={props.node.children}>
              {(child, index) => <FixtureNode node={child} indexPath={[...props.indexPath, index()]} asChildControls={props.asChildControls} />}
            </For>
          </Tree.BranchContent>
        </Tree.Branch>
      </Show>
    </Tree.NodeProvider>
  )
}

export function TreeFixture(props: TreeFixtureProps) {
  const [local, rootProps] = splitProps(props, ['asChildControls'])
  return (
    <Tree.Root {...rootProps}>
      <Tree.Label>Regression tree</Tree.Label>
      <Tree.Tree>
        <For each={props.collection.rootNode.children}>
          {(node, index) => <FixtureNode node={node} indexPath={[index()]} asChildControls={local.asChildControls} />}
        </For>
      </Tree.Tree>
      <Tree.Context>
        {tree => (
          <>
            <output data-testid="expanded">{JSON.stringify(tree().expandedValue)}</output>
            <output data-testid="selected">{JSON.stringify(tree().selectedValue)}</output>
          </>
        )}
      </Tree.Context>
    </Tree.Root>
  )
}
