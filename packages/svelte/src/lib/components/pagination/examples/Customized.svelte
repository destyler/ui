<script lang="ts">
  import { Pagination } from '../index'
</script>

<Pagination.Root
  count={5000}
  pageSize={20}
  siblingCount={3}
  translations={{ nextTriggerLabel: 'Next', prevTriggerLabel: 'Prev', itemLabel: ({ page }) => `Page ${page}` }}
>
  <Pagination.PrevTrigger>Previous <span class="visually-hidden">Page</span></Pagination.PrevTrigger>
  <Pagination.Context>
    {#snippet render(pagination)}
      {#each pagination().pages as page, index}
        {#if page.type === 'page'}
          <Pagination.Item value={page.value} type={page.type}>{page.value}</Pagination.Item>
        {:else}
          <Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
        {/if}
      {/each}
    {/snippet}
  </Pagination.Context>
  <Pagination.NextTrigger>Next <span class="visually-hidden">Page</span></Pagination.NextTrigger>
</Pagination.Root>
