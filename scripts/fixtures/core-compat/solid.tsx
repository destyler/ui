import { Dialog } from '@destyler-ui/solid'
import { render } from 'solid-js/web'

export function mount(target, props) {
  return render(() => (
    <Dialog.Root {...props}>
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Positioner><Dialog.Content><Dialog.Title>Compatibility</Dialog.Title><Dialog.CloseTrigger>Close</Dialog.CloseTrigger></Dialog.Content></Dialog.Positioner>
    </Dialog.Root>
  ), target)
}
