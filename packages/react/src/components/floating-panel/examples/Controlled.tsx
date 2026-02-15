import { useState } from 'react'
import { FloatingPanel } from '../index'

export function Controlled() {
  const [open, setOpen] = useState(false)

  return (
    <main className="p-10">
      <button
        onClick={() => setOpen(!open)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        External Toggle:
        {open ? ' Close' : ' Open'}
      </button>

      <FloatingPanel.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
        <FloatingPanel.Trigger className="px-4 py-2 bg-blue-500 text-white rounded">
          Toggle Panel
        </FloatingPanel.Trigger>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content className="bg-white border rounded-lg shadow-lg overflow-hidden">
            <FloatingPanel.DragTrigger className="cursor-move">
              <FloatingPanel.Header className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                <FloatingPanel.Title className="text-sm font-medium">
                  Controlled Panel
                </FloatingPanel.Title>
                <div data-scope="floating-panel" data-part="trigger-group" className="flex gap-1">
                  <FloatingPanel.MinimizeTrigger className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">
                    -
                  </FloatingPanel.MinimizeTrigger>
                  <FloatingPanel.MaximizeTrigger className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">
                    +
                  </FloatingPanel.MaximizeTrigger>
                  <FloatingPanel.RestoreTrigger className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded">
                    &#9633;
                  </FloatingPanel.RestoreTrigger>
                  <FloatingPanel.CloseTrigger className="w-6 h-6 flex items-center justify-center hover:bg-red-100 hover:text-red-500 rounded">
                    x
                  </FloatingPanel.CloseTrigger>
                </div>
              </FloatingPanel.Header>
            </FloatingPanel.DragTrigger>
            <FloatingPanel.Body className="p-4 relative">
              <p>This panel is controlled via state</p>
              <p>
                Open state:
                {open ? 'true' : 'false'}
              </p>
            </FloatingPanel.Body>

            <FloatingPanel.ResizeTrigger axis="n" className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-n-resize" />
            <FloatingPanel.ResizeTrigger axis="e" className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-e-resize" />
            <FloatingPanel.ResizeTrigger axis="w" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 cursor-w-resize" />
            <FloatingPanel.ResizeTrigger axis="s" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 cursor-s-resize" />
            <FloatingPanel.ResizeTrigger axis="ne" className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" />
            <FloatingPanel.ResizeTrigger axis="se" className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" />
            <FloatingPanel.ResizeTrigger axis="sw" className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" />
            <FloatingPanel.ResizeTrigger axis="nw" className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </FloatingPanel.Root>
    </main>
  )
}
