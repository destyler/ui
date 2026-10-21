import { Dialog } from '@destyler-ui/vue'
import { createApp, h } from 'vue'

export function mount(target, props) {
  const app = createApp({ render: () => h(Dialog.Root, props, { default: () => [
    h(Dialog.Trigger, {}, { default: () => 'Open' }),
    h(Dialog.Positioner, {}, { default: () => h(Dialog.Content, {}, { default: () => [h(Dialog.Title, {}, { default: () => 'Compatibility' }), h(Dialog.CloseTrigger, {}, { default: () => 'Close' })] }) }),
  ] }) })
  app.mount(target)
  return () => app.unmount()
}
