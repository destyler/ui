<script lang="ts">
  import { Breadcrumbs } from '../index'

  const items = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Products', href: '/products' },
    { id: '3', label: 'Electronics', href: '/products/electronics' },
    { id: '4', label: 'Smartphones' },
  ]
</script>

<main>
  <Breadcrumbs.Root {items}>
    <Breadcrumbs.List>
      <Breadcrumbs.Context>
        {#snippet render(breadcrumbs)}
          {#each breadcrumbs().items as item (item.id)}
            <Breadcrumbs.Item {item}>
              <Breadcrumbs.Link {item}>{item.label}</Breadcrumbs.Link>
              {#if item.href}<Breadcrumbs.Separator>/</Breadcrumbs.Separator>{/if}
            </Breadcrumbs.Item>
          {/each}
        {/snippet}
      </Breadcrumbs.Context>
    </Breadcrumbs.List>
  </Breadcrumbs.Root>
</main>
