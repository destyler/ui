import { Breadcrumbs } from '@destyler-ui/solid/breadcrumbs'
import { For, Show } from 'solid-js'

const initialItems = [
  { id: '1', label: 'Dashboard', href: '/dashboard' },
  { id: '2', label: 'Settings', href: '/settings' },
  { id: '3', label: 'Profile' },
]

export function Context() {
  return (
    <main>
      <Breadcrumbs.Root items={initialItems}>
        <Breadcrumbs.List>
          <Breadcrumbs.Context>
            {breadcrumbs => (
              <>
                <For each={breadcrumbs().items}>
                  {(item, index) => (
                    <Breadcrumbs.Item item={item}>
                      <Breadcrumbs.Link item={item}>
                        <Show when={index() === 0}>
                          <span>🏠</span>
                        </Show>
                        {item.label}
                      </Breadcrumbs.Link>
                      <Show when={item.href}>
                        <Breadcrumbs.Separator>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </Breadcrumbs.Separator>
                      </Show>
                    </Breadcrumbs.Item>
                  )}
                </For>
                <p>Hovered: {breadcrumbs().hoveredId || 'none'}</p>
                <p>Focused: {breadcrumbs().focusedId || 'none'}</p>
              </>
            )}
          </Breadcrumbs.Context>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </main>
  )
}
