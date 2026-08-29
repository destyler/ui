<script lang="ts">
  import { Tree } from '../index'

  interface Node {
    id: string
    name: string
    children?: Node[]
  }

  let { node, indexPath }: { node: Node; indexPath: number[] } = $props()
</script>

{#snippet renderNode(currentNode: Node, currentIndexPath: number[])}
  <Tree.NodeProvider node={currentNode} indexPath={currentIndexPath}>
    {#if currentNode.children}
      <Tree.Branch>
        <Tree.BranchControl>
          <Tree.BranchTrigger>
            <Tree.BranchText>{currentNode.name}</Tree.BranchText>
            <Tree.BranchIndicator>▶</Tree.BranchIndicator>
          </Tree.BranchTrigger>
        </Tree.BranchControl>
        <Tree.BranchContent>
          <Tree.BranchIndentGuide />
          {#each currentNode.children as child, index (child.id)}
            {@render renderNode(child, [...currentIndexPath, index])}
          {/each}
        </Tree.BranchContent>
      </Tree.Branch>
    {:else}
      <Tree.Item>
        <Tree.ItemIndicator>•</Tree.ItemIndicator>
        <Tree.ItemText>{currentNode.name}</Tree.ItemText>
      </Tree.Item>
    {/if}
  </Tree.NodeProvider>
{/snippet}

{@render renderNode(node, indexPath)}
