<script lang="ts">
  import { Pagination, usePagination } from '../index'

  const id = $props.id()
  const pagination = usePagination({ id, count: 100, pageSize: 10, siblingCount: 2 })
</script>

<button type="button" onclick={() => pagination().goToNextPage()}>Next Page</button>
<Pagination.RootProvider value={pagination}>
  <Pagination.PrevTrigger>Previous <span class="visually-hidden">Page</span></Pagination.PrevTrigger>
  <Pagination.Context>
    {#snippet render(api)}
      {#each api().pages as page, index}
        {#if page.type === 'page'}
          <Pagination.Item value={page.value} type={page.type}>{page.value}</Pagination.Item>
        {:else}
          <Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
        {/if}
      {/each}
    {/snippet}
  </Pagination.Context>
  <Pagination.NextTrigger>Next <span class="visually-hidden">Page</span></Pagination.NextTrigger>
</Pagination.RootProvider>
