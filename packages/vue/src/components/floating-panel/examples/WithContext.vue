<script setup lang="ts">
import { FloatingPanel } from '../index'
</script>

<template>
  <FloatingPanel.Root>
    <FloatingPanel.Trigger>Toggle Panel</FloatingPanel.Trigger>
    <FloatingPanel.Positioner>
      <FloatingPanel.Content>
        <FloatingPanel.DragTrigger>
          <FloatingPanel.Header>
            <FloatingPanel.Title>Context Demo</FloatingPanel.Title>
            <div data-scope="floating-panel" data-part="trigger-group">
              <FloatingPanel.MinimizeTrigger>-</FloatingPanel.MinimizeTrigger>
              <FloatingPanel.MaximizeTrigger>+</FloatingPanel.MaximizeTrigger>
              <FloatingPanel.RestoreTrigger>&#9633;</FloatingPanel.RestoreTrigger>
              <FloatingPanel.CloseTrigger>x</FloatingPanel.CloseTrigger>
            </div>
          </FloatingPanel.Header>
        </FloatingPanel.DragTrigger>
        <FloatingPanel.Body>
          <FloatingPanel.Context v-slot="api">
            <div>
              <p>Panel state from context:</p>
              <ul>
                <li>Open: {{ api.open ? 'true' : 'false' }}</li>
                <li>Dragging: {{ api.dragging ? 'true' : 'false' }}</li>
                <li>Resizing: {{ api.resizing ? 'true' : 'false' }}</li>
              </ul>
            </div>
          </FloatingPanel.Context>
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
</template>
