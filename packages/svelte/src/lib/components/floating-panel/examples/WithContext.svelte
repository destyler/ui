<script lang="ts">
  import { FloatingPanel } from '../index'
</script>

<main class="p-10">
  <FloatingPanel.Root>
    <FloatingPanel.Trigger class="px-4 py-2 bg-blue-500 text-white rounded">Toggle Panel</FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
      <FloatingPanel.Content class="bg-white border rounded-lg shadow-lg overflow-hidden">
        <FloatingPanel.DragTrigger class="cursor-move">
          <FloatingPanel.Header class="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
            <FloatingPanel.Title class="text-sm font-medium">Context Demo</FloatingPanel.Title>
            <div data-scope="floating-panel" data-part="trigger-group" class="flex gap-1">
              <FloatingPanel.MinimizeTrigger aria-label="Minimize" class="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">-</FloatingPanel.MinimizeTrigger>
              <FloatingPanel.MaximizeTrigger aria-label="Maximize" class="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">+</FloatingPanel.MaximizeTrigger>
              <FloatingPanel.RestoreTrigger aria-label="Restore" class="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">□</FloatingPanel.RestoreTrigger>
              <FloatingPanel.CloseTrigger aria-label="Close" class="w-6 h-6 flex items-center justify-center hover:bg-red-100 hover:text-red-500 rounded">x</FloatingPanel.CloseTrigger>
            </div>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body class="p-4 relative">
          <FloatingPanel.Context>
            {#snippet render(api)}
              <div class="space-y-2 text-sm">
                <p>Panel state from context:</p>
                <ul class="list-disc pl-4">
                  <li>Open: {api().open ? 'true' : 'false'}</li>
                  <li>Dragging: {api().dragging ? 'true' : 'false'}</li>
                  <li>Resizing: {api().resizing ? 'true' : 'false'}</li>
                </ul>
              </div>
            {/snippet}
          </FloatingPanel.Context>
        </FloatingPanel.Body>
        <FloatingPanel.ResizeTrigger axis="n" class="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-n-resize" />
        <FloatingPanel.ResizeTrigger axis="e" class="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-e-resize" />
        <FloatingPanel.ResizeTrigger axis="w" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-w-resize" />
        <FloatingPanel.ResizeTrigger axis="s" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-s-resize" />
        <FloatingPanel.ResizeTrigger axis="ne" class="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" />
        <FloatingPanel.ResizeTrigger axis="se" class="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" />
        <FloatingPanel.ResizeTrigger axis="sw" class="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
        <FloatingPanel.ResizeTrigger axis="nw" class="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" />
      </FloatingPanel.Content>
    </FloatingPanel.Positioner>
  </FloatingPanel.Root>
</main>
