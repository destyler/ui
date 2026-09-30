<script lang="ts">
  import { Pagination } from '../index'

  let page = $state(1)
</script>

<output>Page {page}</output>
<Pagination.Root count={100} pageSize={10} siblingCount={2} bind:page>
  <Pagination.PrevTrigger>Previous <span class="visually-hidden">Page</span></Pagination.PrevTrigger>
  <Pagination.Context>
    {#snippet render(pagination)}
      {#each pagination().pages as p, index}
        {#if p.type === 'page'}
          <Pagination.Item value={p.value} type={p.type}>{p.value}</Pagination.Item>
        {:else}
          <Pagination.Ellipsis {index}>&#8230;</Pagination.Ellipsis>
        {/if}
      {/each}
    {/snippet}
  </Pagination.Context>
  <Pagination.NextTrigger>Next <span class="visually-hidden">Page</span></Pagination.NextTrigger>
</Pagination.Root>
