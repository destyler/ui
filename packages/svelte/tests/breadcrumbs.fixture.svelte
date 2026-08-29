<script lang="ts">
  import { Breadcrumbs, type BreadcrumbItem } from '$lib'

  const items: BreadcrumbItem[] = [
    { id: 'home', label: 'Home', href: '/' },
    { id: 'docs', label: 'Docs' },
  ]
</script>

<Breadcrumbs.Root {items}>
  <Breadcrumbs.List>
    {#each items as item, index (item.id)}
      <Breadcrumbs.Item {item}>
        <Breadcrumbs.Link {item}>{item.label}</Breadcrumbs.Link>
        {#if index < items.length - 1}
          <Breadcrumbs.Separator>/</Breadcrumbs.Separator>
        {/if}
      </Breadcrumbs.Item>
    {/each}
  </Breadcrumbs.List>
</Breadcrumbs.Root>
