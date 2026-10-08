import type { NodeState } from '@destyler/tree'
import type { JSX } from 'solid-js'
import type { UseTreeProps } from '../hooks/use-tree'
import { createSignal, splitProps, untrack } from 'solid-js'
import { createTreeCollection, Tree, useTree } from '../index'

interface Node {
  key: string
  label: string
  disabled?: boolean
  items?: Node[]
}

const leaf: Node = { key: 'leaf', label: 'Custom leaf' }
const branch: Node = { key: 'branch', label: 'Custom branch', items: [leaf] }
const other: Node = { key: 'other', label: 'Disabled branch', disabled: true, items: [{ key: 'other-leaf', label: 'Other leaf' }] }
const collection = createTreeCollection<Node>({
  rootNode: { key: 'root', label: 'Root', items: [branch, other] },
  nodeToValue: node => node.key,
  nodeToString: node => node.label,
  nodeToChildren: node => node.items ?? [],
})

function StateOutput(props: { name: string, state: NodeState }) {
  return <output data-node-state={props.name}>{JSON.stringify(props.state)}</output>
}

function ProviderRoot(props: UseTreeProps<Node> & { children?: JSX.Element }) {
  const [local, treeProps] = splitProps(props, ['children'])
  const tree = useTree(treeProps)
  return <Tree.RootProvider value={tree}>{local.children}</Tree.RootProvider>
}

export function TreeStage2NodeContextFixture(props: { rootProvider?: boolean, uncontrolled?: boolean }) {
  const [updated, setUpdated] = createSignal(false)
  const [swapped, setSwapped] = createSignal(false)
  const Root = untrack(() => props.rootProvider) ? ProviderRoot : Tree.Root
  return (
    <>
      <button type="button" data-update onClick={() => setUpdated(!updated())}>Update state</button>
      <button type="button" data-swap onClick={() => setSwapped(!swapped())}>Swap node</button>
      <Root
        id="node-context"
        collection={collection}
        selectedValue={props.uncontrolled ? undefined : updated() ? ['branch'] : ['leaf']}
        defaultSelectedValue={['leaf']}
        expandedValue={props.uncontrolled ? undefined : updated() ? ['branch'] : []}
        focusedValue={updated() ? 'branch' : 'leaf'}
      >
        <Tree.Context>{api => (
          <button
            type="button"
            data-api-update
            onClick={() => {
              api().setSelectedValue(api().selectedValue.includes('branch') ? ['leaf'] : ['branch'])
              api().setExpandedValue(api().expandedValue.length ? [] : ['branch'])
            }}
          >Update through api()
          </button>
        )}
        </Tree.Context>
        <Tree.NodeProvider node={branch} indexPath={[0]}>
          <Tree.NodeContext>{state => <StateOutput name="outer-before" state={state()} />}</Tree.NodeContext>
          <Tree.BranchControl>Custom branch</Tree.BranchControl>
          <Tree.NodeProvider node={swapped() ? other : leaf} indexPath={swapped() ? [1] : [0, 0]}>
            <Tree.NodeContext>{state => <StateOutput name="inner" state={state()} />}</Tree.NodeContext>
          </Tree.NodeProvider>
          <Tree.NodeContext>{state => <StateOutput name="outer-after" state={state()} />}</Tree.NodeContext>
        </Tree.NodeProvider>
        <Tree.NodeProvider node={other} indexPath={[1]}>
          <Tree.NodeContext>{state => <StateOutput name="sibling" state={state()} />}</Tree.NodeContext>
        </Tree.NodeProvider>
      </Root>
    </>
  )
}
