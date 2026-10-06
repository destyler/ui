import { createApp, h, nextTick } from 'vue'
import { providerFilterCases } from '../../../../../tests/combobox/provider-filter-cases'
import RootProvider from '../examples/RootProvider.vue'

providerFilterCases(async (container) => {
  const app = createApp({ render: () => h(RootProvider) })
  app.mount(container)
  await nextTick()
  return () => app.unmount()
})
