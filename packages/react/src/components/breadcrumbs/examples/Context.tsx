import { useState } from 'react'
import { Breadcrumbs } from '../index'

const initialItems = [
  { id: '1', label: 'Dashboard', href: '/dashboard' },
  { id: '2', label: 'Settings', href: '/settings' },
  { id: '3', label: 'Profile' },
]

export function Context() {
  const [hoveredId, _setHoveredId] = useState<string | null>(null)
  const [focusedId, _setFocusedId] = useState<string | null>(null)

  return (
    <main>
      <Breadcrumbs.Root items={initialItems}>
        <Breadcrumbs.List>
          <Breadcrumbs.Context>
            {breadcrumbs => (
              <>
                {breadcrumbs.items.map((item, index) => (
                  <Breadcrumbs.Item key={item.id} item={item}>
                    <Breadcrumbs.Link item={item}>
                      {index === 0 && <span>🏠</span>}
                      {item.label}
                    </Breadcrumbs.Link>
                    {item.href && (
                      <Breadcrumbs.Separator>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Breadcrumbs.Separator>
                    )}
                  </Breadcrumbs.Item>
                ))}
                <p>Hovered: {hoveredId || 'none'}</p>
                <p>Focused: {focusedId || 'none'}</p>
              </>
            )}
          </Breadcrumbs.Context>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </main>
  )
}
