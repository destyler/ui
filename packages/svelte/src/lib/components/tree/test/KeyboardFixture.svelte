<script lang="ts">
  import type { ExpandedChangeDetails, FocusChangeDetails, SelectionChangeDetails } from '@destyler/tree'
  import { untrack } from 'svelte'
  import { Tree, createTreeCollection } from '../index'

  interface Node {
    id: string
    disabled?: boolean
    children?: Node[]
  }

  let {
    nodes,
    initialExpanded = [],
    initialSelected = [],
    asChild = false,
    controlled = false,
    onExpandedChange,
    onSelectionChange,
    onFocusChange,
  }: {
    nodes: Node[]
    initialExpanded?: string[]
    initialSelected?: string[]
    asChild?: boolean
    controlled?: boolean
    onExpandedChange?: (details: ExpandedChangeDetails) => void
    onSelectionChange?: (details: SelectionChangeDetails) => void
    onFocusChange?: (details: FocusChangeDetails) => void
  } = $props()

  const collection = $derived(createTreeCollection<Node>({
    nodeToValue: node => node.id,
    nodeToString: node => node.id,
    rootNode: { id: 'root', children: nodes },
  }))
  let expandedValue = $state(untrack(() => [...initialExpanded]))
  let selectedValue = $state(untrack(() => [...initialSelected]))
</script>

{#snippet renderNode(node: Node, indexPath: number[])}
  <Tree.NodeProvider {node} {indexPath}>
    {#if node.children}
      <Tree.Branch>
        {#if asChild}
          <Tree.BranchControl>
            {#snippet asChild(props)}
              <div {...props()} data-composed>
                <Tree.BranchText>{node.id}</Tree.BranchText>
              </div>
            {/snippet}
          </Tree.BranchControl>
        {:else}
          <Tree.BranchControl>
            <Tree.BranchText>{node.id}</Tree.BranchText>
          </Tree.BranchControl>
        {/if}
        <Tree.BranchContent>
          {#each node.children as child, index (child.id)}
            {@render renderNode(child, [...indexPath, index])}
          {/each}
        </Tree.BranchContent>
      </Tree.Branch>
    {:else if asChild}
      <Tree.Item>
        {#snippet asChild(props)}
          <li {...props()} data-composed>
            <Tree.ItemText>{node.id}</Tree.ItemText>
          </li>
        {/snippet}
      </Tree.Item>
    {:else}
      <Tree.Item>
        <Tree.ItemText>{node.id}</Tree.ItemText>
      </Tree.Item>
    {/if}
  </Tree.NodeProvider>
{/snippet}

<output data-expanded>{JSON.stringify(expandedValue)}</output>
<output data-selected>{JSON.stringify(selectedValue)}</output>
<Tree.Root
  {collection}
  selectionMode="multiple"
  defaultExpandedValue={initialExpanded}
  defaultSelectedValue={initialSelected}
  expandedValue={controlled ? expandedValue : undefined}
  selectedValue={controlled ? selectedValue : undefined}
  onExpandedChange={(details) => {
    onExpandedChange?.(details)
    expandedValue = details.expandedValue
  }}
  onSelectionChange={(details) => {
    onSelectionChange?.(details)
    selectedValue = details.selectedValue
  }}
  {onFocusChange}
>
  <Tree.Label>Keyboard regression tree</Tree.Label>
  <Tree.Tree>
    {#each nodes as node, index (node.id)}
      {@render renderNode(node, [index])}
    {/each}
  </Tree.Tree>
</Tree.Root>
