import { useState } from 'react'
import { Breadcrumbs, useBreadcrumbs } from '../index'

export function RootProvider() {
  const [items, setItems] = useState([
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Electronics' },
  ])

  const breadcrumbs = useBreadcrumbs({ items })

  const addItem = () => {
    const newId = String(items.length + 1)
    const newItem = {
      id: newId,
      label: `Item ${newId}`,
    }
    setItems([...items, newItem])
  }

  return (
    <main>
      <button onClick={addItem}>Add Item</button>
      <Breadcrumbs.RootProvider value={breadcrumbs}>
        <Breadcrumbs.List>
          <Breadcrumbs.Context>
            {api =>
              api.items.map(item => (
                <Breadcrumbs.Item key={item.id} item={item}>
                  <Breadcrumbs.Link item={item}>{item.label}</Breadcrumbs.Link>
                  {item.href && <Breadcrumbs.Separator>/</Breadcrumbs.Separator>}
                </Breadcrumbs.Item>
              ))}
          </Breadcrumbs.Context>
        </Breadcrumbs.List>
      </Breadcrumbs.RootProvider>
    </main>
  )
}
