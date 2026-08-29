<script lang="ts">
  import { FloatingPanel } from '../index'
</script>

<FloatingPanel.Root defaultOpen>
  <FloatingPanel.Trigger>Toggle Panel</FloatingPanel.Trigger>
  <FloatingPanel.Dock />
  <FloatingPanel.Positioner>
    <FloatingPanel.Content>
      <FloatingPanel.DragTrigger>
        <FloatingPanel.Header>
          <FloatingPanel.Title>Default Open Panel</FloatingPanel.Title>
          <div data-scope="floating-panel" data-part="trigger-group">
            <FloatingPanel.MinimizeTrigger aria-label="Minimize">_</FloatingPanel.MinimizeTrigger>
            <FloatingPanel.MaximizeTrigger aria-label="Maximize">+</FloatingPanel.MaximizeTrigger>
            <FloatingPanel.RestoreTrigger aria-label="Restore">□</FloatingPanel.RestoreTrigger>
            <FloatingPanel.CloseTrigger aria-label="Close">x</FloatingPanel.CloseTrigger>
          </div>
        </FloatingPanel.Header>
      </FloatingPanel.DragTrigger>
      <FloatingPanel.Body><p>This panel opens by default</p></FloatingPanel.Body>
      <FloatingPanel.ResizeTrigger axis="n" />
      <FloatingPanel.ResizeTrigger axis="e" />
      <FloatingPanel.ResizeTrigger axis="w" />
      <FloatingPanel.ResizeTrigger axis="s" />
      <FloatingPanel.ResizeTrigger axis="ne" />
      <FloatingPanel.ResizeTrigger axis="se" />
      <FloatingPanel.ResizeTrigger axis="sw" />
      <FloatingPanel.ResizeTrigger axis="nw" />
    </FloatingPanel.Content>
  </FloatingPanel.Positioner>
</FloatingPanel.Root>
