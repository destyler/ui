<script lang="ts">
  import { Breadcrumbs, useBreadcrumbs } from '../index'

  let items = $state([
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Electronics' },
  ])
  const id = $props.id()
  const breadcrumbs = useBreadcrumbs(() => ({ id, items }))
  function addItem() {
    items = [...items, { id: String(items.length + 1), label: `Item ${items.length + 1}` }]
  }
</script>

<main>
  <button type="button" onclick={addItem}>Add Item</button>
  <Breadcrumbs.RootProvider value={breadcrumbs}>
    <Breadcrumbs.List>
      <Breadcrumbs.Context>
        {#snippet render(api)}
          {#each api().items as item (item.id)}
            <Breadcrumbs.Item {item}>
              <Breadcrumbs.Link {item}>{item.label}</Breadcrumbs.Link>
              {#if item.href}<Breadcrumbs.Separator>/</Breadcrumbs.Separator>{/if}
            </Breadcrumbs.Item>
          {/each}
        {/snippet}
      </Breadcrumbs.Context>
    </Breadcrumbs.List>
  </Breadcrumbs.RootProvider>
</main>
