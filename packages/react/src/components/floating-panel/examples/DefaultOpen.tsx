import { FloatingPanel } from '../index'

export function DefaultOpen() {
  return (
    <FloatingPanel.Root defaultOpen>
      <FloatingPanel.Trigger>Toggle Panel</FloatingPanel.Trigger>
      <FloatingPanel.Positioner>
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title>Default Open Panel</FloatingPanel.Title>
              <div data-scope="floating-panel" data-part="trigger-group">
                <FloatingPanel.MinimizeTrigger>_</FloatingPanel.MinimizeTrigger>
                <FloatingPanel.MaximizeTrigger>+</FloatingPanel.MaximizeTrigger>
                <FloatingPanel.RestoreTrigger>&#9633;</FloatingPanel.RestoreTrigger>
                <FloatingPanel.CloseTrigger>x</FloatingPanel.CloseTrigger>
              </div>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>
          <FloatingPanel.Body>
            <p>This panel opens by default</p>
          </FloatingPanel.Body>

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
  )
}
