import { FloatingPanel } from '../'

export function ComponentUnderTest(props: FloatingPanel.RootProps) {
  return (
    <FloatingPanel.Root {...props}>
      <FloatingPanel.Trigger>Toggle Panel</FloatingPanel.Trigger>
      <FloatingPanel.Dock />
      <FloatingPanel.Positioner data-testid="positioner">
        <FloatingPanel.Content>
          <FloatingPanel.DragTrigger>
            <FloatingPanel.Header>
              <FloatingPanel.Title>Floating Panel</FloatingPanel.Title>
              <FloatingPanel.MinimizeTrigger>Minimize</FloatingPanel.MinimizeTrigger>
              <FloatingPanel.MaximizeTrigger>Maximize</FloatingPanel.MaximizeTrigger>
              <FloatingPanel.RestoreTrigger>Restore</FloatingPanel.RestoreTrigger>
              <FloatingPanel.CloseTrigger>Close</FloatingPanel.CloseTrigger>
            </FloatingPanel.Header>
          </FloatingPanel.DragTrigger>
          <FloatingPanel.Body>Panel content</FloatingPanel.Body>
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
