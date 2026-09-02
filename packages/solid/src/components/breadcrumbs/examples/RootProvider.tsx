import { Breadcrumbs, useBreadcrumbs } from '@destyler-ui/solid/breadcrumbs'
import { createSignal, For, Show } from 'solid-js'

export function RootProvider() {
  const [items, setItems] = createSignal([
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Electronics' },
  ])
  const breadcrumbs = useBreadcrumbs({
    get items() {
      return items()
    },
  })

  const addItem = () => {
    const id = String(items().length + 1)
    setItems(current => [...current, { id, label: `Item ${id}` }])
  }

  return (
    <main>
      <button type="button" onClick={addItem}>
        Add Item
      </button>
      <Breadcrumbs.RootProvider value={breadcrumbs}>
        <Breadcrumbs.List>
          <Breadcrumbs.Context>
            {api => (
              <For each={api().items}>
                {item => (
                  <Breadcrumbs.Item item={item}>
                    <Breadcrumbs.Link item={item}>{item.label}</Breadcrumbs.Link>
                    <Show when={item.href}>
                      <Breadcrumbs.Separator>/</Breadcrumbs.Separator>
                    </Show>
                  </Breadcrumbs.Item>
                )}
              </For>
            )}
          </Breadcrumbs.Context>
        </Breadcrumbs.List>
      </Breadcrumbs.RootProvider>
    </main>
  )
}
