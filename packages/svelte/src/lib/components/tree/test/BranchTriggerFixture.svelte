<script lang="ts">
  import type { HTMLProps } from '$lib/types'
  import { Tree, createTreeCollection } from '../index'

  let {
    asChild = false,
    tabindex,
    onTriggerClick,
    onChildClick,
  }: {
    asChild?: boolean
    tabindex?: number
    onTriggerClick?: () => void
    onChildClick?: () => void
  } = $props()

  const child = { id: 'child', name: 'Child' }
  const branch = { id: 'branch', name: 'Branch', children: [child] }
  const collection = createTreeCollection({
    nodeToValue: node => node.id,
    nodeToString: node => node.name,
    rootNode: { id: 'root', name: '', children: [branch] },
  })
</script>

<Tree.Root {collection}>
  <Tree.Label>Custom trigger tree</Tree.Label>
  <Tree.Tree>
    <Tree.NodeProvider node={branch} indexPath={[0]}>
      <Tree.Branch>
        <Tree.BranchControl>
          {#if asChild}
            <Tree.BranchTrigger
              id="parent-trigger"
              class="parent-trigger"
              data-parent="present"
              onclick={onTriggerClick}
            >
              {#snippet asChild(props)}
                <!-- asChild uses the default div prop types; adapt them for this explicit button. -->
                <button
                  type="button"
                  {...props({
                    id: 'child-trigger',
                    class: 'child-trigger',
                    tabindex: -1,
                    onclick: onChildClick,
                  }) as HTMLProps<'button'>}
                >
                  Custom branch
                </button>
              {/snippet}
            </Tree.BranchTrigger>
          {:else}
            <Tree.BranchTrigger
              id="parent-trigger"
              class="parent-trigger"
              data-parent="present"
              {tabindex}
              onclick={onTriggerClick}
            >
              Default branch
            </Tree.BranchTrigger>
          {/if}
        </Tree.BranchControl>
        <Tree.BranchContent>
          <Tree.NodeProvider node={child} indexPath={[0, 0]}>
            <Tree.Item>
              <Tree.ItemText>{child.name}</Tree.ItemText>
            </Tree.Item>
          </Tree.NodeProvider>
        </Tree.BranchContent>
      </Tree.Branch>
    </Tree.NodeProvider>
  </Tree.Tree>
</Tree.Root>
