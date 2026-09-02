import { Breadcrumbs } from '@destyler-ui/solid/breadcrumbs'
import { For, Show } from 'solid-js'

const items = [
  { id: '1', label: 'Home', href: '/' },
  { id: '2', label: 'Products', href: '/products' },
  { id: '3', label: 'Electronics', href: '/products/electronics' },
  { id: '4', label: 'Smartphones' },
]

export function Basic() {
  return (
    <main>
      <Breadcrumbs.Root items={items}>
        <Breadcrumbs.List>
          <Breadcrumbs.Context>
            {breadcrumbs => (
              <For each={breadcrumbs().items}>
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
      </Breadcrumbs.Root>
    </main>
  )
}
