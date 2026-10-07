<script lang="ts">
  import { untrack } from 'svelte'
  import { createTreeCollection, Tree, useTree } from '../index'

  interface Node {
    key: string
    label: string
    disabled?: boolean
    items?: Node[]
  }

  const { rootProvider = false, uncontrolled = false }: { rootProvider?: boolean, uncontrolled?: boolean } = $props()
  let updated = $state(false)
  let swapped = $state(false)
  const leaf: Node = { key: 'leaf', label: 'Custom leaf' }
  const branch: Node = { key: 'branch', label: 'Custom branch', items: [leaf] }
  const other: Node = { key: 'other', label: 'Disabled branch', disabled: true, items: [{ key: 'other-leaf', label: 'Other leaf' }] }
  const collection = createTreeCollection<Node>({
    rootNode: { key: 'root', label: 'Root', items: [branch, other] },
    nodeToValue: node => node.key,
    nodeToString: node => node.label,
    nodeToChildren: node => node.items ?? [],
  })
  const tree = untrack(() => rootProvider)
    ? useTree(() => ({
      id: 'node-context',
      collection,
      selectedValue: uncontrolled ? undefined : updated ? ['branch'] : ['leaf'],
      defaultSelectedValue: ['leaf'],
      expandedValue: uncontrolled ? undefined : updated ? ['branch'] : [],
      focusedValue: updated ? 'branch' : 'leaf',
    }))
    : undefined
</script>

<button type="button" data-update onclick={() => updated = !updated}>Update state</button>
<button type="button" data-swap onclick={() => swapped = !swapped}>Swap node</button>

{#snippet nodes()}
  <Tree.Context>
    {#snippet render(api)}
      <button type="button" data-api-update onclick={() => {
        api().setSelectedValue(api().selectedValue.includes('branch') ? ['leaf'] : ['branch'])
        api().setExpandedValue(api().expandedValue.length ? [] : ['branch'])
      }}>Update through API</button>
    {/snippet}
  </Tree.Context>
  <Tree.NodeProvider node={branch} indexPath={[0]}>
    <Tree.NodeContext>
      {#snippet render(state)}<output data-node-state="outer-before">{JSON.stringify(state())}</output>{/snippet}
    </Tree.NodeContext>
    <Tree.BranchControl>Custom branch</Tree.BranchControl>
    <Tree.NodeProvider node={swapped ? other : leaf} indexPath={swapped ? [1] : [0, 0]}>
      <Tree.NodeContext>
        {#snippet render(state)}<output data-node-state="inner">{JSON.stringify(state())}</output>{/snippet}
      </Tree.NodeContext>
    </Tree.NodeProvider>
    <Tree.NodeContext>
      {#snippet render(state)}<output data-node-state="outer-after">{JSON.stringify(state())}</output>{/snippet}
    </Tree.NodeContext>
  </Tree.NodeProvider>
  <Tree.NodeProvider node={other} indexPath={[1]}>
    <Tree.NodeContext>
      {#snippet render(state)}<output data-node-state="sibling">{JSON.stringify(state())}</output>{/snippet}
    </Tree.NodeContext>
  </Tree.NodeProvider>
{/snippet}

{#if tree}
  <Tree.RootProvider value={tree}>{@render nodes()}</Tree.RootProvider>
{:else}
  <Tree.Root
    id="node-context"
    {collection}
    selectedValue={uncontrolled ? undefined : updated ? ['branch'] : ['leaf']}
    defaultSelectedValue={['leaf']}
    expandedValue={uncontrolled ? undefined : updated ? ['branch'] : []}
    focusedValue={updated ? 'branch' : 'leaf'}
  >
    {@render nodes()}
  </Tree.Root>
{/if}
