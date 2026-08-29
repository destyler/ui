<script lang="ts">
  import { ScrollArea, useScrollArea } from '../index'

  const itemCount = 10_000
  const itemSize = 40
  const id = $props.id()
  const scrollArea = useScrollArea({
    id,
    virtual: { count: itemCount, itemSize, overscan: 5 },
  })
  const virtualItems = $derived(scrollArea().getVirtualItems())
  const totalSize = $derived(scrollArea().getTotalSize())
</script>

<main style="display: flex; flex-direction: column; gap: 16px;">
  <p style="margin: 0;">Rendering {itemCount} items efficiently with virtual scrolling (only {virtualItems.length} DOM nodes)</p>
  <div style="display: flex; gap: 8px;">
    <button onclick={() => scrollArea().scrollToIndex(0)} style="padding: 8px 16px; cursor: pointer;">
      Scroll to Start
    </button>
    <button
      onclick={() => scrollArea().scrollToIndex(Math.floor(itemCount / 2))}
      style="padding: 8px 16px; cursor: pointer;"
    >Scroll to Middle</button>
    <button onclick={() => scrollArea().scrollToIndex(itemCount - 1)} style="padding: 8px 16px; cursor: pointer;">
      Scroll to End
    </button>
  </div>
  <ScrollArea.RootProvider value={scrollArea} style="width: 300px; height: 400px; border: 1px solid #ccc;">
    <ScrollArea.Viewport>
      <ScrollArea.Content style={`height: ${totalSize}px; position: relative;`}>
        {#each virtualItems as item (item.index)}
          <div
            style={`position: absolute; top: 0; left: 0; width: 100%; height: ${itemSize}px; transform: translateY(${item.start}px); padding: 8px 16px; border-bottom: 1px solid #eee; display: flex; align-items: center; box-sizing: border-box;`}
          >Item {item.index + 1}</div>
        {/each}
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" style="width: 8px; background: #f0f0f0;">
      <ScrollArea.Thumb style="background: #888; border-radius: 4px;" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal" style="height: 8px; background: #f0f0f0;">
      <ScrollArea.Thumb style="background: #888; border-radius: 4px;" />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner style="background: #f0f0f0;" />
  </ScrollArea.RootProvider>
</main>
