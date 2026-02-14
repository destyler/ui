import { Breadcrumbs } from '../index'

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
            {breadcrumbs =>
              breadcrumbs.items.map(item => (
                <Breadcrumbs.Item key={item.id} item={item}>
                  <Breadcrumbs.Link item={item}>{item.label}</Breadcrumbs.Link>
                  {item.href && <Breadcrumbs.Separator>/</Breadcrumbs.Separator>}
                </Breadcrumbs.Item>
              ))}
          </Breadcrumbs.Context>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </main>
  )
}
